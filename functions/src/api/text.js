// eslint-disable-next-line import/order
const { algorithmiaKey } = require('../database/credentials.json');
// eslint-disable-next-line import/order
const listFilter = require('../database/listFilter.json');

const googleTranslate = require('@vitalets/google-translate-api');
const axios = require('axios');
const algorithmia = require('algorithmia')(algorithmiaKey);


const self = {
  async  getData(someURL) {
    const options = {
      method: 'get',
      url: someURL,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
      },
    };
    const { data, request } = await axios(options);
    // eslint-disable-next-line no-underscore-dangle
    const host = request.connection._host;
    const url = host + request.path;

    return { data, host, url };
  },

  async  getTranslationToEn(strings) {
    const newString = self.xTranslations(strings);
    const arrayStrings = [];
    let news = [];
    let lang = [];
    newString.forEach(async (elem) => {
      Promise((resolve) => {
        resolve(arrayStrings.push(googleTranslate(elem, { to: 'en' })));
      });
    });
    const response = await Promise.all(arrayStrings);
    response.forEach((elem) => {
      news.push(elem.text);
      lang.push(elem.from.language.iso);
    });
    lang = self.mode(lang);
    news = news.join('  ').split('');
    return { news, lang };
  },

  async  getReTranslation(strings, lang) {
    if (lang === 'en') {
      return strings;
    }

    const response = await googleTranslate(strings, { to: lang });
    return response.text;
  },

  sanitizeNews(news, host) {
    // console.log(news)
    const sanitized = news.filter((item) => !listFilter.words[host].includes(item)).join(' ')
      .replace(/&#9642/gi, '');
    // console.log(sanitized)
    return sanitized;
  },

  translatedLang(reqLang, detectedLang) {
    if (!reqLang) {
      return detectedLang;
    }

    return reqLang;
  },

  async  getSummarize(news) {
    const response = await algorithmia
      .algo('nlp/Summarizer/0.1.8')
      .pipe(news);
    return response.get();
  },

  async  getHashtags(news) {
    const response = await algorithmia
      .algo('SummarAI/Summarizer/0.1.3')
      .pipe(news);
    const { auto_gen_ranked_keywords: autoGenRankedKeywords } = response.get();
    return autoGenRankedKeywords.join(' ');
  },

  getReferenciate(host) {
    return `(Font: www.${host})`;
  },

  buildCaption(summary, reference, hashtags) {
    const arrays = [summary, reference, hashtags.split(' ').slice(0, 5).map((s) => `#${s}`).join(' ')].join(' \n ');
    return arrays;
  },

  xTranslations(strings) {
    const xTrans = [];
    let auxString = [];
    for (let index = 0; index < strings.length; index += 1) {
      auxString.push(strings[index]);
      if (auxString.join('  ').length > 10000) {
        auxString.pop();
        xTrans.push(auxString.join('  '));
        auxString = [];
        index -= 1;
      }
      if (strings.length - index === 1) {
        xTrans.push(auxString.join('  '));
      }
    }
    return xTrans;
  },

  mode(arr) {
    return arr.sort((a, b) => arr.filter((v) => v === a).length
      - arr.filter((v) => v === b).length).pop();
  },

};

module.exports = self;
