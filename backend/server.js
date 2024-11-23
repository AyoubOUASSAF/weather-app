const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = 5000;

// Route to fetch weather data
app.get("/api/weather", async (req, res) => {
  const { city } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});