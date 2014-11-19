function weather(e) {
    $("#weather").css("background", "url(" + e.forecast[0].image + ")");
    if (e.temp > 75) {
        $("body").animate({
            backgroundColor: "#F7AC57"
        }, 1500)
    } else {
        $("body").animate({
            backgroundColor: "#0091c2"
        }, 1500)
    }
    html = '<span class="loc">' + e.city + ", " + e.country + "</span>";
    html += '<span class="temp">' + e.temp + "&deg;" + e.units.temp + "</span>";
    html += '<span class="cond">' + e.currently + "</span>";
    if (e.wind.speed != 0) {
        html += '<span class="wind">' + e.wind.direction + " " + e.wind.speed + " " + e.units.speed + "</span>"
    }
    html += '<span class="time">Weather updated at: ' + e.updated + "</span>";
    $("#weather").html(html)
}