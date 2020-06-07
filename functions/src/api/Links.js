const cheerio = require('cheerio');

class Links {
  constructor(data, host) {
    this.data = data;
    this.host = host;
  }

  getLinks(data, host) {
    const $ = cheerio.load(data);

    return {
      'www.bbc.com': () => {
        const approves = [];
        const reject = [];

        $('a').each(() => {
          let link = $(this).attr('href');

          if (link[0] !== 'h') {
            link = `http://${host}${link}`;
          }

          const part = link.split('/')[3];

          if (!approves.includes(link) && !reject.includes(link)) {
            if (part === 'portuguese'
              && !(link.search('www.bbc.com/portuguese/topics') > 0)
              && !(link.search('www.bbc.com/portuguese/media') > 0)) {
              approves.push(link);
            } else {
              reject.push(link);
            }
          }
        });


        return { approves, reject };
      },
    }[host];
  }
}

module.exports = { Links };
