const cheerio = require('cheerio');
const parse = require('url-parse');

// eslint-disable-next-line import/no-useless-path-segments
const { similarity } = require('../api/text');

const { links } = require('../database/listFilter.json');


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
        $('a').each((i, each) => {
          let link = $(each).attr('href');

          link = this.sanitizeLink(link);

          const part = link.split('/')[1];
          if (!approves.includes(link) && !reject.includes(link)) {
            if (part === 'portuguese') approves.push(link);
            else reject.push(link);
          }
        });

        // const backup = approves;

        console.log(links);

        // const sanitized = approves.filter((item) => {
        //   let max = 0;
        //   listLinks.links.some((each) => {
        //     const value = similarity(item, each);
        //     if (value > max) max = value;
        //     // if (value > 0.4) return true;
        //   });
        //   console.log((`${item}                           `).slice(0, 30), max);
        // });

        return { approves, reject };
      },
    }[this.host]();
  }

  sanitizeLink(junkLink) {
    let link = junkLink;
    if (link[0] !== 'h') link = `${this.host}${link}`;
    const url = parse(link);
    return (url.hostname + url.pathname).replace('www.', '');
  }
}

module.exports = Links;
