function displayWeather() {
    var city = document.getElementById("city").value;
    var state = document.getElementById("state").value;
    // Validation
    if (city == "" || state == "") {
        alert("Please enter city and state");
        return;
    }
    if (state.length != 2) {
        alert("Please enter state as two character string.");
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.status == 200) {
            loadData(this);
        }
    };
    xhttp.onerror = function(err) {
        alert("Error loading weather data" + err);
    }
    // Could display progress bar as data is loading.
    var yql = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from" +
        "%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20" +
        "geo.places(1)%20where%20text%3D%22" + city + "%2C%20" + state + 
        "%22)&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    xhttp.open("GET", yql, true);
    xhttp.send();
}

function loadData(response) {
    var xmlDoc = response.responseXML;
    if (xmlDoc == null) {
        alert('Invalid response from server.');
        return;
    }
    var forecasts = xmlDoc.getElementsByTagName("forecast");
    if (forecasts.length == 0) {
        alert("No Weather Data.");
    }
    for (var i = 0; i < 3; i++) {
        var fcast = forecasts[i];
        if (fcast != null) {
            displayDay(fcast, i);
        }
    }
}

function displayDay(fcast, num) {
    var day = fcast.getAttribute("day");
    var high = fcast.getAttribute("high");
    var low = fcast.getAttribute("low");
    var text = fcast.getAttribute("text");
    if (day != null && text != null && day != "" && text != "") {
        var text = getWeatherImage(text);
        var panel = document.getElementById("day" + num);
        var html = '<div class="w3-card-4 w3-container w3-blue' +
                        ' w3-margin-bottom weather-card">' +
            '<p><header class="w3-container">' +
            '<h2>' + day + '</h2>' +
            '</header>' +
            '<h5><i class="wi wi-day-' + text +'"></i></h5>' +
            '<h5>Low</h5>' +
            '<h5>' + low + '</h5>' +
            '<h5>High</h5>' +
            '<h5>' + high + '</h5>'
            '</p>' +
            '</div>';
        panel.innerHTML = html;
        panel.style.display = "inline";
    }
}

function getWeatherImage(text) {
    if (text.match(/sun/i)) {
        return "sunny";
    } else if (text.match(/fog/i)) {
        return "fog";
    } else if (text.match(/rain/i)) {
        return "rain";
    } else if (text.match(/snow/i)) {
        return "snow";
    } else if (text.match(/cloud/i)) {
        return "cloudy";
    } else if (text.match(/shower/i)) {
        return "showers";
    }
    return text;
}