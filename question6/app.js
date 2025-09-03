const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Backend API call - using free weather API
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(`https://wttr.in/${city}?format=j1`);
    const data = response.data;
    res.json({
      location: data.nearest_area[0].areaName[0].value,
      temperature: data.current_condition[0].temp_C,
      description: data.current_condition[0].weatherDesc[0].value,
      humidity: data.current_condition[0].humidity
    });
  } catch (error) {
    res.status(500).json({ error: 'Weather data not available' });
  }
});

// Cat fact API
app.get('/api/catfact', async (req, res) => {
  try {
    const response = await axios.get('https://catfact.ninja/fact');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Cat fact not available' });
  }
});

app.listen(3003, () => console.log('Server running on http://localhost:3003'));