export const formatDate = (timestamp, options = {}) => {
  const defaultOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options
  };
  return new Date(timestamp).toLocaleDateString(undefined, defaultOptions);
};

export const formatTime = (timestamp, options = {}) => {
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options
  };
  return new Date(timestamp).toLocaleTimeString(undefined, defaultOptions);
};

export const formatDateTime = (timestamp) => {
  return `${formatDate(timestamp)} at ${formatTime(timestamp)}`;
};

export const getWeatherBgClass = (condition, isDay = true) => {
  const cond = condition.toLowerCase();
  if (cond.includes('rain') || cond.includes('drizzle')) return 'bg-rain';
  if (cond.includes('cloud')) return 'bg-cloudy';
  if (cond.includes('thunder')) return 'bg-thunderstorm';
  if (cond.includes('snow')) return 'bg-snow';
  if (cond.includes('mist') || cond.includes('fog') || cond.includes('haze')) return 'bg-mist';
  if (!isDay) return 'bg-night';
  return 'bg-clear';
};

export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getWindDirection = (deg) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(deg / 22.5) % 16];
};

export const truncate = (str, length = 20) => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};