import React from "react";
import { motion } from "framer-motion";

const WeatherCard = ({ weather }) => {
  return (
    <motion.div
      className="weather-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>{weather.location.name}</h2>
      <img
        src={`https:${weather.current.condition.icon}`}
        alt={weather.current.condition.text}
      />
      <h3>{weather.current.temp_c}°C</h3>
      <p>{weather.current.condition.text}</p>
    </motion.div>
  );
};

export default WeatherCard;
