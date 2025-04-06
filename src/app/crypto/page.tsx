'use client';

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoData } from '@/features/cryptoSlice';
import { AppDispatch, RootState } from '@/types';
import Layout from '@/components/Layout';
import CryptoCard from '@/components/CryptoCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatDate } from '@/utils/formatters';
import { REFRESH_INTERVALS } from '@/utils/constants';

export default function CryptoPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { coins, loading, error, lastUpdated } = useSelector((state: RootState) => state.crypto);

  useEffect(() => {
    // Only fetch if data is stale (older than 1 minute) or doesn't exist
    const shouldFetch = !lastUpdated || Date.now() - lastUpdated > REFRESH_INTERVALS.CRYPTO;
    
    if (shouldFetch) {
      dispatch(fetchCryptoData());
    }

    const interval = setInterval(() => {
      dispatch(fetchCryptoData());
    }, REFRESH_INTERVALS.CRYPTO);

    return () => clearInterval(interval);
  }, [dispatch, lastUpdated]);

  // Memoize the grid of crypto cards to prevent unnecessary re-renders
  const cryptoGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coins.map((coin) => (
        <CryptoCard key={coin.id} crypto={coin} />
      ))}
    </div>
  ), [coins]);

  if (loading && coins.length === 0) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Cryptocurrency Dashboard</h1>
          {loading && <LoadingSpinner size="small" />}
        </div>
        <p className="text-gray-600">Last updated: {formatDate(lastUpdated || Date.now())}</p>
        {cryptoGrid}
      </div>
    </Layout>
  );
} 