import { useWeather } from '../context/WeatherContext';

const RecentSearches = () => {
  const { recentSearches, fetchWeatherByCity, loading } = useWeather();

  if (!recentSearches.length) return null;

  return (
    <section className="section recent-searches" aria-labelledby="recent-heading">
      <div className="section-header">
        <h2 id="recent-heading" className="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          Recent Searches
        </h2>
      </div>
      <div className="search-list" role="list">
        {recentSearches.slice(0, 8).map((item, index) => (
          <button
            key={`${item._id}-${index}`}
            className="search-item glass-card"
            onClick={() => fetchWeatherByCity(item.city)}
            disabled={loading}
            role="listitem"
          >
            <div className="search-item-icon">
              <img
                src={`https://openweathermap.org/img/wn/${item.weatherIcon}@2x.png`}
                alt=""
                aria-hidden="true"
              />
            </div>
            <div className="search-item-info">
              <span className="search-item-city">{item.city}, {item.country}</span>
              <span className="search-item-time">{new Date(item.searchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <span className="search-item-temp">{Math.round(item.temperature)}°</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default RecentSearches;