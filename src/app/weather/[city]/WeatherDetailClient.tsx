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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeatherHistory {
  dt: number;
  temp: number;
  humidity: number;
}

export function WeatherDetailClient() {
  const { city } = useParams();
  const [weatherHistory, setWeatherHistory] = useState<WeatherHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherHistory = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        const history = response.data.list.map((item: any) => ({
          dt: item.dt * 1000,
          temp: item.main.temp,
          humidity: item.main.humidity,
        }));
        setWeatherHistory(history);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather history');
        setLoading(false);
      }
    };

    fetchWeatherHistory();
  }, [city]);

  const chartData = {
    labels: weatherHistory.map((item) =>
      new Date(item.dt).toLocaleTimeString([], { hour: '2-digit' })
    ),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: weatherHistory.map((item) => item.temp),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Humidity (%)',
        data: weatherHistory.map((item) => item.humidity),
        borderColor: 'rgb(255, 99, 132)',
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
        text: 'Weather History',
      },
    },
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 capitalize">
          Weather in {city}
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </Layout>
  );
} 