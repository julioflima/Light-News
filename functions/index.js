const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
const cors = require('cors');

const routes = require('./routes')

//Init firebase.
admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true });

// Automatically allow cross-origin requests
app.use(cors());

//Routers requires and calls.
app.use(routes)

exports.app = functions.https.onRequest(app);

/**
* Métodos HTTP:
*
* GET: Buscar uma informação no back-end.
* POST: Criar uma informação no back-end.
* PUT: Alterar uma informação no back-end.
* DELETE: Deletar umas informação no back-end.
*/

/** 
*
*
* Query Params: Parâmetros nomeados enviados na rota após "?" (filtros, paginação).
* Route Params: Parâmetros utilizados para identificar recursos após "/:".
* Request Body: Corpo da requisição, utilizado para criara ou alterar recursos.
*/


/**
 * SQL: MySQL, SQLite, PostfreeSQL, Oracle, Microsoft SQL Server.
 * NoSQL: MongoDB, CouchDB, etc.
*/

/**
 * Driver: SELECT *FROM users
 * Query Builder: table('user').select('*').where()
*/
