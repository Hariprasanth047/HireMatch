import apiClient from './api';

export const userService = {
  async getProfile() {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },
};

export default userService;
