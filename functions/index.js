const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '1GB'
}

exports.robotText = require('./robots/robotText');

exports.myStorageFunction = functions
    .runWith(runtimeOpts)
    .storage
    .object()

