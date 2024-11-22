import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";
import "./styles/app.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [background, setBackground] = useState("default");
  const [suggestedCities, setSuggestedCities] = useState([]);

  useEffect(() => {
    // Fetch weather based on geolocation on load
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchWeather(null, latitude, longitude);
      },
      () => setError("Unable to retrieve your location!")
    );
  }, []);

  const fetchWeather = async (city = null, lat = null, lon = null) => {
    setLoading(true);
    setError("");
    setSuggestedCities([]);

    const query = city ? `?city=${city}` : `?lat=${lat}&lon=${lon}`;
    try {
      const response = await axios.get(`/api/weather${query}`);
      setWeather(response.data);
      setBackground(getBackground(response.data.current.condition.text));
    } catch (error) {
      if (city || (lat && lon)) {
        suggestNearbyCities(city || `${lat},${lon}`);
      } else {
        setError("Error fetching weather data!");
      }
    }
    setLoading(false);
  };

  const getBackground = (condition) => {
    if (condition.toLowerCase().includes("sunny")) return "sunny";
    if (condition.toLowerCase().includes("rain")) return "rainy";
    if (condition.toLowerCase().includes("cloud")) return "cloudy";
    return "default";
  };

  const suggestNearbyCities = async (query) => {
    try {
      const response = await axios.get(`/api/suggested-cities?query=${query}`);
      setSuggestedCities(response.data || []);
      setError("Unable to find weather for your location. Try a nearby city:");
    } catch {
      setError("Unable to suggest nearby cities.");
    }
  };

  return (
    <div className={`app ${background}`}>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={() => fetchWeather(city)}>Search</button>
        <button
          onClick={() =>
            navigator.geolocation.getCurrentPosition(
              ({ coords }) =>
                fetchWeather(null, coords.latitude, coords.longitude),
              () => setError("Geolocation not available.")
            )
          }
        >
          📍
        </button>
      </div>
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {suggestedCities.length > 0 && (
        <div className="suggested-cities">
          {suggestedCities.map((city) => (
            <button key={city} onClick={() => fetchWeather(city)}>
              {city}
            </button>
          ))}
        </div>
      )}
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
}

export default App;
