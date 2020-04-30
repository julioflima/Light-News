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
async function cloudComputing(somethingSearch) {
    search.disabled = true;
    getSomethingSearch(somethingSearch).then((data) => {
        plotConsole(data);
        getPrefixTrend(data.docId, data.content.searchTerm).then((data) => {
            plotConsole(data);
            search.disabled = false;
        }).catch((error) => {
            plotConsole(error);
            search.disabled = false;
        });
    }).catch((error) => {
        plotConsole(error);
        search.disabled = false;
    });
}

function plotConsole(result) {
    consoleRemote.innerHTML = consoleRemote.innerHTML + "<br />" + JSON.stringify(result);
}

async function getSomethingSearch(somethingSearch) {
    let dataReturn;
    await $.ajax({
        url: 'https://us-central1-minevideo-2ceee.cloudfunctions.net/submit',
        dataType: "json",
        method: 'GET',
        crossDomain: true,
        headers: {
            'Accept': 'application/json'
        },

        data: {
            "searchTerm": somethingSearch,
        },

        success: function (data) {
            console.log(JSON.stringify(data));
            dataReturn = data;
        }
    });

    return dataReturn;
}

async function getPrefixTrend(docId, somethingSearch) {
    let dataReturn;
    await $.ajax({
        url: 'https://us-central1-minevideo-2ceee.cloudfunctions.net/getPrefixTrend',
        dataType: "json",
        method: 'GET',
        crossDomain: true,
        headers: {
            'Accept': 'application/json'
        },

        data: {
            "docId": docId,
            'searchTerm': somethingSearch
        },

        success: function (data) {
            console.log(JSON.stringify(data));
            dataReturn = data;
        }
    });

    return dataReturn;
}