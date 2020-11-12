var citySearch;
var apiKey = '&appid=9bfd908033c6ecbca1dcee4556ecec5b';
var weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=';
var uviAPI = 'https://api.openweathermap.org/data/2.5/uvi?lat=';
var forecastAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var weatherIcon = 'https://openweathermap.org/img/wn/'
var geoAPI = navigator.geolocation;
var units = 'units=imperial'
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
        url: weatherAPI + citySearch + apiKey,
        dataType: 'JSON',
        success: function (result) {
            console.log(result)
            $("#temperature").html('<b>Temperature: </b>' + result.main.temp + ' °F');
            $("#humidity").html('<b>Humidity: </b>' + result.main.humidity + '%');
            $("#windspeed").html('<b>Windspeed: </b>' + result.wind.speed + ' MPH');
        }
        
    });
    
    // console.log("inside init function")
    // console.log(city)
}