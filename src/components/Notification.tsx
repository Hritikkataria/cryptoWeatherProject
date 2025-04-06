import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeNotification } from '@/features/notificationsSlice';
import { NotificationType } from '@/types';

interface NotificationProps {
  notification: NotificationType;
}

export default function Notification({ notification }: NotificationProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, 5000);

    return () => clearTimeout(timer);
  }, [dispatch, notification.id]);

  const getIcon = () => {
    switch (notification.type) {
      case 'price_alert':
        return '💰';
      case 'weather_alert':
        return '🌤️';
      case 'system':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ease-in-out ${
        notification.type === 'price_alert'
          ? 'bg-blue-100 border-l-4 border-blue-500'
          : 'bg-yellow-100 border-l-4 border-yellow-500'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 text-2xl">{getIcon()}</div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {notification.message}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {new Date(notification.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => dispatch(removeNotification(notification.id))}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 