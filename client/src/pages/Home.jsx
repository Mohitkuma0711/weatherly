import { useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import Forecast from '../components/Forecast';
import RecentSearches from '../components/RecentSearches';
import FavoriteCities from '../components/FavoriteCities';

const Home = () => {
  const { fetchWeatherByCoords, fetchWeatherByCity, fetchHistory, fetchFavorites, weather } = useWeather();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
      fetchFavorites();
    }
  }, [isAuthenticated, fetchHistory, fetchFavorites]);

  useEffect(() => {
    if (weather) return;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => { fetchWeatherByCity('Noida'); },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      fetchWeatherByCity('Noida');
    }
  }, [fetchWeatherByCoords, fetchWeatherByCity, weather]);

  return (
    <div className="home-page">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="container">
          <header className="hero-content">
            <h1 id="hero-title" className="hero-title">Weatherly</h1>
            <p className="hero-subtitle">Discover the weather anywhere in the world</p>
            <SearchBar />
          </header>
        </div>
      </section>

      <div className="container">
        <div className="dashboard-grid">
          <main className="main-content-area">
            <WeatherCard />
            <Forecast />
          </main>

          <aside className="sidebar">
            {isAuthenticated && <FavoriteCities />}
            {isAuthenticated && <RecentSearches />}
            {!isAuthenticated && (
              <div className="auth-prompt glass-card">
                <h3>Personalize Your Experience</h3>
                <p>Sign in to save favorite cities and view search history</p>
                <div className="auth-prompt-actions">
                  <a href="/login" className="btn btn-primary">Login</a>
                  <a href="/register" className="btn btn-secondary">Sign Up</a>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;