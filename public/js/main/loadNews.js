const articleNewest = postingNews();

async function postingNews() {
    return await articleNews();
}

async function articleNews() {
    // animateDashboard("news/articleNews.html", '#afterSizer')
    let html = await getStruture("news/articleNews.html")
    $('#afterSizer').append(html);
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

