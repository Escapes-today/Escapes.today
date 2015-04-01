$(document).ready(function () {
    $('#slides').superslides({
        hashchange: false,
        animation: 'slide',
        play: 60000
    });
    $("<i id='pause' class='fa fa-pause' style='position: absolute; right: 10px;color: rgb(220, 232, 243);'></i>").appendTo('.slides-pagination');
    var timer = 0;
    $("#pause").click(function () {
        if ($(this).hasClass("fa-pause")) {
            $(this).toggleClass("fa-pause");
            $(this).toggleClass("fa-play");
            $('#slides').superslides('stop');
            clearTimeout(timer);
        } else {
            $(this).toggleClass("fa-pause");
            $(this).toggleClass("fa-play");
            //Wait 2 sec then start again
            timer = setTimeout(function () {
                $('#slides').superslides('start');
            }, 2000);
        }
    });
});