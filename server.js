const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const apiKeyIpGeolocation = '1a14d98e72fa4e1fb6a4dcb61fe03c78';
const apiKeyWeather = '11d2253f69a7ae27bd2a4b5e081783e9';

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';

  try {
    const ipResponse = await axios.get('https://api.ipify.org?format=json');
    const clientIp = ipResponse.data.ip;

    const geoData = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKeyIpGeolocation}&ip=${clientIp}`);
    const city = geoData.data.city;

    if (!city) {
      throw new Error('City not found in geolocation data.');
    }

    const weatherData = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=metric`);
    const temp = Math.round(weatherData.data.main.temp);

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}! The temperature is ${temp} degrees Celsius in ${city}`
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: 'An error occurred while processing your request.',
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
