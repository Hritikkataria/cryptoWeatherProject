'use client';

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherData } from '@/features/weatherSlice';
import { AppDispatch, RootState } from '@/types';
import Layout from '@/components/Layout';
import WeatherCard from '@/components/WeatherCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatDate } from '@/utils/formatters';
import { REFRESH_INTERVALS } from '@/utils/constants';

export default function WeatherPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { cities, loading, error, lastUpdated } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    // Only fetch if data is stale or doesn't exist
    const shouldFetch = !lastUpdated || Date.now() - lastUpdated > REFRESH_INTERVALS.WEATHER;
    
    if (shouldFetch) {
      dispatch(fetchWeatherData());
    }

    const interval = setInterval(() => {
      dispatch(fetchWeatherData());
    }, REFRESH_INTERVALS.WEATHER);

    return () => clearInterval(interval);
  }, [dispatch, lastUpdated]);

  // Memoize the grid of weather cards
  const weatherGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cities.map((city) => (
        <WeatherCard key={city.city} weather={city} />
      ))}
    </div>
  ), [cities]);

  if (loading && cities.length === 0) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Weather Dashboard</h1>
          {loading && <LoadingSpinner size="small" />}
        </div>
        <p className="text-gray-600">Last updated: {formatDate(lastUpdated || Date.now())}</p>
        {weatherGrid}
      </div>
    </Layout>
  );
} 