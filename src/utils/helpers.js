const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const getLocationAndWeather = async (clientIp) => {

  console.log(`Fetching location and weather for IP: ${clientIp}`);

  try {
    // For development purposes, we will use the IP address 8.8.8.8 to mock the IP address of localhost
    if (clientIp === "::ffff:127.0.0.1") {
      clientIp = "8.8.8.8";
    }

    const locationResponse = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEOLOCATION_API_KEY}&ip=${clientIp}`
    );
    console.log(`Location response: ${JSON.stringify(locationResponse.data)}`);
    
    const locationData = locationResponse.data;

    if (!locationData.city) {
      throw new Error("City not found in IP geolocation data");
    }

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${locationData.city}&units=metric&appid=${process.env.WEATHER_API_KEY}`
    );
    console.log(`Weather response: ${JSON.stringify(weatherResponse.data)}`);
    
    const weatherData = weatherResponse.data;

    return {
      location: locationData.city,
      temperature: weatherData.main.temp,
    };
  } catch (error) {
    console.error("Error fetching location or weather data", error);
    throw new Error("Unable to fetch location and weather data");
  }
};

const getClientIp = (req) => {
  return (
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  );
};

module.exports = { getLocationAndWeather, getClientIp };
