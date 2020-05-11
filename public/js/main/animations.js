animateDashboard("news/model.html")

lightOut();

let scrollPosition = 0;

$("#page").scroll(() => {
    let b = document.getElementById('page').scrollHeight - document.getElementById('page').clientHeight;
    let a = document.getElementById('page').scrollTop;
    scrollPosition = a / b;
});

function changeBg() {
    let actualBg = Math.floor(Math.random() * 3) + 2;
    let imgName = `img_bg_${actualBg}.jpg`;
    let urlName = `url(../images/${imgName})`
    $('#fh5co-header').css("background-image", urlName);
}

function lightOut() {
    let animation = "neon2 1.5s ease-in-out infinite alternate"
    $("p a").css('color', "#ffffff")
    $("p a").css('-webkit-animation', animation)
    $("p a").css('-moz-animation', animation)
    $("p a").css('animation', animation)
}

function animateDashboard(page, id = '#fh5co-project') {
    $.when(
        $.get(page, (data) => {
            $(id).append(data);
        })
    ).done(() => {
    });
}

async function getStruture(page) {
    return await new Promise((resolve, reject) => {
        $.when(
            $.get(page)
        ).done((data) => {
            resolve(data);
        });
    });
}