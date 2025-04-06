'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          The page you are looking for does not exist.
        </p>
        <div className="flex gap-4">
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Go to Home
          </Link>
          <Link href="/crypto" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
            View Cryptocurrencies
          </Link>
          <Link href="/weather" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
            Check Weather
          </Link>
        </div>
      </div>
    </Layout>
  );
} 