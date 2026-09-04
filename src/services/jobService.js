import apiClient from './api';

export const jobService = {
  async getJobs(params = {}) {
    const response = await apiClient.get('/jobs', { params });
    return response.data;
  },

  async getJobById(id) {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },

  async createJob(jobData) {
    const response = await apiClient.post('/jobs', jobData);
    return response.data;
  },

  async updateJob(id, jobData) {
    const response = await apiClient.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  async deleteJob(id) {
    const response = await apiClient.delete(`/jobs/${id}`);
    return response.data;
  },

  async getMyJobs() {
    const response = await apiClient.get('/jobs/recruiter/my-jobs');
    return response.data;
  },
};

export default jobService;
