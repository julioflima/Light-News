const parse = require('url-parse');

// eslint-disable-next-line import/no-unresolved
const listFilter = require('../database/listFilter.json');


module.exports = {
  host(url, helpers, subject) {
    const host = parse(url).hostname;
    const hosts = Object.keys(listFilter[subject]);
    if (hosts.includes(host)) {
      return url;
    }
    return helpers.message({
      custom: `This host is not available in '${subject}' application. You can try these hosts: ${hosts}`,
    });
  },
};
