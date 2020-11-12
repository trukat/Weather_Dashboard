var citySearch;
const apiKey = '&appid=9bfd908033c6ecbca1dcee4556ecec5b';
const currentDay = moment().format('L');
let weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=';
var uviAPI = 'https://api.openweathermap.org/data/2.5/uvi?&lat=';
var forecastAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var weatherIconURL = 'https://openweathermap.org/img/wn/'
var geoAPI = navigator.geolocation;
var units = '&units=imperial'
var searchHistory = [];

$(document).ready(function () {
    $('#searchButton').on('click', function () {
        citySearch = $('#city-input').val()
        init(citySearch);
    })
});


function init(city) {
    $.ajax({
        type: 'get',
        url: weatherAPI + citySearch + units + apiKey,
        dataType: 'JSON',
        success: function (result) {
            var weatherIcon = result.weather[0].icon;
            $('#city-name').text(citySearch + ' (' + currentDay + ') ');
            $('#forecast-image').attr('src', weatherIconURL + weatherIcon + '.png');
            $("#temperature").html('<b>Temperature: </b>' + result.main.temp + ' °F');
            $("#humidity").html('<b>Humidity: </b>' + result.main.humidity + '%');
            $("#windspeed").html('<b>Windspeed: </b>' + result.wind.speed + ' MPH');

    var lat = result.coord.lat
    var lon = result.coord.lon

    $.ajax({
        type: 'get',
        url: uviAPI + lat + '&lon=' + lon + apiKey,
        dataType: 'JSON',
        success: function (uviResult) {
            var uviResults = uviResult.value
            $("#uv-index").html('<b>UV Index: </b>' + uviResults);
        }
        
    });

    // if (uvi)
    
        }
        
    });
    
    // console.log("inside init function")
    // console.log(city)
}