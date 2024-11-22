import React, { useState } from "react";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";
import "./styles/app.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [background, setBackground] = useState("default");

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const response = await axios.get(`/api/weather?city=${city}`);
      setWeather(response.data);
      setBackground(getBackground(response.data.current.condition.text));
    } catch (error) {
      setError("Error fetching weather data!");
    }
    setLoading(false);
  };

  const getBackground = (condition) => {
    if (condition.toLowerCase().includes("sunny")) return "sunny";
    if (condition.toLowerCase().includes("rain")) return "rainy";
    if (condition.toLowerCase().includes("snow")) return "snowy";
    if (condition.toLowerCase().includes("partly cloudy")) return "cloudy";
    if (condition.toLowerCase().includes("clear")) return "clear";
    return "default";
  };

  return (
    <div className={`app ${background}`}>
      {/* Weather Animations */}
      {background === "cloudy" && (
        <div className="clouds">
          <div
            className="cloud large"
            style={{ top: "20%", left: "-200px" }}
          ></div>
          <div
            className="cloud small"
            style={{ top: "50%", left: "-300px" }}
          ></div>
          <div
            className="cloud large"
            style={{ top: "70%", left: "-100px" }}
          ></div>
        </div>
      )}
      {background === "clear" && <div className="sky"></div>}
      {background === "rainy" && (
        <div className="rain">{Array(20).fill(<div />)}</div>
      )}
      {background === "snowy" && (
        <div className="snow">{Array(20).fill(<div />)}</div>
      )}

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={() => fetchWeather(city)}>Search</button>
      </div>

      {/* Placeholder Message */}
      {!weather && !loading && !error && (
        <div className="placeholder">Enter a city to see the weather!</div>
      )}

      {/* Loading Indicator */}
      {loading && <div className="loader">Loading...</div>}

      {/* Error Message */}
      {error && <div className="error">{error}</div>}

      {/* Weather Data */}
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
}

export default App;
