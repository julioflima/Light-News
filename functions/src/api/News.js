const cheerio = require('cheerio');

class News {
  constructor(data, host) {
    this.data = data;
    this.host = host;
  }

  getNews(data, host) {
    const $ = cheerio.load(data);
    const news = [];
    const imgNews = [];

    return {
      'www.bbc.com': () => {
        $('p').each(() => {
          news.push($(this).text());
        });

        $('img').each(() => {
          imgNews.push({ src: $(this).attr('src'), alt: $(this).attr('alt') });
        });

        return { news, imgNews };
      },
    }[host];
  }
}

module.exports = { News };
