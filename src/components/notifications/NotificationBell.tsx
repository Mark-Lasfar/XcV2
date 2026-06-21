import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { NotificationList } from './NotificationList';
import { useNotifications } from '../../hooks/useNotifications';
import { useClickOutside } from '../../hooks/useClickOutside';

interface NotificationBellProps {
  unreadCount?: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ unreadCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { markAllAsRead } = useNotifications();
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden z-50">
          <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
            <h3 className="font-semibold">Notifications</h3>
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-500 hover:text-blue-600 transition"
            >
              Mark all as read
            </button>
          </div>
          <NotificationList onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};