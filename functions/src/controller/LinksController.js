// const credentials = require('../database/credentials.json');

// const { Datastore } = require('@google-cloud/datastore');

const { getData } = require('../api/text');

const { Links } = require('../api/Links');


// //Initialize client.
// const datastore = new Datastore({
//     projectId: credentials.gcpId,
// });

module.exports = {
  async create(req, res) {
    // Define cors and max timout.
    // res.set('Access-Control-Allow-Origin', '*');
    // res.set('Access-Control-Allow-Credentials', 'true');
    // res.set('Access-Control-Max-Age', '3600');

    // Get from user the url and the required language.
    const someURL = req.body.someURL || req.query.someURL;

    // The Orchestrator
    try {
      const { data, host } = await getData(someURL);

      const bundle = new Links(data, host).getLinks();

      // Return bundle to User.
      res.json(bundle);

      // Jump to next level of Middleware carring the bundle.
      // Save in DB send the bundle to user to avoid useless traffic of bundle.
    } catch (error) {
      // Bundle information.

      // Send error to user.
      res.status(error.code).json(error);
    }
  },


};
