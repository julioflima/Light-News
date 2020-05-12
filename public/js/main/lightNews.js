
let pageCursor = "";

async function getNews(someURl) {
    let response = await getFromCloud('robotNews', { 'pageCursor': pageCursor })
    plotConsole(response)
    return response;
}


async function getSummarizedUser(someURl) {
    plotConsole(`Getting from: ${someURl}`)
    let response = await getFromCloud('robotText', { 'someURL': someURl, 'lang': 'pt' })
    plotConsole(response)
    return response;
}

async function cloudComputing(someURl) {
    FB.login(function (response) {
        if (response.status === 'connected') {
            getSummarized(someURl).then((bundleNews) => {
                // postOnInstagram(bundleNews)
            })
        } else {
            plotConsole("The user is not logged into this web page or we are unable to tell.")
        }
    }, { scope: 'instagram_basic,instagram_content_publish' });
}

async function getFromCloud(func, data) {
    return await network('https://us-central1-light-news.cloudfunctions.net/' + func, 'GET', data)
}

async function postOnInstagram(bundleNews) {
    plotConsole(`Posting on Instagram...`)
    let response = await FB.getLoginStatus();
    plotConsole(`${response}`)
    console.log(response)
    // return await network('https://us-central1-light-news.cloudfunctions.net/' + func, 'GET', data)
}

async function network(url, method, data) {
    let dataReturn;
    await $.ajax({
        url: url,
        dataType: "json",
        method: method,
        crossDomain: true,
        headers: {
            'Accept': 'application/json'
        },
        data: data,
        success: function (data) {
            console.log(JSON.stringify(data));
            dataReturn = data;
        },
        error: function (request, status, error) {
            plotConsole(status);
            plotConsole(error);
            plotConsole(request.responseText);
        }
    });
    return dataReturn;
}