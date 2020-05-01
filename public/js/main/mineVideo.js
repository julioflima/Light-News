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
async function cloudComputing(someURl) {
    plotConsole(getSummarized(someURl))

}

function plotConsole(result) {
    consoleRemote.innerHTML = consoleRemote.innerHTML + "<br />" + JSON.stringify(result);
    let elem = document.getElementById('console');
    elem.scrollTop = elem.scrollHeight;
}



async function getSummarized(someURl) {
    return await getFromCloud('testText', {'someURL': someURl})
}

async function getFromCloud(func, data) {
    let dataReturn;
    await $.ajax({
        url: 'http://localhost:5001/light-news/us-central1/' + func,
        dataType: "json",
        method: 'GET',
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