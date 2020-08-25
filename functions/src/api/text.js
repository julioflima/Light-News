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
    newString.forEach(async (elem) => new Promise((resolve) => {
      resolve(arrayStrings.push(googleTranslate(elem, { to: 'en' })));
    }));
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
    return news.filter((item) => listFilter.words[host].every((each) => !(self.similarity(item, each) > 0.4))).join(' ').replace(/&#9642/gi, '');
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

  similarity(string1, string2) {
    function levenshteinDistance(s1, s2) {
      const costs = [];
      for (let i = 0; i <= s1.length; i += 1) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j += 1) {
          if (i === 0) costs[j] = j;
          else if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
        if (i > 0) costs[s2.length] = lastValue;
      }
      return costs[s2.length];
    }

    function compareString(s1, s2) {
      let longer = s1.toLowerCase();
      let shorter = s2.toLowerCase();

      if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
      }
      const longerLength = longer.length;
      if (longerLength === 0) {
        return 1.0;
      }
      return (longerLength - levenshteinDistance(longer, shorter)) / parseFloat(longerLength);
    }

    return compareString(string1, string2);
  },
};

module.exports = self;
