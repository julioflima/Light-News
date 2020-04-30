const functions = require('firebase-functions');
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://minevideo-2ceee.firebaseio.com"
}, "somethingToWatch");

const db = admin.firestore();

exports = module.exports = functions.https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    let result;
    if (req.query.searchTerm === undefined) {
        result = req.body;
    } else {
        result = req.query;
    }

    dataInput = {
        'docId': '...',
        'status': 'doing',
        'log': 'something rised',
        'language': detection.language,
        'timestamp': admin.firestore.FieldValue.serverTimestamp(),
        content: {
            'searchTerm': result.searchTerm,
            'prefix': '...',
            'sourceContentOriginal': "...",
            'sourceContentSanitized': "...",
            'sentences': [
                {
                    'text': "...",
                    'keywords': ["..."],
                    'images': ["..."]
                }
            ]
        }
    }

    return db.collection('console').add(dataInput, { merge: true }).then((docRef) => {
        docRef.get().then((doc) => {
            if (doc.exists) {
                data = doc.data();
                data.docId = docRef.id;
                throw res.send(data);
            } else {
                throw res.send("No such document!");
            }
        }).catch((error) => {
            throw res.send("Error getting document:", error);
        });
        return true;
    }).catch((error) => {
        throw res.send("Error adding document: ", error);
    });
});
