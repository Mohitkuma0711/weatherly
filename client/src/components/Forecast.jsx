import { useWeather } from '../context/WeatherContext';
import { formatDate, getWeatherIconUrl, capitalize } from '../utils/formatters';

const Forecast = () => {
  const { weather, unit, convertTemp, getUnitSymbol } = useWeather();

  if (!weather) return null;

  const mockForecast = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const baseTemp = weather.temperature + (Math.random() - 0.5) * 8;
    const conditions = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const icons = {
      Clear: '01d', Clouds: '03d', Rain: '10d', Drizzle: '09d',
      Thunderstorm: '11d', Snow: '13d', Mist: '50d'
    };
    return {
      date: date.toISOString(),
      tempMin: Math.round(baseTemp - 3),
      tempMax: Math.round(baseTemp + 3),
      condition,
      icon: icons[condition],
      pop: Math.random()
    };
  });

  const unitSymbol = getUnitSymbol();

  return (
    <section className="section forecast" aria-labelledby="forecast-heading">
      <div className="section-header">
        <h2 id="forecast-heading" className="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          7-Day Forecast
        </h2>
      </div>
      <div className="forecast-scroll" role="list">
        {mockForecast.map((day, index) => (
          <article key={index} className="forecast-card glass-card" role="listitem">
            <time className="forecast-date" dateTime={day.date}>
              {index === 0 ? 'Today' : formatDate(day.date, { weekday: 'short', month: 'short', day: 'numeric' })}
            </time>
            <img
              src={getWeatherIconUrl(day.icon)}
              alt=""
              className="forecast-icon"
              aria-hidden="true"
            />
            <p className="forecast-condition">{capitalize(day.condition)}</p>
            <div className="forecast-temps">
              <span className="forecast-high">
                {convertTemp(day.tempMax)}{unitSymbol}
              </span>
              <span className="forecast-low">
                {convertTemp(day.tempMin)}{unitSymbol}
              </span>
            </div>
            {day.pop > 0.3 && (
              <span className="forecast-rain">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="12" y1="2" x2="12" y2="6"/>
                  <line x1="12" y1="18" x2="12" y2="22"/>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                  <line x1="2" y1="12" x2="6" y2="12"/>
                  <line x1="18" y1="12" x2="22" y2="12"/>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                </svg>
                {Math.round(day.pop * 100)}%
              </span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default Forecast;