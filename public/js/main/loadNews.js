let pageCursor = "";
let counterArticles = 0;

async function postingNews(bundle) {
    let bundleNews = bundle[0];
    pageCursor = bundle[1].endCursor;
    let articleProm = [];
    await bundleNews.forEach(async news => {
        switch (news.imgNews.length) {
            case 0:
                break;
            case 1:
                let gotArticle = await articleNews(news);
                await appendNews(gotArticle)
                break;
            default:
                break;
        }
    })
}

async function articleNews(bundle) {
    $article = $(await getStruture("news/articleNews.html"));
    $article.find('.thumb-link').attr("href", "https://" + bundle.url);
    $article.find('img').attr("src", bundle.imgNews[0].src);
    $article.find('img').attr("alt", bundle.imgNews[0].alt);
    $article.find('.entry-excerpt').html(bundle.summary)
    bundle.hashtags.split(' ').slice(0, 5).forEach(tags => {
        $article.find('.cat-links').append(`<a href = "https://www.instagram.com/explore/tags/${tags}" > #${tags} </a>`)
    })
    return $article
}

async function appendNews($article) {
    if (window.screen.width < 768) {
        await $($article).insertBefore(".before");
    } else {
        await $(".entry" + (counterArticles % 4 + 1)).append($article);
    }
    return counterArticles++;
}

function sliderNews() {
    animateDashboard("news/sliderNews.html", '#afterSizer')
    $('#afterSizer').append(html);
}

function breakingNews() {
    animateDashboard("news/breakingNews.html", '#afterSizer')

}

function quoteNews() {
    animateDashboard("news/quoteNews.html", '#afterSizer')

}

function noImgNews() {
    animateDashboard("news/noImgNews.html", '#afterSizer')

}

function videoNews() {
    animateDashboard("news/videoNews.html", '#afterSizer')

}

function audioNews() {
    animateDashboard("news/audioNews.html", '#afterSizer')

}

function reMasonry() {
    console.log('remasory')
    $('.bricks-wrapper').masonry({
        itemSelector: '.entry',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        resize: true
    });

    $(".entry").toArray().forEach((elem) => {
        $('.bricks-wrapper').masonry('ignore', elem).masonry();
        $('.bricks-wrapper').masonry()
            .append(elem)
            .masonry('appended', elem)
            .masonry();
    })
}

$("#page").scroll(() => {
    let b = document.getElementById('page').scrollHeight - document.getElementById('page').clientHeight;
    let a = document.getElementById('page').scrollTop;
    let scrollPosition = a / b;
    if (scrollPosition > .8) {
        getNews()
    }
});
