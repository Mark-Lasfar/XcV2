import { ProfileData, ProfileUpdateData } from '../types/profile';
import { Section, SectionVisibility } from '../types/section';
import { api } from './api';

// ✅ إضافة normalizeSections للاستخدام في الخدمة
import { normalizeSections } from '../types/section';

export const profileService = {
  // ============================================
  // PROFILE CRUD
  // ============================================

  async getProfile(nickname: string): Promise<ProfileData> {
    const response = await api.get(`/api/profile/${encodeURIComponent(nickname)}`);
    return response.data;
  },

  async getMyProfile(): Promise<ProfileData> {
    const response = await api.get('/api/profile/me');
    return response.data;
  },

  async updateProfile(data: ProfileUpdateData): Promise<ProfileData> {
    const response = await api.put('/api/profile', data);
    return response.data;
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/api/profile/me');
  },

  // ============================================
  // SECTIONS
  // ============================================

  async updateSections(sections: Section[]): Promise<Section[]> {
    const response = await api.put('/api/profile/sections', { sections });
    return response.data.sections || [];
  },

  async updateVisibility(visibility: SectionVisibility): Promise<SectionVisibility> {
    const response = await api.put('/api/profile/section-visibility', visibility);
    return response.data;
  },

  async updateSectionOrder(order: { id: string; column: string; order: number }[]): Promise<void> {
    await api.put('/api/profile/section-order', { order });
  },

  async updateSectionNames(names: Record<string, string>): Promise<void> {
    await api.put('/api/profile/section-names', { names });
  },

  // ============================================
  // DESIGN & THEME
  // ============================================

  async updateDesignSettings(settings: any): Promise<void> {
    await api.put('/api/profile/design-settings', settings);
  },

  async getDesignSettings(): Promise<any> {
    const response = await api.get('/api/profile/design-settings');
    return response.data;
  },

  async resetDesignSettings(): Promise<void> {
    await api.post('/api/profile/design-settings/reset');
  },

  // ============================================
  // AI SETTINGS
  // ============================================

  async updateAISettings(settings: any): Promise<void> {
    await api.put('/api/profile/ai-settings', settings);
  },

  async getAISettings(): Promise<any> {
    const response = await api.get('/api/profile/ai-settings');
    return response.data;
  },

  async getAIStats(): Promise<any> {
    const response = await api.get('/api/ai/stats');
    return response.data;
  },

  // ============================================
  // UPLOADS
  // ============================================

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  },

  async uploadCover(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  },

  async uploadProjectImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload/project', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  },

  async uploadMultiple(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await api.post('/api/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.urls;
  },

  // ============================================
  // STATS & ANALYTICS
  // ============================================

  async getStats(userId: string): Promise<any> {
    const response = await api.get(`/api/users/${userId}/stats`);
    return response.data;
  },

  async getRatings(userId: string): Promise<any> {
    const response = await api.get(`/api/ratings/${userId}`);
    return response.data;
  },

  async submitRating(userId: string, rating: number, review?: string): Promise<void> {
    await api.post('/api/ratings', { targetUserId: userId, rating, review });
  },

  async getContributions(userId: string, year?: number): Promise<any> {
    const response = await api.get(`/api/users/${userId}/contributions${year ? `?year=${year}` : ''}`);
    return response.data;
  },

  async getInteractions(userId: string, page?: number): Promise<any> {
    const response = await api.get(`/api/profile/${userId}/interactions${page ? `?page=${page}` : ''}`);
    return response.data;
  },

  // ============================================
  // SUGGESTIONS
  // ============================================

  async getSuggestions(): Promise<any> {
    const response = await api.get('/api/users/suggestions');
    return response.data;
  },

  async getAlsoViewed(userId: string): Promise<any> {
    const response = await api.get(`/api/analytics/also-viewed?userId=${userId}`);
    return response.data;
  },

  async getPageSuggestions(): Promise<any> {
    const response = await api.get('/api/pages/suggestions');
    return response.data;
  },

  async followPage(pageId: string): Promise<any> {
    const response = await api.post(`/api/pages/${pageId}/follow`);
    return response.data;
  },

  async unfollowPage(pageId: string): Promise<any> {
    const response = await api.delete(`/api/pages/${pageId}/follow`);
    return response.data;
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================

  async getNotifications(limit?: number): Promise<any> {
    const response = await api.get(`/api/notifications${limit ? `?limit=${limit}` : ''}`);
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/api/notifications/unread-count');
    return response.data.count;
  },

  async markNotificationRead(id: string): Promise<void> {
    await api.put(`/api/notifications/${id}/read`);
  },

  async markNotificationsRead(): Promise<void> {
    await api.put('/api/notifications/read-all');
  },

  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/api/notifications/${id}`);
  },

  // ============================================
  // FOLLOW / UNFOLLOW
  // ============================================

  async followUser(userId: string): Promise<any> {
    const response = await api.post(`/api/users/${userId}/follow`);
    return response.data;
  },

  async unfollowUser(userId: string): Promise<any> {
    const response = await api.delete(`/api/users/${userId}/follow`);
    return response.data;
  },

  async checkFollowStatus(userId: string): Promise<boolean> {
    const response = await api.get(`/api/users/${userId}/follow`);
    return response.data.isFollowing;
  },

  // ============================================
  // INTERACTIONS PRIVACY
  // ============================================

  async getInteractionsPrivacy(): Promise<any> {
    const response = await api.get('/api/user/interactions/privacy');
    return response.data;
  },

  async updateInteractionsPrivacy(settings: any): Promise<any> {
    const response = await api.put('/api/user/interactions/privacy', settings);
    return response.data;
  },

  // ============================================
  // CUSTOM SECTIONS
  // ============================================

  async getCustomSections(): Promise<any> {
    const response = await api.get('/api/profile/custom-sections');
    return response.data;
  },

  async createCustomSection(data: any): Promise<any> {
    const response = await api.post('/api/profile/custom-sections', data);
    return response.data;
  },

  async updateCustomSection(id: string, data: any): Promise<any> {
    const response = await api.put(`/api/profile/custom-sections/${id}`, data);
    return response.data;
  },

  async deleteCustomSection(id: string): Promise<any> {
    const response = await api.delete(`/api/profile/custom-sections/${id}`);
    return response.data;
  },

  // ============================================
  // LAYOUT PRESETS
  // ============================================

  async getLayoutPresets(): Promise<any> {
    const response = await api.get('/api/profile/layout-presets');
    return response.data;
  },

  async saveLayoutPreset(data: any): Promise<any> {
    const response = await api.post('/api/profile/layout-presets', data);
    return response.data;
  },

  async applyLayoutPreset(id: string): Promise<any> {
    const response = await api.post(`/api/profile/layout-presets/${id}/apply`);
    return response.data;
  },

  async deleteLayoutPreset(id: string): Promise<any> {
    const response = await api.delete(`/api/profile/layout-presets/${id}`);
    return response.data;
  },

  // ============================================
  // ANALYTICS
  // ============================================

  async trackView(targetUserId: string): Promise<void> {
    await api.post('/api/analytics/track-view', { targetUserId });
  },

  async getAnalytics(): Promise<any> {
    const response = await api.get('/api/analytics/profile');
    return response.data;
  },

  // ============================================
  // NOTIFICATION SETTINGS
  // ============================================

  async getNotificationSettings(): Promise<any> {
    const response = await api.get('/api/notification-settings');
    return response.data;
  },

  async updateNotificationSettings(settings: any): Promise<any> {
    const response = await api.put('/api/notification-settings', settings);
    return response.data;
  },

  // ============================================
  // RESUME / CV
  // ============================================

  async getResume(nickname: string): Promise<any> {
    const response = await api.get(`/api/profile/resume/${encodeURIComponent(nickname)}`);
    return response.data;
  },

  async generatePDF(nickname: string): Promise<any> {
    const response = await api.get(`/api/profile/pdf/${encodeURIComponent(nickname)}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // ============================================
  // AUDIO SETTINGS
  // ============================================

  async updateAudioSettings(settings: any): Promise<any> {
    const response = await api.put('/api/profile/audio', settings);
    return response.data;
  },

  // ============================================
  // SECTION STYLE SETTINGS
  // ============================================

  async updateSectionStyleSettings(settings: Record<string, any>): Promise<any> {
    const response = await api.put('/api/profile/section-style-settings', { settings });
    return response.data;
  },

  async getSectionStyleSettings(): Promise<any> {
    const response = await api.get('/api/profile/section-style-settings');
    return response.data;
  },
};

export default profileService;