import apiClient from './api';

export const applicationService = {
  async applyForJob(applicationData) {
    const response = await apiClient.post('/applications', applicationData);
    return response.data;
  },

  async getMyApplications() {
    const response = await apiClient.get('/applications/my-applications');
    return response.data;
  },

  async getApplicationById(id) {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  },

  async getJobApplicants(jobId, params = {}) {
    const response = await apiClient.get(`/applications/job/${jobId}`, { params });
    return response.data;
  },

  async getAllApplicants(params = {}) {
    const response = await apiClient.get('/applications/recruiter/all', { params });
    return response.data;
  },

  async updateStatus(applicationId, status) {
    const response = await apiClient.put(`/applications/${applicationId}/status`, { status });
    return response.data;
  },
};

export default applicationService;
