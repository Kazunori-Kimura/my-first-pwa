// app.js
const STORAGE_KEY = "my-first-pwa-form-data";

window.addEventListener("load", () => {
  // install ServiceWorker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => {
        console.log("[app] Service Worker Registered.");
      });
  }

  // load API key
  const json = getApiKey();
  if (json) {
    document.getElementById("app_api_key").value = json.apiKey;
    document.getElementById("app_new_city_id").value = json.cityId;
  }

  getWeather();
});

// click save button
document.getElementById("app_save").addEventListener("click", () => {
  saveApiKey();
  getWeather();
});

/**
 * get API Key from localStorage
 * 
 * @return {object} json object
 */
function getApiKey() {
  const value = localStorage.getItem(STORAGE_KEY);
  if (value) {
    return JSON.parse(value);
  }
  return null;
}

/**
 * save API Key to localStorage
 */
function saveApiKey() {
  const apiKey = document.getElementById("app_api_key").value;
  const cityId = document.getElementById("app_new_city_id").value;
  const json = { apiKey, cityId };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
}

/**
 * get api url
 * 
 * @return {string} api url
 */
function getApiUrl() {
  const json = getApiKey();
  if (json && json.apiKey && json.cityId) {
    // openweathermap.org
    return `https://api.openweathermap.org/data/2.5/weather?id=${json.cityId}&APPID=${json.apiKey}`;
  } else {
    return "";
  }
}

/**
 * get weather data from openweather api or cache
 */
function getWeather() {
  const url = getApiUrl();
  if (!url) {
    return;
  }

  if ("caches" in window) {
    caches.match(url).then((response) => {
      if (response) {
        response.json().then((json) => {
          updateWeatherView(json);
          hideLoader();
        });
      }
    });
  }

  showLoader();
  fetch(url)
    .then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          updateWeatherView(json);
        });
      }
    })
    .catch((err) => {
      console.log(`[app] Error! - ${err.message}`);
    })
    .then(hideLoader, hideLoader);
}

/**
 * set weather data to html
 * 
 * @param {object} json receive json object
 */
function updateWeatherView(json) {
  // check update datetime
  const lastDt = getLastUpdate();
  if (json.dt <= lastDt) {
    return;
  }

  const weather = json.weather[0];
  const temp = json.main;

  setText("app_city_name", json.name);
  setText("app_city_id", json.id);
  setText("app_datetime", formatDate(json.dt));
  setText("app_weather_main", weather.main);
  setText("app_weather_description", weather.description);

  setText("app_temp", convertKtoC(temp.temp));

  // set icon
  const img = document.getElementById("app_icon");
  img.src = `images/${weather.icon}.png`;
}

/**
 * get last update datetime
 * 
 * @return {number} unixtime
 */
function getLastUpdate() {
  const element = document.getElementById("app_last_dt");
  const text = element.textContent;
  return parseInt(text);
}

/**
 * format unixtime
 * 
 * @param {number} dt unixtime
 * @return {string}
 */
function formatDate(dt) {
  const date = new Date(dt * 1000);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${year}/${padLeft(month)}/${padLeft(day)} ${padLeft(hour)}:${padLeft(minute)}:${padLeft(second)}`;
}

/**
 * zero padding
 * 
 * @param {number} value 
 */
function padLeft(value) {
  return `00${value}`.slice(-2);
}

/**
 * convert Kelvin temperature to Celsius temperature
 * 
 * @param {number} value Kelvin temperature
 * @return {number} Celsium temperature
 */
function convertKtoC(value) {
  return value - 273.15;
}

/**
 * insert text
 * 
 * @param {string} id 
 * @param {string} text 
 */
function setText(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

/**
 * hide loader element
 */
function hideLoader() {
  const loader = document.getElementsByClassName("loader")[0];
  if (!loader.classList.contains("hidden")) {
    loader.classList.add("hidden");
  }
}
/**
 * show loader element
 */
function showLoader() {
  const loader = document.getElementsByClassName("loader")[0];
  loader.classList.remove("hidden");
}
