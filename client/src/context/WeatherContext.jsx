import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const WeatherContext = createContext(null);

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(() => localStorage.getItem('weatherUnit') || 'celsius');
  const [recentSearches, setRecentSearches] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    localStorage.setItem('weatherUnit', unit);
  }, [unit]);

  const toggleUnit = useCallback(() => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  }, []);

  const convertTemp = useCallback((tempC) => {
    if (unit === 'fahrenheit') {
      return Math.round(tempC * 9/5 + 32);
    }
    return tempC;
  }, [unit]);

  const getUnitSymbol = useCallback(() => unit === 'celsius' ? '°C' : '°F', [unit]);

  const saveToHistory = useCallback(async (weatherData) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          city: weatherData.city,
          country: weatherData.country,
          temperature: weatherData.temperature,
          weatherCondition: weatherData.condition,
          weatherIcon: weatherData.icon
        })
      });
      const res = await fetch('/api/history', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRecentSearches(data.data || []);
      }
    } catch {}
  }, []);

  const fetchWeatherByCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch weather');
      setWeather(data.data);
      if (localStorage.getItem('token')) {
        saveToHistory(data.data);
      }
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch weather');
      setWeather(data.data);
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRecentSearches(data.data || []);
      }
    } catch {}
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await fetch('/api/favorites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.data || []);
      }
    } catch {}
  }, []);

  const addToHistory = useCallback(async (weatherData) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          city: weatherData.city,
          country: weatherData.country,
          temperature: weatherData.temperature,
          weatherCondition: weatherData.condition,
          weatherIcon: weatherData.icon
        })
      });
      fetchHistory();
    } catch {}
  }, [fetchHistory]);

  const addToFavorites = useCallback(async (weatherData) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          city: weatherData.city,
          country: weatherData.country,
          lat: weatherData.lat,
          lon: weatherData.lon
        })
      });
      if (res.ok) fetchFavorites();
      return res.ok;
    } catch {
      return false;
    }
  }, [fetchFavorites]);

  const removeFavorite = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchFavorites();
      return res.ok;
    } catch {
      return false;
    }
  }, [fetchFavorites]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchHistory();
      fetchFavorites();
    }
  }, [fetchHistory, fetchFavorites]);

  const value = {
    weather,
    loading,
    error,
    unit,
    toggleUnit,
    convertTemp,
    getUnitSymbol,
    recentSearches,
    favorites,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    fetchHistory,
    fetchFavorites,
    addToHistory,
    addToFavorites,
    removeFavorite,
    setError
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within WeatherProvider');
  return context;
};