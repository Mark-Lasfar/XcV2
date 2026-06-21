import React, { useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { Loader } from '../common/Loader';
import { EmptyState } from '../common/EmptyState';
import { Bell } from 'lucide-react';

interface NotificationListProps {
  onClose?: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const { notifications, loading, loadNotifications } = useNotifications();

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader size="sm" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={<Bell className="w-12 h-12" />}
        title="No notifications"
        description="You're all caught up!"
      />
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-72 overflow-y-auto">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};