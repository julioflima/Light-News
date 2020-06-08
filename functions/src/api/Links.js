const cheerio = require('cheerio');

class Links {
  constructor(data, host) {
    this.data = data;
    this.host = host;
  }

  getLinks() {
    const $ = cheerio.load(this.data);
    const approves = [];
    const reject = [];

    return {
      'www.bbc.com': () => {
        $('a').each(() => {
          let link = $(this).attr('href');

          if (link[0] !== 'h') {
            link = `http://${this.host}${link}`;
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
    }[this.host];
  }
}

module.exports = { Links };
