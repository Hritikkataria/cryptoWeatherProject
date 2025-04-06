export const CITIES = [
  'London',
  'New York',
  'Tokyo',
  'Paris',
  'Sydney',
  'Dubai'
];

export const CRYPTO_COINS = [
  'bitcoin',
  'ethereum',
  'dogecoin',
  'cardano',
  'solana'
];

export const API_ENDPOINTS = {
  WEATHER: 'https://api.openweathermap.org/data/2.5',
  COINGECKO: 'https://api.coingecko.com/api/v3',
  NEWSDATA: 'https://newsdata.io/api/1',
} as const;

export const WEBSOCKET_URL = 'wss://ws.coincap.io/prices?assets=bitcoin,ethereum';

export const REFRESH_INTERVALS = {
  WEATHER: 300000, // 5 minutes
  CRYPTO: 60000,   // 1 minute
  NEWS: 300000     // 5 minutes
};

export const PRICE_ALERT_THRESHOLD = 1; // 1% price change threshold 