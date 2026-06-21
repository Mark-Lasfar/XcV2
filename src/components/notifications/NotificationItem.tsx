import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { Notification } from '../../context/NotificationContext';
import { useNotifications } from '../../hooks/useNotifications';
import { X } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
}) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification.id || notification._id);
    }
    if (notification.link && onClose) {
      onClose();
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notification.id || notification._id);
  };

  const avatar = notification.actorId?.profile?.avatar || '/assets/img/default-avatar.png';
  const name = notification.actorId?.profile?.nickname || notification.actorId?.username || 'System';

  return (
    <Link
      to={notification.link || '#'}
      onClick={handleClick}
      className={`
        flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer
        ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
      `}
    >
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{name}</span>
          <span className="text-gray-600 dark:text-gray-400 ml-1">
            {notification.message}
          </span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {formatDate(notification.createdAt)}
        </p>
      </div>
      <button
        onClick={handleDelete}
        className="p-1 text-gray-400 hover:text-red-500 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </Link>
  );
};