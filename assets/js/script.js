const API_KEY = "e68d5f8f7c296f931478d8dddf6838c0";

const currentWeatherAPI = "https://api.openweathermap.org/data/2.5/weather";
const forecastWeatherAPI = "https://api.openweathermap.org/data/2.5/forecast?";
const geoCoderAPI = "https://api.openweathermap.org/geo/1.0/direct";

const inputEl = $("#city-input");
const searchListEl = $("#city-list");

let cityList = {};

function getApi() {
    const city = "London";
    // fetch request gets a list of all the repos for the node.js organization
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // console.log(data);
      })
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

function searchCity(cityName) {
   console.log(cityName);
}

$("#city-form").on("submit", function(event) {
  event.preventDefault();
  
  const newCity = $("<button>").text(inputEl.val());
  inputEl.val('');

  searchCity(newCity.text());
  addCity(newCity);
})

$("#city-list").on("click", ".city-button", function() {
  console.log(this.textContent);
})

loadCityList(true);