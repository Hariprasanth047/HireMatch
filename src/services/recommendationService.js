import apiClient from './api';

export const recommendationService = {
  async getRecommendations(params = {}) {
    const response = await apiClient.get('/recommendations/jobs', { params });
    return response.data;
  },
};

export default recommendationService;
