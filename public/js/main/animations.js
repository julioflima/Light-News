animateDashboard("model.html")

lightOut(); 

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

function animateDashboard(page) {
    $.when(
        $.get(page, function (data) {
            $('#fh5co-project').html(data);
        })
    ).done(function () {
    });
}