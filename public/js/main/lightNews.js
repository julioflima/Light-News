

let requisiting = false;
let endNews = false;
getNews();

async function getNews() {
    try {
        if (!requisiting && !endNews) {
            requisiting = true;
            let news = await getFromCloud('robotNews', 'GET', { 'pageCursor': pageCursor })
            if (news[1].moreResults == "NO_MORE_RESULTS") {
                endNews = true;
            }
            postingNews(news)
            requisiting = false
        }
    } catch (error) {
        plotConsole(error)
        requisiting = false
    }
}

async function cloudComputing(someURl) {
    FB.login(async (response) => {
        if (response.status === 'connected') {
            plotConsole(`Getting from: ${someURl}`)
            let response = await getFromCloud('robotText', { 'someURL': someURl, 'lang': 'pt' })
            plotConsole(response)
        } else {
            plotConsole("The user is not logged into this web page or we are unable to tell.")
        }
    }, { scope: 'instagram_basic,instagram_content_publish' });
}

async function postOnInstagram(bundleNews) {
    plotConsole(`Posting on Instagram...`)
    let response = await FB.getLoginStatus();
    plotConsole(`${response}`)
    console.log(response)
    // return await network('https://us-central1-light-news.cloudfunctions.net/' + func, 'GET', data)
}

async function getFromCloud(func, method, dataIn) {
    let dataReturn;
    let rootUrl = 'https://light-news.web.app/'
    if (window.location.port) {
        rootUrl = 'http://localhost:5001/';
    }
    await $.ajax({
        'url': `${rootUrl}light-news/us-central1/app/${func}`,
        'dataType': "json",
        'method': method,
        'crossDomain': true,
        'headers': {
            'Accept': 'application/json'
        },
        'data': dataIn,
        success: (data) => {
            dataReturn = data;
        },
        error: (request, status, error) => {
            plotConsole(status);
            plotConsole(error);
            plotConsole(request.responseText);
        }
    });
    return dataReturn;
}