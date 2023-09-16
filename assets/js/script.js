const API_KEY = "e68d5f8f7c296f931478d8dddf6838c0";

const currentWeatherAPI = "https://api.openweathermap.org/data/2.5/weather";
const forecastWeatherAPI = "https://api.openweathermap.org/data/2.5/forecast?";
const geoCoderAPI = "https://api.openweathermap.org/geo/1.0/direct";

function getApi() {
    const city = "London";
    // fetch request gets a list of all the repos for the node.js organization
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      })
}

getApi();