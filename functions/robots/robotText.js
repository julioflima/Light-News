const functions = require('firebase-functions');
const admin = require("firebase-admin");
const credentials = require('../dataBank/credentials.json')
const googleTranslate = require("google-translate")(credentials.googleTranslateKey);
const request = require('request');
const cheerio = require('cheerio');
const listFilter = require('../dataBank/listFilter.json')

exports = module.exports = functions.https.onRequest(async (req, res) => {
    let news = await getFromBBC(req);
    let { translatedText, detectedSourceLanguage } = await getTranslation(news.join(' '));
    let hasTags = getHashtags(translatedText);
    // let reNews = await getReTranslation(translatedText, detectedSourceLanguage)
    res.send(hasTags)

});


async function getFromBBC(req) {
    const someURL = req.body.someURL;
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9';
    let options = {
        method: 'get',
        url: someURL,
        headers: {
            'User-Agent': userAgent
        }
    };

    let news = [];
    const body = await doRequest(options)
    let $ = cheerio.load(body);
    $('p').each(function () {
        news.push($(this).text());
    });

    let bbcFilter = listFilter.bbc;
    news = news.filter(function (item) {
        return !bbcFilter.includes(item);
    });

    return news

}

function doRequest(options) {
    return new Promise(function (resolve, reject) {
        request(options, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}


function getTranslation(strings) {
    return new Promise(function (resolve, reject) {
        googleTranslate.translate(strings, 'en', function (error, translations) {
            if (!error) {
                resolve(translations);
            } else {
                reject(error);
            }
        });
    });
}

function getReTranslation(strings, lang) {
    return new Promise((resolve, reject) => {
        googleTranslate.translate(strings, 'en', lang, (error, translations) => {
            if (!error) {
                resolve(translations);
            } else {
                reject(error);
            }
        });
    });
}


function getSummarize(strings, lang) {
    return new Promise((resolve, reject) => {
        googleTranslate.translate(strings, 'en', lang, (error, translations) => {
            if (!error) {
                resolve(translations);
            } else {
                reject(error);
            }
        });
    });
}

function getHashtags(news) {
    return new Promise((resolve, reject) => {
        Algorithmia.client(credentials.algoritmiaKey)
            .algo("SummarAI/Summarizer/0.1.3?timeout=300") // timeout is optional
            .pipe(news)
            .then((response) => {
                let { auto_gen_ranked_keywords } = response.get()
                resolve(auto_gen_ranked_keywords);
            })
            .catch((error) => {
                reject(error)
            });
    });
}

