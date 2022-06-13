const getWeatherData = () => Promise.resolve([
  {
    location: {
      name: 'Portland',
    },
    forecastUrl: 'https://api.weather.gov/gridpoints/PQR/112,113/forecast',
    iconUrl: 'https://api.weather.gov/icons/land/day/tsra,40?size=medium',
    weather: 'Chance Showers And Thunderstorm',
    temp: '59 F',
  },
  {
    location: {
      name: 'Bend',
    },
    forecastUrl: 'https://api.weather.gov/gridpoints/PQR/112,113/forecast',
    iconUrl: 'https://api.weather.gov/icons/land/day/tsra,40?size=medium',
    weather: 'Scattered Showers And Thunderstorm',
    temp: '51 F',
  },
  {
    location: {
      name: 'Manzanita',
    },
    forecastUrl: 'https://api.weather.gov/gridpoints/PQR/112,113/forecast',
    iconUrl: 'https://api.weather.gov/icons/land/day/tsra,40?size=medium',
    weather: 'Showers And Thunderstorm',
    temp: '55 F',
  },
])

const weatherMiddleware = async (req, res, next) => {
  if (!res.locals.partials) res.locals.partials = {}
  res.locals.partials.weatherContext = await getWeatherData()
  next()
}

module.exports = weatherMiddleware