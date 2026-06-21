// services/aiService.ts

import { api } from "./api";

export const aiService = {
  async askQuestion(nickname: string, question: string): Promise<any> {
    const response = await api.post(`/api/profile/${nickname}/ask`, { question });
    return response.data;
  },

  async getAISettings(): Promise<any> {
    const response = await api.get('/api/profile/ai-settings');
    return response.data;
  },

  async updateAISettings(settings: any): Promise<void> {
    await api.put('/api/profile/ai-settings', settings);
  },

  async getAIStats(): Promise<any> {
    const response = await api.get('/api/ai/stats');
    return response.data;
  },
};