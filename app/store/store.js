import { create } from 'zustand';
import axios from 'axios';

const API_KEYS = {
  weather: process.env.NEXT_PUBLIC_WEATHER_API_KEY || '',
  news: process.env.NEXT_PUBLIC_NEWS_API_KEY || ''
};

console.log(API_KEYS);

// Load initial favorites from localStorage
const loadFavorites = () => {
  if (typeof window !== 'undefined') {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : { cities: [], cryptos: [] };
  }
  return { cities: [], cryptos: [] };
};

export const useStore = create((set, get) => ({

  /** ==========================
   * WEATHER STATE
   ===========================*/
  weatherData: {},
  fetchWeather: async (city, days = 1, dt = null, hour = null) => {
    try {
      let url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEYS.weather}&q=${city}&days=${days}&aqi=yes`;
      
      if (dt) {
        url += `&dt=${dt}`;
      }
      if (hour) {
        url += `&hour=${hour}`;
      }

      const res = await axios.get(url);
      
      // Process current weather
      const currentWeather = {
        main: {
          temp: res.data.current.temp_c,
          humidity: res.data.current.humidity,
          feels_like: res.data.current.feelslike_c
        },
        weather: [{
          main: res.data.current.condition.text,
          icon: res.data.current.condition.icon
        }],
        wind: {
          speed: res.data.current.wind_kph,
          deg: res.data.current.wind_degree,
          dir: res.data.current.wind_dir
        },
        air_quality: res.data.current.air_quality
      };

      // Process forecast data
      const forecastData = res.data.forecast.forecastday.map(day => ({
        date: day.date,
        max_temp: day.day.maxtemp_c,
        min_temp: day.day.mintemp_c,
        avg_temp: day.day.avgtemp_c,
        condition: day.day.condition,
        humidity: day.day.avghumidity,
        rain_chance: day.day.daily_chance_of_rain,
        hourly: day.hour.map(h => ({
          time: h.time,
          temp: h.temp_c,
          condition: h.condition,
          wind_speed: h.wind_kph,
          humidity: h.humidity,
          rain_chance: h.chance_of_rain
        }))
      }));

      set((state) => ({ 
        weatherData: { 
          ...state.weatherData, 
          [city]: {
            ...currentWeather,
            forecast: forecastData
          }
        } 
      }));
    } catch (error) {
      console.error("Weather API Error:", error);
    }
  },

  /** ==========================
   * CRYPTO STATE
   ===========================*/
  cryptoData: {},
  fetchCrypto: async () => {
    try {
      const res = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: { vs_currency: 'usd', ids: 'bitcoin,ethereum,cardano,dogecoin' }
      });
      const cryptoMap = res.data.reduce((acc, coin) => {
        acc[coin.id] = coin;
        return acc;
      }, {});
      set({ cryptoData: cryptoMap });
    } catch (error) {
      console.error("Crypto API Error:", error);
    }
  },

  /** ==========================
   * NEWS STATE
   ===========================*/
  newsData: [],
  fetchNews: async () => {
    try {
        const res = await axios.get(`https://newsdata.io/api/1/news?apikey=${API_KEYS.news}&q=bitcoin&language=en`);
      set({ newsData: res.data.results.slice(0, 5) });
    } catch (error) {
      console.error("News API Error:", error);
    }
  },

  /** ==========================
   * WEBSOCKETS FOR LIVE DATA
   ===========================*/
  livePrices: {},
  tradeData: {},
  startCryptoWebSocket: () => {
    // Price WebSocket
    const priceWs = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,cardano");
    priceWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      set((state) => ({ livePrices: { ...state.livePrices, ...data } }));
    };

    // Trade WebSocket
    const tradeWs = new WebSocket("wss://ws.coincap.io/trades/binance");
    tradeWs.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      set((state) => ({
        tradeData: {
          ...state.tradeData,
          [trade.base]: {
            price: trade.priceUsd,
            volume: trade.volume,
            direction: trade.direction,
            timestamp: trade.timestamp
          }
        }
      }));
    };

    set({ 
      cryptoPriceWebSocket: priceWs,
      cryptoTradeWebSocket: tradeWs 
    });
  },
  closeCryptoWebSocket: () => {
    get().cryptoPriceWebSocket?.close();
    get().cryptoTradeWebSocket?.close();
    set({ 
      cryptoPriceWebSocket: null,
      cryptoTradeWebSocket: null 
    });
  },

  /** ==========================
   * USER PREFERENCES
   ===========================*/
  favorites: loadFavorites(),
  addFavorite: (type, item) => {
    set((state) => {
      const newFavorites = {
        ...state.favorites,
        [type]: [...new Set([...state.favorites[type], item])],
      };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
      return { favorites: newFavorites };
    });
  },
  removeFavorite: (type, item) => {
    set((state) => {
      const newFavorites = {
        ...state.favorites,
        [type]: state.favorites[type].filter((fav) => fav !== item),
      };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
      return { favorites: newFavorites };
    });
  },
}));
