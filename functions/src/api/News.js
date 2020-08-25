const cheerio = require('cheerio');

class News {
  constructor(data, host) {
    this.data = data;
    this.host = host;
  }

  getNews() {
    const $ = cheerio.load(this.data);
    const news = [];
    const imgNews = [];

    return {
      'www.bbc.com': () => {
        $('p').each((i, each) => {
          news.push($(each).text());
        });

        $('img').each((i, each) => {
          imgNews.push({ src: $(each).attr('src'), alt: $(each).attr('alt') });
        });

        return { news, imgNews };
      },
    }[this.host]();
  }
}

module.exports = News;
