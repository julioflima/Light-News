const functions = require('firebase-functions');
const admin = require("firebase-admin");
const googleTrends = require('google-trends-api');
const math = require('mathjs')
const googleTranslate = require("google-translate");
const serviceAccount = require("../serviceAccountKey");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://minevideo-2ceee.firebaseio.com"
}, "getPrefixTrend");

const db = admin.firestore();

exports = module.exports = functions.https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    let result;
    if (req.query.docId === undefined) {
        result = req.body;
    } else {
        result = req.query;
    }

    const prefixes = ['Who is', 'What is', 'The history of']
    let prefixTrends = []
    prefixTrend = '';
    prefixes.forEach((elem) => {
        prefixTrends.push(elem + ' ' + result.searchTerm);
    });

    googleTrends.interestOverTime({ keyword: prefixTrends }).then((results) => {
        let data = JSON.parse(results);
        let values = [];
        data.default.timelineData.forEach((elem) => {
            values.push(elem.value);
        });
        let mostTrends = [];
        math.transpose(values).forEach((elem) => {
            mostTrends.push(math.sum(elem));
        });

        prefixTrend = prefixes[mostTrends.indexOf(math.max(mostTrends))];
        // throw res.send({prefixTrend})
        console.log("Prefix: ", prefixTrend);
        throw res.send(dataBase(result.docId, prefixTrend))
    }).catch((err) => {
        console.error('Oh no there was an error', err);
        prefixTrend = prefixes[Math.random() * prefixes.length];
        throw res.send(dataBase(result.docId, prefixTrend))
    });
});

function dataBase(docId, prefixTrend) {
    return db.collection('console').doc(docId).update({
        log: 'most prefix is',
        'timestamp': admin.firestore.FieldValue.serverTimestamp(),
        content: {
            prefix: prefixTrend
        }
    }).then(() => {
        return db.collection('console').doc(docId).get().then((doc) => {
            return doc.data();
        }).catch((error) => {
            return ["Error getting document:", error];
        });
    }).catch((error) => {
        return ["Error getting document:", error];
    });
}