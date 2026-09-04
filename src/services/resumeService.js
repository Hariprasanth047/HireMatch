import apiClient from './api';

export const resumeService = {
  async uploadResumeFile(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await apiClient.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getMyResume() {
    const response = await apiClient.get('/resumes/my-resume');
    return response.data;
  },

  async deleteResume(id) {
    const response = await apiClient.delete(`/resumes/${id}`);
    return response.data;
  },
};

export default resumeService;
