import { api } from './api';

export const uploadService = {
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
};