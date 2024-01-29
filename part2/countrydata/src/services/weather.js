import axios from "axios";

// API for getting city Key
const base_url = "http://dataservice.accuweather.com/locations/v1/cities/search";
const api_key = import.meta.env.VITE_SOME_KEY
const weather_url = "http://dataservice.accuweather.com/forecasts/v1/daily/1day/";

const getCityKey = (city) => {
  return axios.get(`${base_url}?apikey=${api_key}&q=${city}`);

}

const getWeather = (city_key) => {
  return axios.get(`${weather_url}${city_key}?apikey=${api_key}`);
}

export { getCityKey, getWeather };