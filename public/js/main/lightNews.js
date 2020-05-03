const mineNow = document.getElementById('mineNow');
const somethingToRise = document.getElementById('somethingToRise');
const consoleRemote = document.getElementById('console');
var about = document.getElementById('fh5co-about');
var contact = document.getElementById('fh5co-contact');
var search = document.getElementById('search');
var docId;

if (somethingToRise) {
    somethingToRise.addEventListener("keyup", function (e) {
        e.preventDefault();
        if (e.keyCode == 13 && somethingToRise.value !== "") {
            cloudComputing(somethingToRise.value);
        }
    });
}

if (mineNow) {
    mineNow.addEventListener("click", function () {
        if (somethingToRise.value !== "") {
            cloudComputing(somethingToRise.value);
        }
    });
}

setInterval(function () {
    if (consoleRemote.scrollTop < consoleRemote.scrollHeight) {
        consoleRemote.scrollTop += 1;
    }
}, 10)

function showAbout() {
    about.style.display = 'block';
    contact.style.display = 'none';
}

function showContact() {
    contact.style.display = 'block';
    about.style.display = 'none';
}


function plotConsole(result) {
    consoleRemote.innerHTML = consoleRemote.innerHTML + "<br />" + JSON.stringify(result);
    let elem = document.getElementById('console');
    elem.scrollTop = elem.scrollHeight;
}

async function getSummarized(someURl) {
    plotConsole(`Getting from: ${someURl}`)
    let response = await getFromCloud('robotText', { 'someURL': someURl })
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