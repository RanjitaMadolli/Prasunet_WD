
import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');

    const fetchWeather = async () => {
        try {
            const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            setWeather(response.data);
            setError('');
        } catch (err) {
            setError('City not found');
            setWeather(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchWeather();
    };

    return (
        <div>
            <h1>Weather App</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                />
                <button type="submit">Get Weather</button>
            </form>
            {error && <p>{error}</p>}
            {weather && (
                <div>
                    <h2>{weather.name}</h2>
                    <p>{weather.weather[0].description}</p>
                    <p>Temperature: {weather.main.temp} °C</p>
                    <p>Humidity: {weather.main.humidity} %</p>
                    <p>Wind Speed: {weather.wind.speed} m/s</p>
                </div>
            )}
        </div>
    );
};

export default Weather;
