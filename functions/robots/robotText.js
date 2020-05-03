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

    let bundleNews = await getFromBBC(req);
    let translationNews = await getTranslation(bundleNews.news);
    let gringoSummary = await getSummarize(translationNews);
    let gringoHashtags = await getHashtags(translationNews);
    let summary = await getReTranslationSummary(gringoSummary);
    let hashtags = await getReTranslationHashtags(gringoHashtags);
    bundleNews.news = buildCaption(summary, hashtags)

    res.send(JSON.stringify(bundleNews))
});

async function getFromBBC(req) {
    let options = {
        method: 'get',
        url:  req.body.someURL || req.query.someURL,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36'
        }
    };

    const { data } = await axios(options)

    /*****************DEBUG SCOPE*******************/
    // writeDebugPage(data)
    // const data = await readDebugPage()
    /*****************DEBUG SCOPE*******************/

    let $ = cheerio.load(data);

    let news = [];
    $('p').each(function () {
        news.push($(this).text());
    });

    news = news.filter((item) => {
        return !listFilter.bbc.includes(item);
    }).join(' ')

    let imgNews = [];
    $('img').each(function (index, element) {
        imgNews.push({ 'src': $(this).attr('src'), 'alt': $(this).attr('alt') })
    });

    return { news, imgNews }
}

async function getTranslation(strings) {
    let response = await new Promise((resolve, reject) => {
        googleTranslate.translate(strings, 'en', (error, translations) => {
            if (!error) {
                resolve(translations);
            } else {
                reject(error);
            }
        });
    });
    return response.translatedText;
}

async function getReTranslationSummary(strings) {
    let response = await new Promise((resolve, reject) => {
        googleTranslate.translate(strings, 'en', 'pt', (error, translations) => {
            if (!error) {
                resolve(translations);
            } else {
                reject(error);
            }
        });
    });
    return response.translatedText;
}

async function getReTranslationHashtags(strings) {
    let response = await new Promise((resolve, reject) => {
        googleTranslate.translate(strings, 'en', 'pt', (error, translations) => {
            if (!error) {
                resolve(translations);
            } else {
                reject(error);
            }
        });
    });
    let newHash = []
    response.forEach((s) => { newHash.push(s.translatedText) })
    return newHash;
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
    return auto_gen_ranked_keywords
}

function buildCaption(summary, hashtags) {
    let arrays = [summary, hashtags.slice(0, 5).map(s => "#" + s).join(' ')].join(' /n/n/n ');
    return arrays;
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
