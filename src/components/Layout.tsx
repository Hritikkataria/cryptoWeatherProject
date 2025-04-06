import { ReactNode } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Notification from './Notification';
import { NotificationType, RootState } from '@/types';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/"
                className="flex items-center text-xl font-bold text-gray-800"
              >
                CryptoWeather Nexus
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  href="/weather"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
                >
                  Weather
                </Link>
                <Link
                  href="/crypto"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
                >
                  Crypto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {notifications.map((notification: NotificationType) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
} 