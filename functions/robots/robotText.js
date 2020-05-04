const functions = require('firebase-functions');
const admin = require("firebase-admin");
const credentials = require('../dataBank/credentials.json')
const googleTranslate = require("google-translate")(credentials.googleTranslateKey);
const algorithmia = require("algorithmia")(credentials.algorithmiaKey);
const listFilter = require('../dataBank/listFilter.json')
const fs = require('fs');
const axios = require('axios');

const fonts = require('./fonts');


exports = module.exports = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true'); // vital
    res.set('Access-Control-Max-Age', '3600');

    let someURL = req.body.someURL || req.query.someURL;
    let lang = req.body.lang || req.query.lang;

    let bundleNews = await getFrom(someURL);
    let { translatedText, detectedSourceLanguage } = await getTranslationToEn(bundleNews.news);
    bundleNews.news = sanitizeNews(translatedText, bundleNews.host)
    let gringoSummary = await getSummarize(bundleNews.news);
    let gringoHashtags = await getHashtags(bundleNews.news);
    let reference = await getReTranslation(getReferenciate(bundleNews.host), lang);
    let summary = await getReTranslation(gringoSummary, lang);
    let hashtags = await getReTranslation(gringoHashtags, lang);

    bundleNews.langNews = detectedSourceLanguage;
    bundleNews.langCaption = lang;
    bundleNews.caption = buildCaption(summary, reference, hashtags);

    return res.send(bundleNews);
});

async function getFrom(someURL) {
    const options = {
        method: 'get',
        url: someURL,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36'
        }
    };

    const { data, request } = await axios(options)

    /*****************DEBUG SCOPE*******************/
    // writeDebugPage(data)
    // const data = await readDebugPage()
    /*****************DEBUG SCOPE*******************/

    const host = request.connection._host

    const url = host + request.path;

    return Object.assign(from(data, host), { host, url });
}

function from(data, host) {
    let response
    switch (host) {
        case "www.bbc.com":
            response = fonts(data).bbc();
            break
        case "www.cnn.com":
            response = fonts(data).cnn();
            break
        case "www.g1.com":
            response = fonts(data).g1();
            break
        case "www.uol.com":
            response = fonts(data).uol();
            break
        default:
            break;
    }
    return response
}


async function readDebugPage() {
    return await new Promise((resolve, reject) => {
        fs.readFile('./robots/output.json', 'utf8', (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
}

async function writeDebugPage(content) {
    return await new Promise((resolve, reject) => {
        fs.writeFile("./robots/output.json", content, 'utf8', (err) => {
            if (!err) {
                resolve();
            } else {
                reject(err);
            }
        });
    });
}

async function getTranslationToEn(strings) {
    let translated = [];
    let response = await new Promise((resolve, reject) => {
        googleTranslate.translate(strings, 'en', (error, translations) => {
            if (!error) {
                resolve(translations);
            } else {
                reject(error);
            }
        });
    });

    if (Array.isArray(strings)) {
        response.map(s => translated.push(s.translatedText));
        response.translatedText = translated;
        let { detectedSourceLanguage } = await getTranslationToEn(strings.join(' '));
        response.detectedSourceLanguage = detectedSourceLanguage;
        return response
    } else {
        return response;
    }
}

async function getReTranslation(strings, lang) {
    if (lang === 'en') {
        return strings
    }
    else {
        let response = await new Promise((resolve, reject) => {
            googleTranslate.translate(strings, 'en', lang, (error, translations) => {
                if (!error) {
                    resolve(translations);
                } else {
                    reject(error);
                }
            });
        });
        return response.translatedText;
    }
}

async function getSummarize(news) {
        let response = await algorithmia
            .algo('nlp/Summarizer/0.1.8')
            .pipe(news)
        return response.get()
}

async function getHashtags(news) {
    let response = await algorithmia
        .algo("SummarAI/Summarizer/0.1.3")
        .pipe(news)
    let { auto_gen_ranked_keywords } = response.get();
    return auto_gen_ranked_keywords.join(' ')
}

function getReferenciate(host) {
    return `(Font: www.${host})`
}

function buildCaption(summary, reference, hashtags) {
    console.log(hashtags)
    let arrays = [summary, reference, hashtags.split(' ').slice(0, 5).map(s => "#" + s).join(' ')].join(' \n ');
    return arrays;
}

function sanitizeNews(news, host) {
    return news.filter((item) => {
        return !listFilter[host].includes(item);
    }).join(' ')
        .replace(/''/gi, '')
}

