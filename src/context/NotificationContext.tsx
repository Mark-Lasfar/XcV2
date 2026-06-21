import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { useAuth } from '../hooks/useAuth';

export interface Notification {
  _id: string;
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  type?: 'follow' | 'like' | 'comment' | 'share' | 'message' | 'system';
  actorId?: {
    _id: string;
    profile?: {
      nickname: string;
      avatar: string;
    };
    username: string;
  };
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await profileService.getNotifications();
      // ✅ توحيد البيانات مع id
      const formattedData = (data.data || []).map((n: any) => ({
        ...n,
        id: n._id || n.id,
      }));
      setNotifications(formattedData);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await profileService.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id || n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await profileService.markNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await profileService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id && n._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated, loadNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        loadNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// ✅ تعريف useNotifications هنا فقط
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};