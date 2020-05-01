const functions = require('firebase-functions');
const admin = require("firebase-admin");
const credentials = require('../dataBank/credentials.json')
const googleTranslate = require("google-translate")(credentials.googleTranslateKey);
const request = require('request');
const cheerio = require('cheerio');
const algorithmia = require("algorithmia")(credentials.algorithmiaKey);
const listFilter = require('../dataBank/listFilter.json')
const fs = require('fs');

exports = module.exports = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true'); // vital
    res.set('Access-Control-Max-Age', '3600');

    let bundleNews = await getFromBBC(req);
    // let translationNews = await getTranslation(bundleNews.news);
    // let gringoSummary = await getSummarize(translationNews);
    // let gringoHashtags = await getHashtags(translationNews);
    // let summary = await getReTranslationSummary(gringoSummary);
    // let hashtags = await getReTranslationHashtags(gringoHashtags);
    // let caption = buildCaption(summary, hashtags)

    res.send(bundleNews)
});


async function getFromBBC(req) {
    let options = {
        method: 'get',
        url: req.body.someURL,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
        }
    };


    // const body = await doRequest(options)

    /*****************DEBUG SCOPE*******************/
    const body = await readDebugPage()
    // writeDebugPage(body)
    /*****************DEBUG SCOPE*******************/


    let $ = cheerio.load(body);

    let news = [];
    $('p').each(function () {
        news.push($(this).text());
    });

    news = news.filter((item) => {
        return !listFilter.bbc.includes(item);
    }).join(' ')

    let imgsNews = [];
    $('.story-body img').each(function () {
        // imgsNews.push({ 'src': $(this)[0].src, 'alt': $(this)[0].alt });
    });

    let len = $('.story-body').children('img').length


    console.log(len)





    // return { 'news': news, 'imgs': imgsNews }
    return news
}

function doRequest(options) {
    return new Promise((resolve, reject) => {
        request(options, (error, res, body) => {
            if (!error && res.statusCode === 200) {
                // dataBank(res.request.uri.host + res.request.uri.path)
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
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

function dataBank(link) {
    fs.readFile('../dataBank/newsBank.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
            if (obj.link == undefined) {
                obj.push
            }
            obj.table.push({ id: 2, square: 3 }); //add some data
            json = JSON.stringify(obj); //convert it back to json
        }
    });

}

function buildCaption(summary, hashtags) {
    let arrays = [summary, hashtags.slice(0, 5).map(s => "#" + s).join(' ')].join(' /n/n/n ');
    return arrays;
}


async function readDebugPage() {
    return await new Promise((resolve, reject) => {
        fs.readFile('output.json', 'utf8', function readFileCallback(err, data) {
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
        fs.writeFile("output.json", content, 'utf8', function (err) {
            if (!err) {
                resolve();
            } else {
                reject(err);
            }
        });
    });
}
