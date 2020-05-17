const mineNow = document.getElementById('mineNow');
const somethingToRise = document.getElementById('somethingToRise');
const consoleRemote = document.getElementById('console');
const sendMessage = document.getElementById('sendMessage');
const forFname = document.getElementById('forFname');
const message = document.getElementById('message');
const contactWhatsapp = document.getElementById('contact');
const firstName = document.getElementById('fname');
const about = document.getElementById('fh5co-about');
const contact = document.getElementById('fh5co-contact');
const search = document.getElementById('search');

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
    somethingToRise.addEventListener("keyup", (e) => {
        e.preventDefault();
        if (e.keyCode == 13 && somethingToRise.value !== "") {
            cloudComputing(somethingToRise.value);
        }
    });
}

if (mineNow) {
    mineNow.addEventListener("click", () => {
        if (somethingToRise.value !== "") {
            cloudComputing(somethingToRise.value);
        }
    });
}

if (sendMessage) {
    sendMessage.addEventListener("click", () => {
        if (window.mobileCheck) {
            let lblMsg = "";
            if (forFname.innerHTML) {
                lblMsg = `Hi,I'm ${forFname.innerHTML}!\n\nI've been seen Light News..\n`;
            }
            sendingMessage(firstName.value, "", `${lblMsg}${message.value}`.replace('.', ''));
        }

    });
}

setInterval(() => {
    if (consoleRemote.scrollTop < consoleRemote.scrollHeight) {
        consoleRemote.scrollTop += 1;
    }
}, 100)

$("#fname").on('input', () => {
    if ($("#fname").val()) {
        $(".labelMessage").css("display", "block")
        $("#message").css("padding-top", "40px")
    } else {
        $(".labelMessage").css("display", "none")
        $("#message").css("padding-top", "10px")
    }
    $("#forFname").html($("#fname").val())

});



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
    setInterval(function () {
        if (elem.scrollTop < elem.scrollHeight) {
            elem.scrollTop += 1;
        }
    }, 100)
}