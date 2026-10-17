import axios from "axios";

export async function fetchWeather(city) {
  const { data } = await api.get('/weather', { params: { city } });
  return data;
}

export async function fetchWeatherByCoords(lat, lon) {
  const response = await api.get('/weather/coords', {
    params: { lat, lon },
  });
  return response.data;
}

export const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});
