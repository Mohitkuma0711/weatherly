import { useState, useRef, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useGeolocation } from '../hooks';
import { useDebounce } from '../hooks';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const { fetchWeatherByCity, fetchWeatherByCoords } = useWeather();
  const { getCurrentPosition, loading: geoLoading } = useGeolocation();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (city) => {
    if (!city.trim()) return;
    setShowSuggestions(false);
    setQuery(city);
    try {
      await fetchWeatherByCity(city.trim());
    } catch (error) {
      // Error handled in context
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleGeoLocation = async () => {
    try {
      await getCurrentPosition();
    } catch {}
  };

  return (
    <div className="search-bar-wrapper">
      <form className="search-bar" onSubmit={handleSubmit} ref={inputRef}>
        <label htmlFor="city-search" className="visually-hidden">Search for a city</label>
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            id="city-search"
            className="search-input"
            placeholder="Enter city name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={showSuggestions && suggestions.length > 0}
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
        <button type="submit" className="btn btn-primary search-btn" disabled={!query.trim()}>
          Search
        </button>
      </form>

      <button
        className="btn btn-secondary geo-btn"
        onClick={handleGeoLocation}
        disabled={geoLoading}
        aria-label="Use my current location"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>
        <span>{geoLoading ? 'Locating...' : 'Use My Location'}</span>
      </button>

      {showSuggestions && suggestions.length > 0 && (
        <ul id="search-suggestions" className="search-suggestions" role="listbox">
          {suggestions.map((city, index) => (
            <li key={index} role="option" onClick={() => handleSearch(city)}>
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;