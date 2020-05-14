const mineNow = document.getElementById('mineNow');
const somethingToRise = document.getElementById('somethingToRise');
const consoleRemote = document.getElementById('console');
var about = document.getElementById('fh5co-about');
var contact = document.getElementById('fh5co-contact');
var search = document.getElementById('search');

const dinamicPath = [
    "index.html",
    "js/main/lightNews.js",
    "/css/style.css",
    "/css/neon.css",
    "js/plugins/plugins.js",
    "js/plugins/abstract.js"
];
const timeUpdate = 1500;

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

// setInterval(function () {
//     if (consoleRemote.scrollTop < consoleRemote.scrollHeight) {
//         consoleRemote.scrollTop += 1;
//     }
// }, 100)

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