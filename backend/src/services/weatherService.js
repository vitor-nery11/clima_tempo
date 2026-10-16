import axios from 'axios';
import NodeCache from 'node-cache';
import { cache } from 'react';

const weatherCache = new NodeCache({stdTTL: 900});

export async function getWeatherByCity(city){

    const cacheKey = city.toLowerCase().trim();

    const cachedData = weatherCache.get(cacheKey);
    if(cachedData){
        console.log(`Devolvendo dados salvos para: ${city}`);
        return {source: 'cache', data: cachedData};
    } 

    console.log(`Bucando dados novos para: ${city}`);

    // geocoding 
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;
    const geoResponse = await axios.get(geoUrl);

    if (geoResponse.data.results || geoResponse.data.results.length ===0){
        throw new Error('CITY IS NOT FOUNDED')
    }

    
    // location 
    const location = geoResponse.data.results[0];


    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,is_day&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;

    const weatherResponse = await axios.get(weatherUrl);
    const raw = weatherResponse.data;

    const formattedData = {
        location: {
            name: location.name,
            state: location.admin1 || '',
            country: location.country,
        },
        current: {
            temp: Math.round(raw.current.temperature_2m),
            feelsLike: Math.round(raw.current.apparent_temperature),
            humidity: raw.current.relative_humidity_2m,
            windSpeed: Math.round(raw.current.wind_speed_10m),
            weatherCode: raw.current.weather_code,
            isDay: raw.current.is_day === 1,
          },
        hourly: raw.hourly.time.slice(0, 24).map((time, index) => ({
            time: time.split('T')[1], // Pega só a hora, ex: "14:00"
            temp: Math.round(raw.hourly.temperature_2m[index]),
        })),

        daily: raw.daily.time.map((date, index) => ({
            date,
            maxTemp: Math.round(raw.daily.temperature_2m_max[index]),
            minTemp: Math.round(raw.daily.temperature_2m_min[index]),
            weatherCode: raw.daily.weather_code[index],
        })),
    };

    weatherCache.set(cacheKey, formattedData);

    return {source: 'api', data: formattedData};
}