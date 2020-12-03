var citySearch;
const apiKey = '&appid=9bfd908033c6ecbca1dcee4556ecec5b';
const currentDay = moment().format('L');
let weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=';
let uviAPI = 'https://api.openweathermap.org/data/2.5/uvi?&lat=';
let forecastAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=';
let weatherIconURL = 'https://openweathermap.org/img/wn/';
let units = '&units=imperial';
let searchHistoryArr = []


$(document).ready(function () {
    $('#searchButton').on('click', function(e) {
        e.preventDefault();
        citySearch = $('#city-input').val().trim();

        localStorage.setItem('cityName', JSON.stringify(citySearch));

        function pageLoad() {
            let lastCity = JSON.parse(localStorage.getItem('cityName'));
            $('.list-group').append(`<li class="list-group-item"><a href="#">${citySearch}</a></li>`);
        }

        init(citySearch);
        pageLoad();        
    })
});

function init(citySearch) {
    $.ajax({
        type: 'get',
        url: weatherAPI + citySearch + units + apiKey,
        dataType: 'JSON',
        success: function (result) {
            var weatherIcon = result.weather[0].icon;
            $('#city-name').text(citySearch + ' (' + currentDay + ') ');
            $('#forecast-image').attr('src', weatherIconURL + weatherIcon + '.png');
            $('#temperature').html('<b>Temperature: </b>' + parseInt(result.main.temp) + ' °F');
            $('#humidity').html('<b>Humidity: </b>' + result.main.humidity + '%');
            $('#windspeed').html('<b>Windspeed: </b>' + result.wind.speed + ' MPH');

            var lat = result.coord.lat
            var lon = result.coord.lon

            $.ajax({
                type: 'get',
                url: uviAPI + lat + '&lon=' + lon + apiKey,
                dataType: 'JSON',
                success: function (uviResult) {
                    var uviResults = uviResult.value
                    $("#uv-index").html('<b>UV Index: </b>' + '<span class="badge" id="uvi-badge">' + uviResults + '</span>');

                    if (uviResults < 3) {
                        $('#uvi-badge').addClass('badge badge-success');
                    } else if (uviResults < 6) {
                        $('#uvi-badge').addClass('badge badge-warning');
                    } else if (uviResults < 11) {
                        $('#uvi-badge').addClass('badge badge-danger');
                    }

                }
            });

        }

    });

    $.ajax({
        type: 'get',
        url: forecastAPI + citySearch + units + apiKey,
        dataType: 'JSON',
        success: function (response) {
            $("#five-day").removeClass(".hidden");
            var fiveDayFc = response.list;
            for (var i = 0; i < fiveDayFc.length; i += 8) {
                var fiveDayCards = $("<div class='card-deck card text-center mx-auto mb-8 p-2' style='color:white; background-color: navy; height: 12rem; width: 10rem; margin: 15px;'>");
                var date = fiveDayFc[i].dt_txt;
                var setDate = date.substr(0, 10);
                var temp = fiveDayFc[i].main.temp;
                var hum = fiveDayFc[i].main.humidity;
                var fcIcon = fiveDayFc[i].weather[0].icon

                var h6date = $("<h6 class='card-date'>").text(setDate);
                var pTemp = $("<p class='weather-temp'>").html('<b>Temp: </b>' + parseInt(temp) + ' °F');
                var pHum = $("<p class='weather-humidity'>").html('<b>Humidity: </b>' + parseInt(hum) + '%<br>');
                var fcImg = $('<img>').attr('src', weatherIconURL + fcIcon + '.png');

                var weather = fiveDayFc[i].weather[0].main

                fiveDayCards.append(h6date, pTemp, pHum, fcImg);

                $("#forecast-container").append(fiveDayCards);

            }
        }
    })
}

