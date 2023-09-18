const API_KEY = "e68d5f8f7c296f931478d8dddf6838c0";

const currentWeatherAPI = "https://api.openweathermap.org/data/2.5/weather";
const forecastWeatherAPI = "https://api.openweathermap.org/data/2.5/forecast";
const geoCoderAPI = "https://api.openweathermap.org/geo/1.0/direct";

const inputEl = $("#city-input");
const searchListEl = $("#city-list");

let cityList = {};

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

function setForecastWeather(weather) {
  for(let i=0; i<5; i++) {
    $(".five-day-list>.card>.date")[i].textContent = weather[i].date;
    $(".five-day-list>.card>img")[i].src = `https://openweathermap.org/img/wn/${weather[i].icon}@2x.png`;
    $(".five-day-list>.card>*>.temp")[i].textContent = weather[i].temp;
    $(".five-day-list>.card>*>.wind")[i].textContent = weather[i].wind;
    $(".five-day-list>.card>*>.humd")[i].textContent = weather[i].humd;
  }
}

function getForecastWeather(coordinates) {
  const forecastRequestUrl = `${forecastWeatherAPI}?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${API_KEY}`;
  const forecastWeather = [];

  fetch(forecastRequestUrl)
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error('Forecast Weather status is not 200 OK');
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      for(let i=0+4; i<40; i+=8) {
        const day = {};
        day['date'] = data.list[i].dt_txt.split(" ")[0];
        day['icon'] = data.list[i].weather[0].icon;
        day['temp'] = data.list[i].main.temp;
        day['wind'] = data.list[i].wind.speed;
        day['humd'] = data.list[i].main.humidity;
        forecastWeather.push(day);
      }
      setForecastWeather(forecastWeather);
    })
    .catch(function(err) {
      console.log(err);
    });
}

function setCurrentWeather(weather) {
  document.querySelector(".city").textContent = weather.cityName;
  document.querySelector(".city-header").children[1].textContent = weather.date;
  document.querySelector(".current-weather>div>img").src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  document.querySelector(".temp").textContent = weather.temp;
  document.querySelector(".wind").textContent = weather.wind;
  document.querySelector(".humd").textContent = weather.humd;
}

function getCurrentWeather(coordinates) {
  const currentRequestUrl = `${currentWeatherAPI}?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${API_KEY}`;
  const currentWeather = {};
  fetch(currentRequestUrl)
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error('Current Weather status is not 200 OK');
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const date = dayjs.unix(data.dt).format('YYYY-MM-D');
      console.log(date, data.dt);
      currentWeather['cityName'] = data.name;
      currentWeather['date'] = date;
      currentWeather['icon'] = data.weather[0].icon;
      currentWeather['temp'] = data.main.temp;
      currentWeather['wind'] = data.wind.speed;
      currentWeather['humd'] = data.main.humidity;
      setCurrentWeather(currentWeather);
    })
    .catch(function(err) {
      console.log(err);
    });
}

function searchCity(cityName) {
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
      coordinates["lat"] = data[0].lat;
      coordinates["lon"] = data[0].lon;
      getCurrentWeather(coordinates);
      getForecastWeather(coordinates);
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