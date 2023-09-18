const API_KEY = "e68d5f8f7c296f931478d8dddf6838c0";

const currentWeatherAPI = "https://api.openweathermap.org/data/2.5/weather";
const forecastWeatherAPI = "https://api.openweathermap.org/data/2.5/forecast";
const geoCoderAPI = "https://api.openweathermap.org/geo/1.0/direct";

const inputEl = $("#city-input");
const searchListEl = $("#city-list");

let cityList = {};

function getApi() {
    const city = "London";
    // fetch request gets a list of all the repos for the node.js organization
    
}

function showCityList() {
  searchListEl.html("");
  const cities = Object.keys(cityList);
  for(const city in cityList) {
    const buttonEl = $("<button>").addClass("city-button");
    buttonEl.text(city);
    searchListEl.append(buttonEl);
  }
}

function loadCityList(refreshed) {

  const emptyStorage = localStorage.getItem("cityList");
  // make sure local storage is not empty
  if(emptyStorage!==null && emptyStorage!=='') {
    // load from local storage and save into the global object
    cityList = JSON.parse(emptyStorage);
    showCityList();
    if(refreshed) {
      searchCity(searchListEl.children()[0].textContent);
    }
    return;
  }

  searchCity("Sacramento");
}

function addCity(city) {
  if(cityList[city.text()] !== 1) {
    cityList[city.text()] = 1;
    localStorage.setItem("cityList", JSON.stringify(cityList));
    loadCityList();
  }
}

function getWeather(coordinates) {
  console.log(coordinates);
  
  const requestUrl = `${currentWeatherAPI}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}`;

  fetch(requestUrl)
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error('Current Weather status is not 200 OK');
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      
    })
    .catch(function(err) {
      console.log(err);
    });

}

function searchCity(cityName) {
  console.log(cityName);

  const coordinates = {};

  const requestUrl = `${geoCoderAPI}?q=${cityName}&limit=1&appid=${API_KEY}`;
  
  fetch(requestUrl)
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error('City status is not 200 OK');
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      coordinates["lat"] = data[0].lat;
      coordinates["lon"] = data[0].lon;
      getWeather(coordinates);
    })
    .catch(function(err) {
      console.log(err);
    });
}

$("#city-form").on("submit", function(event) {
  event.preventDefault();
  
  const newCity = $("<button>").text(inputEl.val());
  inputEl.val('');

  searchCity(newCity.text());
  addCity(newCity);
})

$("#city-list").on("click", ".city-button", function() {
  searchCity(this.textContent);
})

loadCityList(true);