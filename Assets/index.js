let citySearch;
const apiKey = '&appid=9bfd908033c6ecbca1dcee4556ecec5b';
const currentDay = moment().format('L');
let weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=';
let uviAPI = 'https://api.openweathermap.org/data/2.5/uvi?&lat=';
let forecastAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=';
let weatherIconURL = 'https://openweathermap.org/img/wn/';
let units = '&units=imperial';


$(document).ready(function () {
    let searchedCity = localStorage.getItem('cityName')
    $('#searchButton').on('click', function(e) {
        e.preventDefault();
        citySearch = $('#city-input').val().trim();
        $('.list-group').append(`<li class="list-group-item"><button class="searchedCity"; style='color:white; background-color: navy;'>${citySearch}</button></li>`);

        localStorage.setItem('cityName', JSON.stringify(citySearch));
        let lastCity = localStorage.getItem('cityName');
        init(citySearch);
        
    })
    $(document).on('click', '.searchedCity', function(e){
        e.preventDefault();
        console.log(e.target.innerHTML)
        init(e.target.innerHTML)
        localStorage.setItem('cityName', JSON.stringify(citySearch));
    })
});


function init(citySearch) {
    $.ajax({
        type: 'get',
        url: weatherAPI + citySearch + units + apiKey,
        dataType: 'JSON',
        success: function (result) {
            const weatherIcon = result.weather[0].icon;
            $('#city-name').text(citySearch + ' (' + currentDay + ') ');
            $('#forecast-image').attr('src', weatherIconURL + weatherIcon + '.png');
            $('#temperature').html('<b>Temperature: </b>' + parseInt(result.main.temp) + ' °F');
            $('#humidity').html('<b>Humidity: </b>' + result.main.humidity + '%');
            $('#windspeed').html('<b>Windspeed: </b>' + result.wind.speed + ' MPH');

            const lat = result.coord.lat
            const lon = result.coord.lon

            $.ajax({
                type: 'get',
                url: uviAPI + lat + '&lon=' + lon + apiKey,
                dataType: 'JSON',
                success: function (uviResult) {
                    let uviResults = uviResult.value
                    $("#uv-index").html('<b>UV Index: </b>' + '<span class="badge" id="uvi-badge">' + uviResults + '</span>');

                    if (uviResults < 3) {
                        $('#uvi-badge').addClass('badge badge-success');
                    } else if (uviResults < 6) {
                        $('#uvi-badge').addClass('badge badge-warning');
                    } else if (uviResults >= 11) {
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
            let fiveDayFc = response.list;
            $("#forecast-container").empty();
            for (let i = 0; i < fiveDayFc.length; i += 8) {
                let fiveDayCards = $("<div class='card-deck card text-center mx-auto mb-8 p-2' style='color:white; background-color: navy; height: 12rem; width: 10rem; margin: 15px;'>");
                let date = fiveDayFc[i].dt_txt;
                let setDate = date.substr(0, 10);
                let temp = fiveDayFc[i].main.temp;
                let hum = fiveDayFc[i].main.humidity;
                let fcIcon = fiveDayFc[i].weather[0].icon

                let h6date = $("<h6 class='card-date'>").text(setDate);
                let pTemp = $("<p class='weather-temp'>").html('<b>Temp: </b>' + parseInt(temp) + ' °F');
                let pHum = $("<p class='weather-humidity'>").html('<b>Humidity: </b>' + parseInt(hum) + '%<br>');
                let fcImg = $('<img>').attr('src', weatherIconURL + fcIcon + '.png');

                const weather = fiveDayFc[i].weather[0].main

                fiveDayCards.append(h6date, pTemp, pHum, fcImg);

                $("#forecast-container").append(fiveDayCards);

            }
        }
    })
}