import { NewsItem } from '@/types';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {news.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {news.description}
        </p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            {new Date(news.publishedAt).toLocaleDateString()}
          </span>
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Read More →
          </a>
        </div>
      </div>
    </div>
  );
} 