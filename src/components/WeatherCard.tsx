import { useDispatch } from 'react-redux';
import { toggleFavorite } from '@/features/weatherSlice';
import { WeatherData } from '@/types';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const dispatch = useDispatch();
  const isFavorite = weather.isFavorite || false;

  const handleFavoriteClick = () => {
    dispatch(toggleFavorite(weather.city));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{weather.city}</h3>
          <p className="text-gray-600">{weather.description}</p>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="text-yellow-400 hover:text-yellow-500 focus:outline-none"
        >
          {isFavorite ? (
            <StarIcon className="h-6 w-6" />
          ) : (
            <StarOutlineIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {Math.round(weather.temperature)}°C
            </p>
            <p className="text-sm text-gray-600">
              Humidity: {weather.humidity}%
            </p>
            <p className="text-sm text-gray-600">
              Wind: {weather.windSpeed} m/s
            </p>
          </div>
        </div>
        <Link
          href={`/weather/${weather.city.toLowerCase()}`}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
} 