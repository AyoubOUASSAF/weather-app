const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = 5000;

// Route to fetch weather data
app.get("/api/suggested-cities", async (req, res) => {
  const query = req.query.query;
  const apiKey = process.env.WEATHER_API_KEY;
  const apiUrl = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;

  try {
    const response = await axios.get(apiUrl);
    const cityNames = response.data.map((city) => city.name);
    res.json(cityNames);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch suggested cities" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});