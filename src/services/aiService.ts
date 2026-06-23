import { publicApi, api } from "./api";

export const aiService = {
  // ✅ استخدم publicApi للزوار (بدون توكن)، لكن لو المستخدم مسجل دخول هيستخدم التوكن
  async askQuestion(nickname: string, question: string): Promise<any> {
    // ✅ نستخدم publicApi عشان الزوار العاديين يقدرون يسألون
    // لكن لو فيه توكن، هيتم إضافته تلقائياً من الـ interceptor
    const response = await publicApi.post(`/api/profile/${encodeURIComponent(nickname)}/ask`, { question });
    return response.data;
  },

  // ✅ هذه الطلبات محتاجة توكن (للمالك فقط)
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

  // ✅ جلب حالة البوت (عام - بدون توكن)
  async getAIStatus(nickname: string): Promise<{ enabled: boolean }> {
    const response = await publicApi.get(`/api/profile/${encodeURIComponent(nickname)}/ai-status`);
    return response.data;
  },
};