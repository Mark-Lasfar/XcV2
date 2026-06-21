import { api } from './api';

export const notificationService = {
  async getNotifications(limit?: number): Promise<any> {
    const response = await api.get(`/api/notifications${limit ? `?limit=${limit}` : ''}`);
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/api/notifications/unread-count');
    return response.data.count;
  },

  async markAsRead(id: string): Promise<void> {
    await api.put(`/api/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/api/notifications/read-all');
  },

  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/api/notifications/${id}`);
  },
};