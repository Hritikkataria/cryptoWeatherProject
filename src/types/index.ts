export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  isFavorite?: boolean;
}

export interface CryptoData {
  id: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  isFavorite?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

export interface NotificationType {
  id: string;
  type: 'price_alert' | 'weather_alert' | 'system';
  message: string;
  timestamp: number;
}

export type { AppDispatch } from '@/features/store';
export type { RootState } from '@/features/store'; 