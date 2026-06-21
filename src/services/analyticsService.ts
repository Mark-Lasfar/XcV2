import { api } from './api';

export const analyticsService = {
  async trackView(targetUserId: string): Promise<void> {
    await api.post('/api/analytics/track-view', { targetUserId });
  },

  async getProfileViews(): Promise<number> {
    const response = await api.get('/api/analytics/profile-views');
    return response.data.views;
  },

  async getImpressions(): Promise<number> {
    const response = await api.get('/api/analytics/impressions');
    return response.data.impressions;
  },

  async getSearchAppearances(): Promise<number> {
    const response = await api.get('/api/analytics/search-appearances');
    return response.data.searches;
  },
};