import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '@/features/cryptoSlice';
import { CryptoData } from '@/types';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface CryptoCardProps {
  crypto: CryptoData;
}

export default function CryptoCard({ crypto }: CryptoCardProps) {
  const dispatch = useDispatch();
  const isFavorite = crypto.isFavorite || false;

  const handleFavoriteClick = () => {
    dispatch(toggleFavorite(crypto.id));
  };

  const priceChangeColor =
    crypto.change24h >= 0
      ? 'text-green-500'
      : 'text-red-500';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {crypto.name}
          </h3>
          <p className="text-gray-600">{crypto.id}</p>
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

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-gray-900">
            ${crypto.price.toLocaleString()}
          </p>
          <p className={`text-sm font-medium ${priceChangeColor}`}>
            {crypto.change24h >= 0 ? '+' : ''}
            {crypto.change24h.toFixed(2)}%
          </p>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Market Cap: ${crypto.marketCap.toLocaleString()}
        </p>
        <Link
          href={`/crypto/${crypto.id}`}
          className="mt-4 inline-block text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
} 