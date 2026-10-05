const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const getKey = () => process.env.WEATHER_API_KEY?.trim() || '';
const hasApiKey = () => {
  const k = getKey();
  return k && k !== 'your_api_key' && k.length > 10;
};

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function demoWeather(city) {
  const seed = hashString(city.toLowerCase());
  const conditions = [
    { main: 'Clear', description: 'clear sky', icon: '01d' },
    { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
    { main: 'Clouds', description: 'overcast clouds', icon: '04d' },
    { main: 'Rain', description: 'light rain', icon: '10d' },
    { main: 'Drizzle', description: 'drizzle', icon: '09d' },
    { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
    { main: 'Snow', description: 'light snow', icon: '13d' },
    { main: 'Mist', description: 'mist', icon: '50d' },
  ];
  const cond = conditions[seed % conditions.length];
  const temp = 15 + (seed % 25);
  const now = Math.floor(Date.now() / 1000);
  const sunrise = now - 21600 + (seed % 3600);
  const sunset = now + 21600 + (seed % 3600);

  return {
    name: city.charAt(0).toUpperCase() + city.slice(1),
    sys: { country: 'XX', sunrise, sunset },
    coord: { lat: 20 + (seed % 30) - 15, lon: 70 + (seed % 40) - 20 },
    weather: [{ main: cond.main, description: cond.description, icon: cond.icon }],
    main: { temp, feels_like: temp + 2, humidity: 40 + (seed % 50), pressure: 1000 + (seed % 30) },
    wind: { speed: 2 + (seed % 10), deg: seed % 360 },
    visibility: 8000 + (seed % 5000),
    clouds: { all: (seed % 100) },
    dt: now,
  };
}

function transformWeatherData(data) {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6),
    pressure: data.main.pressure,
    visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
    sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    clouds: data.clouds.all,
    lat: data.coord.lat,
    lon: data.coord.lon,
    dt: data.dt,
    sys: data.sys,
    demo: !hasApiKey(),
  };
}

export const getWeatherByCity = async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, message: 'City parameter is required' });
    }

    if (!hasApiKey()) {
      const data = demoWeather(city.trim());
      return res.json({ success: true, data: transformWeatherData(data) });
    }

    const response = await fetch(`${WEATHER_API_URL}?q=${encodeURIComponent(city)}&appid=${getKey()}&units=metric`);

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ success: false, message: 'City not found' });
      }
      throw new Error('Weather service unavailable');
    }

    const data = await response.json();
    res.json({ success: true, data: transformWeatherData(data) });
  } catch (error) {
    next(error);
  }
};

export const getWeatherByCoords = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    if (!hasApiKey()) {
      const data = demoWeather(`${lat},${lon}`);
      data.coord = { lat: parseFloat(lat), lon: parseFloat(lon) };
      data.name = 'Current Location';
      data.sys.country = 'LOCAL';
      return res.json({ success: true, data: transformWeatherData(data) });
    }

    const response = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${getKey()}&units=metric`);

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ success: false, message: 'Location not found' });
      }
      throw new Error('Weather service unavailable');
    }

    const data = await response.json();
    res.json({ success: true, data: transformWeatherData(data) });
  } catch (error) {
    next(error);
  }
};