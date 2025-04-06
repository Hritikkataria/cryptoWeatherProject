'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceHistory {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export function CryptoDetailClient() {
  const { id } = useParams();
  const [priceHistory, setPriceHistory] = useState<PriceHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`
        );
        setPriceHistory(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch price history');
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [id]);

  const chartData = {
    labels: priceHistory?.prices.map(([timestamp]) =>
      new Date(timestamp).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Price (USD)',
        data: priceHistory?.prices.map(([, price]) => price) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Market Cap (USD)',
        data: priceHistory?.market_caps.map(([, cap]) => cap) || [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Volume (USD)',
        data: priceHistory?.total_volumes.map(([, volume]) => volume) || [],
        borderColor: 'rgb(53, 162, 235)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Price History',
      },
    },
    scales: {
      y: {
        type: 'logarithmic' as const,
        min: Math.min(...(priceHistory?.prices.map(([, price]) => price) || [1])) * 0.95,
        max: Math.max(...(priceHistory?.prices.map(([, price]) => price) || [1])) * 1.05,
      },
    },
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 capitalize">
          {id} Details
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </Layout>
  );
} 