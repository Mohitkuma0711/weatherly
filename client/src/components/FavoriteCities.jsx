import { useWeather } from '../context/WeatherContext';

const FavoriteCities = () => {
  const { favorites, fetchWeatherByCoords, removeFavorite, loading } = useWeather();

  if (!favorites.length) return null;

  return (
    <section className="section favorite-cities" aria-labelledby="favorites-heading">
      <div className="section-header">
        <h2 id="favorites-heading" className="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Favorite Cities
        </h2>
      </div>
      <div className="favorites-grid" role="list">
        {favorites.map((fav) => (
          <article key={fav._id} className="favorite-card glass-card" role="listitem">
            <div className="favorite-main">
              <div className="favorite-info">
                <h3 className="favorite-city">{fav.city}</h3>
                <span className="favorite-country">{fav.country}</span>
              </div>
              <button
                className="remove-favorite"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav._id);
                }}
                aria-label={`Remove ${fav.city} from favorites`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <button
              className="favorite-action"
              onClick={() => fetchWeatherByCoords(fav.lat, fav.lon)}
              disabled={loading}
            >
              View Weather
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FavoriteCities;