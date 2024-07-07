const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware to trust proxy headers (if behind a proxy)
app.set('trust proxy', true);

// API keys (replace with your actual API keys)
const IPAPI_KEY = 'your_ipapi_key'; // If needed, some IP APIs might require an API key
const OPENWEATHERMAP_KEY = '0b7dfb8e02651f362395bece6ded0aae#';

// Function to get location based on IP address
const getLocation = async () => {
  try {
    const response = await axios.get(`https://get.geojs.io/v1/ip/geo.json`);
  
    return response.data;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
};

// Function to get weather based on latitude and longitude
const getWeather = async (lat, lon) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};



// Define a route to get client details
app.get('/api/hello', async (req, res) => {
  const locationData = await getLocation();
  const clientIp = locationData.ip
  const visitorName = req.query.visitor_name;
  const city = locationData.city;
  if (!locationData) {
    return res.status(500).send('Error fetching location data');
  }

  const weatherData = await getWeather(locationData.latitude, locationData.longitude);
  const temp = weatherData.main.temp
  if (!weatherData) {
    return res.status(500).send('Error fetching weather data');
  }

  console.log(weatherData);
  const greeting = `Hello, ${visitorName}!, the temperature is ${temp} degrees Celcius in ${city}`

  const response = {
    client_ip: clientIp,
    location: city,
    greeting: greeting,
  };

  res.status(200).json(response);
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
