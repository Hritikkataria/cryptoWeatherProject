'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherData } from '@/features/weatherSlice';
import { fetchCryptoData } from '@/features/cryptoSlice';
import { fetchNewsData } from '@/features/newsSlice';
import { websocketService } from '@/services/websocket';
import Layout from '@/components/Layout';
import WeatherCard from '@/components/WeatherCard';
import CryptoCard from '@/components/CryptoCard';
import NewsCard from '@/components/NewsCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { RootState } from '@/types';
import { AppDispatch } from '@/features/store';
import { REFRESH_INTERVALS } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const weather = useSelector((state: RootState) => state.weather);
  const crypto = useSelector((state: RootState) => state.crypto);
  const news = useSelector((state: RootState) => state.news);
  const [activeTab, setActiveTab] = useState<'all' | 'weather' | 'crypto' | 'news'>('all');
  const [lastUpdated, setLastUpdated] = useState<Record<string, number>>({});

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(fetchWeatherData()),
          dispatch(fetchCryptoData()),
          dispatch(fetchNewsData())
        ]);
        websocketService.connect();
        updateLastUpdated('all');
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();

    // Set up refresh intervals
    const weatherInterval = setInterval(() => {
      dispatch(fetchWeatherData());
      updateLastUpdated('weather');
    }, REFRESH_INTERVALS.WEATHER);

    const cryptoInterval = setInterval(() => {
      dispatch(fetchCryptoData());
      updateLastUpdated('crypto');
    }, REFRESH_INTERVALS.CRYPTO);

    const newsInterval = setInterval(() => {
      dispatch(fetchNewsData());
      updateLastUpdated('news');
    }, REFRESH_INTERVALS.NEWS);

    // Cleanup
    return () => {
      clearInterval(weatherInterval);
      clearInterval(cryptoInterval);
      clearInterval(newsInterval);
      websocketService.disconnect();
    };
  }, [dispatch]);

  const updateLastUpdated = (section: string) => {
    setLastUpdated(prev => ({
      ...prev,
      [section]: Date.now()
    }));
  };

  // Memoize the card grids to prevent unnecessary re-renders
  const weatherGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {weather.cities.map((city) => (
        <WeatherCard key={city.city} weather={city} />
      ))}
    </div>
  ), [weather.cities]);

  const cryptoGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {crypto.coins.map((coin) => (
        <CryptoCard key={coin.id} crypto={coin} />
      ))}
    </div>
  ), [crypto.coins]);

  const newsGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {news.items.map((item) => (
        <NewsCard key={item.url} news={item} />
      ))}
    </div>
  ), [news.items]);

  const isLoading = weather.loading && crypto.loading && news.loading && 
    weather.cities.length === 0 && crypto.coins.length === 0 && news.items.length === 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  const renderSection = (title: string, grid: React.ReactNode, loading: boolean, error: string | null, type: 'weather' | 'crypto' | 'news') => (
    <section className={`transition-all duration-300 ${activeTab !== 'all' && activeTab !== type ? 'hidden' : ''}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">
              Last updated: {formatDate(lastUpdated[type] || Date.now())}
            </p>
          </div>
          {loading && <LoadingSpinner size="small" />}
        </div>
        {error ? (
          <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>
        ) : (
          grid
        )}
      </div>
    </section>
  );

  return (
    <Layout>
      <div className="mb-6 flex justify-center space-x-4">
        <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          All Dashboards
        </TabButton>
        <TabButton active={activeTab === 'weather'} onClick={() => setActiveTab('weather')}>
          Weather
        </TabButton>
        <TabButton active={activeTab === 'crypto'} onClick={() => setActiveTab('crypto')}>
          Crypto
        </TabButton>
        <TabButton active={activeTab === 'news'} onClick={() => setActiveTab('news')}>
          News
        </TabButton>
      </div>

      <div className="space-y-6">
        {renderSection('Weather Dashboard', weatherGrid, weather.loading, weather.error, 'weather')}
        {renderSection('Cryptocurrency Dashboard', cryptoGrid, crypto.loading, crypto.error, 'crypto')}
        {renderSection('Latest News', newsGrid, news.loading, news.error, 'news')}
      </div>
    </Layout>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition-all duration-300 ${
        active
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}
