const crypto = require('crypto')
const { Datastore } = require('@google-cloud/datastore');

const { getNews, getFrom, hostAvailable, sanitizeNews, getSummarize,
    getHashtags, getTranslationToEn, getReTranslation, translatedLang,
    getReferenciate, buildCaption, } = require('../robots/text')
const credentials = require('../database/credentials.json')

const datastore = new Datastore();


module.exports = {
    async create(req, res, next) {
        //Define cors and max timout.
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Access-Control-Max-Age', '3600');

        //Get from user the url and the required language.
        let someURL = req.body.someURL || req.query.someURL;
        let lang = req.body.lang || req.query.lang;

        //The Orchestrator
        try {
            let { data, host, url } = await getNews(someURL);
            hostAvailable(host, url);
            let { news, imgNews } = getFrom(host, data);
            let translated = await getTranslationToEn(news);
            let langCaption = translatedLang(lang, translated.lang);
            let sanitizedNews = sanitizeNews(translated.news, host)
            let gringoSummary = await getSummarize(sanitizedNews);
            let gringoHashtags = await getHashtags(sanitizedNews);
            let strutureRef = getReferenciate(host)
            let reference = await getReTranslation(strutureRef, langCaption);
            let summary = await getReTranslation(gringoSummary, langCaption);
            let hashtags = await getReTranslation(gringoHashtags, langCaption);
            let caption = buildCaption(summary, reference, hashtags);

            //Bundle information.
            let bundle = {
                'news': sanitizedNews,
                'imgNews':imgNews,
                'host': host,
                'url': url,
                'timestamp': new Date().toJSON(),
                'langNews': translated.lang,
                'langCaption': langCaption,
                'caption': caption
            }

            //Return bundle to User.
            res.json(bundle)

            //Jump to next level of Middleware carring the bundle.
            //Save in DB send the bundle to user to avoid useless traffic of bundle.
            res.locals.bundle = bundle;
            return next();
        }
        catch (error) {
            //Bundle information.
            let bundle = {
                'url': someURL,
                'timestamp': new Date().toJSON(),
                'langCaption': lang,
            }

            //Send error to user.
            res.status(error.code).json(error);

            res.locals.bundle = bundle;
            return next();
        }
    },

    async save(req, res, next) {
        //Get from previous level of Middleware the bundle
        let bundle = res.locals.bundle;

        //Initialize client.
        const datastore = new Datastore({
            projectId: credentials.gcpId,
        });

        //If caption is defined save them in DB. If not occurred an error and save the link originated the error.
        try {
            if (bundle.caption) {
                await datastore.upsert({
                    key: datastore.key(['News', bundle.url, 'Font', bundle.host,]),
                    data: bundle,
                    excludeFromIndexes: [
                        'news'
                    ]
                });
            }
            else {
                await datastore.upsert({
                    key: datastore.key('Error', bundle.url),
                    data: bundle
                });
            }
        } catch (err) {
            console.error('ERROR:', err);
        }
        return res.end()

    },

    async index(req, res, next) {
        // const { page = 1 } = req.query;

        // const count = await connection('incidents').count().first();

        // const incidents = await connection('incidents')
        //     .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        //     .limit(5)
        //     .offset((page - 1) * 5)
        //     .select(
        //         'incidents.*',
        //         'ongs.name',
        //         'ongs.email',
        //         'ongs.whatsapp',
        //         'ongs.city',
        //         'ongs.uf');

        // res.header('X-Total-Count', count['count(*)']);

        // return res.json(incidents);
    },

    async delete(req, res, next) {
        //     const { id } = req.params;
        //     const ong_id = req.headers.authorization;


        //     const incidents = await connection('incidents')
        //         .where('id', id)
        //         .select('ong_id')
        //         .first();

        //     if (!incidents) {
        //         return res.status(404).json({ error: 'Was not found that incident.' });
        //     } else if (incidents.ong_id !== ong_id) {
        //         return res.status(401).json({ error: 'Operation not permitted.' });
        //     } else {
        //         await connection('incidents')
        //             .where('id', id)
        //             .delete();

        //         return res.status(204).send();
        //     }
    }
}