const cheerio = require('cheerio');

module.exports = function (data) {

    let news = [];
    let imgNews = [];
    let $ = cheerio.load(data);

    class Fonts {
        bbc() {
            $('p').each(function () {
                news.push($(this).text());
            });

            $('img').each(function () {
                imgNews.push({ 'src': $(this).attr('src'), 'alt': $(this).attr('alt') })
            });

            return { news, imgNews }
        }
    }

    return new Fonts(data);
};
