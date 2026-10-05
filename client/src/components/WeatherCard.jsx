import { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { formatDate, getWeatherIconUrl, capitalize } from '../utils/formatters';

const WeatherCard = () => {
  const { weather, loading, error, convertTemp, getUnitSymbol, toggleUnit, unit, addToFavorites } = useWeather();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => { setIsFavorite(false); }, [weather?.city]);

  if (loading) return <WeatherCardSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!weather) return <EmptyState />;

  const { city, country, temperature, feelsLike, description, icon, humidity, windSpeed, pressure, visibility, sunrise, sunset, clouds, dt, sys } = weather;
  const isDay = dt >= sys.sunrise && dt <= sys.sunset;
  const condition = weather.condition;
  const bgType = getBgType(condition, isDay);

  const tempDisplay = convertTemp(temperature);
  const feelsLikeDisplay = convertTemp(feelsLike);
  const unitSymbol = getUnitSymbol();

  return (
    <div className="weather-card-wrapper" role="region" aria-label={`Current weather for ${city}`}>
      <div className="weather-bg">
        <WeatherBackground type={bgType} isDay={isDay} />
      </div>

      <article className="weather-card glass-card">
        <div className="weather-header">
          <div className="location">
            <h2 className="city-name">{city}, {country}</h2>
            <p className="date">{formatDate(Date.now(), { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="header-actions-buttons">
            <button
              className="unit-toggle"
              onClick={toggleUnit}
              aria-label={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
            >
              {unit === 'celsius' ? '°F' : '°C'}
            </button>
            <button
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={async () => {
                const added = await addToFavorites(weather);
                if (added) setIsFavorite(true);
              }}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="weather-main">
          <div className="temperature-display">
            <span className="temperature" aria-label={`${tempDisplay} degrees ${unitSymbol === '°C' ? 'Celsius' : 'Fahrenheit'}`}>
              {tempDisplay}
              <span className="unit">{unitSymbol}</span>
            </span>
            <img src={getWeatherIconUrl(icon)} alt={capitalize(description)} className="weather-icon" />
          </div>
          <p className="condition">{capitalize(description)}</p>
          <p className="feels-like">Feels like {feelsLikeDisplay}{unitSymbol}</p>
        </div>

        <div className="weather-details" role="list" aria-label="Weather details">
          <WeatherDetailItem label="Humidity" value={`${humidity}%`} icon={<HumidityIcon />} />
          <WeatherDetailItem label="Wind" value={`${windSpeed} km/h`} icon={<WindIcon />} />
          <WeatherDetailItem label="Pressure" value={`${pressure} hPa`} icon={<PressureIcon />} />
          <WeatherDetailItem label="Visibility" value={`${visibility} km`} icon={<VisibilityIcon />} />
          <WeatherDetailItem label="Clouds" value={`${clouds}%`} icon={<CloudIcon />} />
          <WeatherDetailItem label="Sunrise" value={sunrise} icon={<SunriseIcon />} />
          <WeatherDetailItem label="Sunset" value={sunset} icon={<SunsetIcon />} />
        </div>

        <p className="updated">Updated just now</p>
      </article>
    </div>
  );
};

function getBgType(condition, isDay) {
  const c = condition.toLowerCase();
  if (c.includes('thunder')) return 'thunderstorm';
  if (c.includes('rain') || c.includes('drizzle')) return 'rain';
  if (c.includes('snow')) return 'snow';
  if (c.includes('cloud')) return 'cloudy';
  if (c.includes('mist') || c.includes('fog') || c.includes('haze') || c.includes('smoke')) return 'mist';
  if (!isDay) return 'night';
  return 'clear';
}

const WeatherDetailItem = ({ label, value, icon }) => (
  <div className="detail-item" role="listitem">
    <div className="detail-icon" aria-hidden="true">{icon}</div>
    <div className="detail-info">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  </div>
);

const WeatherBackground = ({ type, isDay }) => (
  <div className={`weather-bg-inner bg-${type} ${isDay ? 'day' : 'night'}`} aria-hidden="true">
    {type === 'clear' && <ClearSky isDay={isDay} />}
    {type === 'cloudy' && <CloudySky />}
    {type === 'rain' && <RainySky />}
    {type === 'thunderstorm' && <ThunderstormSky />}
    {type === 'snow' && <SnowySky />}
    {type === 'mist' && <MistySky />}
    {type === 'night' && <NightSky />}
  </div>
);

const ClearSky = ({ isDay }) => (
  <>
    {isDay && <div className="sun" />}
    {!isDay && <div className="moon" />}
    {!isDay && [...Array(50)].map((_, i) => (
      <span key={i} className="star" style={{ '--i': i }} />
    ))}
  </>
);

const CloudySky = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <span key={i} className="cloud" style={{ '--i': i }} />
    ))}
  </>
);

const RainySky = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <span key={`c${i}`} className="cloud rain-cloud" style={{ '--i': i }} />
    ))}
    {[...Array(50)].map((_, i) => (
      <span key={`r${i}`} className="raindrop" style={{ '--i': i }} />
    ))}
  </>
);

const ThunderstormSky = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <span key={`c${i}`} className="cloud storm-cloud" style={{ '--i': i }} />
    ))}
    {[...Array(50)].map((_, i) => (
      <span key={`r${i}`} className="raindrop" style={{ '--i': i }} />
    ))}
    {[...Array(3)].map((_, i) => (
      <span key={`l${i}`} className="lightning" style={{ '--i': i }} />
    ))}
  </>
);

const SnowySky = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <span key={`c${i}`} className="cloud snow-cloud" style={{ '--i': i }} />
    ))}
    {[...Array(60)].map((_, i) => (
      <span key={`s${i}`} className="snowflake" style={{ '--i': i }} />
    ))}
  </>
);

const MistySky = () => (
  <>
    {[...Array(4)].map((_, i) => (
      <span key={i} className="mist-layer" style={{ '--i': i }} />
    ))}
  </>
);

const NightSky = () => (
  <>
    {[...Array(80)].map((_, i) => (
      <span key={`s${i}`} className="star" style={{ '--i': i }} />
    ))}
    <div className="moon" />
    {[...Array(3)].map((_, i) => (
      <span key={`c${i}`} className="cloud night-cloud" style={{ '--i': i }} />
    ))}
  </>
);

const HumidityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);
const WindIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
  </svg>
);
const PressureIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const VisibilityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const CloudIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
  </svg>
);
const SunriseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 2v10"/><path d="M18 12a6 6 0 0 0-12 0"/><path d="M4 22h16"/><path d="M12 18v4"/>
  </svg>
);
const SunsetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 10v10"/><path d="M18 12a6 6 0 0 0-12 0"/><path d="M4 22h16"/><path d="M12 2v4"/>
  </svg>
);

const WeatherCardSkeleton = () => (
  <div className="weather-card-wrapper">
    <article className="weather-card glass-card">
      <div className="weather-header">
        <div className="location">
          <div className="skeleton-line" style={{ width: '60%', height: '28px' }} />
          <div className="skeleton-line" style={{ width: '40%' }} />
        </div>
        <div className="skeleton-circle" />
      </div>
      <div className="weather-main">
        <div className="temperature-display">
          <div className="skeleton-line skeleton-temp" />
        </div>
        <div className="skeleton-line" style={{ width: '50%', margin: '0 auto' }} />
        <div className="skeleton-line" style={{ width: '60%', margin: '0 auto' }} />
      </div>
      <div className="weather-details">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="detail-item">
            <div className="skeleton-circle skeleton-icon" />
            <div className="detail-info">
              <div className="skeleton-line" style={{ width: '50px', marginBottom: '4px' }} />
              <div className="skeleton-line" style={{ width: '30px', marginBottom: 0 }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="error-state glass-card" role="alert">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <h3>Unable to fetch weather</h3>
    <p>{message}</p>
    <p className="error-hint">Please check the city name and try again</p>
  </div>
);

const EmptyState = () => (
  <div className="empty-state glass-card">
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <h3>Discover the Weather</h3>
    <p>Enter a city name or use your location to get started</p>
  </div>
);

export default WeatherCard;