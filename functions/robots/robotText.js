const functions = require('firebase-functions');
const admin = require("firebase-admin");
const credentials = require('../dataBank/credentials.json')
const googleTranslate = require("google-translate")(credentials.googleTranslateKey);
const cheerio = require('cheerio');
const algorithmia = require("algorithmia")(credentials.algorithmiaKey);
const listFilter = require('../dataBank/listFilter.json')
const fs = require('fs');
const axios = require('axios');

exports = module.exports = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true'); // vital
    res.set('Access-Control-Max-Age', '3600');

    let someURL = req.body.someURL || req.query.someURL;
    let lang = req.body.lang || req.query.lang;

    let bundleNews = await getFromBBC(someURL);
    let { translatedText, detectedSourceLanguage } = await getTranslationToEn(bundleNews.news);
    let gringoSummary = await getSummarize(translatedText);
    let gringoHashtags = await getHashtags(translatedText);
    let summary = await getReTranslation(gringoSummary, lang);
    let hashtags = await getReTranslation(gringoHashtags, lang);
    let reference = await getReTranslation(referenciate(bundleNews.host), lang);

    bundleNews.langNews = detectedSourceLanguage;
    bundleNews.langCaption = lang;
    bundleNews.caption = buildCaption(summary, reference, hashtags);

    return res.send(bundleNews);
});

async function getFromBBC(someURL) {
    let options = {
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


    let host = request.connection._host

    let url = host + request.path

    let $ = cheerio.load(data);

    let news = [];
    $('p').each(function () {
        news.push($(this).text());
    });

    news = news.filter((item) => {
        return !listFilter.bbc.includes(item);
    }).join(' ')

    let imgNews = [];
    $('img').each(function () {
        imgNews.push({ 'src': $(this).attr('src'), 'alt': $(this).attr('alt') })
    });

    return { news, imgNews, host, url }
}

async function getTranslationToEn(strings) {
    let response = await new Promise((resolve, reject) => {
        googleTranslate.translate(strings, 'en', (error, translations) => {
            if (!error) {
                resolve(translations);
            } else {
                reject(error);
            }
        });
    });
    return response;
}

async function getReTranslation(strings, lang) {
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

async function getSummarize(news) {
    try {
        let response = await algorithmia
            .algo('nlp/Summarizer/0.1.8')
            .pipe(news)
        return response.get()
    }
    catch (error) {
        console.log(error)
    }
}

async function getHashtags(news) {
    let response = await algorithmia
        .algo("SummarAI/Summarizer/0.1.3")
        .pipe(news)
    let { auto_gen_ranked_keywords } = response.get();
    return auto_gen_ranked_keywords.join(' ')
}

function buildCaption(summary, reference, hashtags) {
    console.log(hashtags)
    let arrays = [summary, reference, hashtags.split(' ').slice(0, 5).map(s => "#" + s).join(' ')].join(' /n ');
    return arrays;
}

function referenciate(host) {
    return `(Font: www.${host}`
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
