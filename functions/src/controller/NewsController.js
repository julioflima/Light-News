const { Datastore } = require('@google-cloud/datastore');

const {
  getData, sanitizeNews, getSummarize,
  getHashtags, getTranslationToEn, getReTranslation, translatedLang,
  getReferenciate, buildCaption,
} = require('../api/text');

const News = require('../api/News');

const credentials = require('../database/credentials.json');

//  Initialize client.
const datastore = new Datastore({
  projectId: credentials.gcpId,
});

module.exports = {
  async create(req, res, next) {
    //  Define cors and max timout.
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Max-Age', '3600');

    //  Get from user the url and the required language.
    const someURL = req.body.someURL || req.query.someURL;
    const lang = req.body.lang || req.query.lang;

    //  The Orchestrator
    try {
      console.log(someURL);
      const { data, host, url } = await getData(someURL);
      const { news, imgNews } = await new News(data, host).getNews();
      const translated = await getTranslationToEn(news);
      const langCaption = translatedLang(lang, translated.lang);
      const sanitizedNews = sanitizeNews(translated.news, host);
      const gringoSummary = await getSummarize(sanitizedNews);
      const gringoHashtags = await getHashtags(sanitizedNews);
      const strutureRef = getReferenciate(host);
      const reference = await getReTranslation(strutureRef, langCaption);
      const summary = await getReTranslation(gringoSummary, langCaption);
      const hashtags = await getReTranslation(gringoHashtags, langCaption);
      const caption = buildCaption(summary, reference, hashtags);


      //  Bundle information.
      const bundle = {
        news: sanitizedNews,
        imgNews,
        host,
        url,
        timestamp: new Date(),
        langNews: translated.lang,
        langCaption,
        caption,
        summary,
        hashtags,
      };

      //  Return bundle to User.
      res.json(bundle);

      //  Jump to next level of Middleware carring the bundle.
      //  Save in DB send the bundle to user to avoid useless traffic of bundle.
      res.locals.bundle = bundle;
      return next();
    } catch (error) {
      //  Bundle information.
      const bundle = {
        url: someURL,
        timestamp: new Date(),
        langCaption: lang,
      };

      // Send error to user.
      res.status(error.code).json(error);

      res.locals.bundle = bundle;
      return next();
    }
  },

  async save(res) {
    //  Get from previous level of Middleware the bundle
    const { bundle } = res.locals;

    // If caption is defined save them in DB.
    // If not occurred an error and save the link originated the error.
    try {
      if (bundle.caption) {
        await datastore.save({
          key: datastore.key(['News', bundle.url, 'Font', bundle.host]),
          data: bundle,
          excludeFromIndexes: [
            'news',
          ],
        });
      } else {
        await datastore.save({
          key: datastore.key('Error', bundle.url),
          data: bundle,
        });
      }
    } catch (err) {
      res.status(err.code).json(err);
    }
    return res.end();
  },

  async index(req, res) {
    const { pageCursor } = req.query;

    try {
      const query = datastore.createQuery('Font')
        .start(pageCursor)
        .order('timestamp', {
          descending: true,
        })
        // .select([
        //     'hashtags',
        //     'host',
        //     'imgNews.alt',
        //     'imgNews.src',
        //     'summary',
        //     'url',
        // ])
        .limit(1);

      const results = await datastore.runQuery(query);
      res.send(results);
    } catch (err) {
      res.send(err);
    }
  },

  async delete(req, res) {
    const { news, font } = req.body;
    const taskKey = datastore.key(['News', news, 'Font', font]);
    const response = await datastore.delete(taskKey);
    res.send(response);
  },

};
