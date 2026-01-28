import api from './api';

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  
  login: (credentials) => api.post('/auth/login', credentials),
  
  getMe: () => api.get('/auth/me'),
  
  updateProfile: (data) => api.put('/auth/profile', data),
  
  getAllUsers: (params) => api.get('/auth/users', { params }),
};

// Alert Services
export const alertService = {
  getAtRiskStudents: () => api.get('/alerts/at-risk'),
  
  getMyAlerts: () => api.get('/alerts/my-alerts'),
  
  getThresholds: () => api.get('/alerts/thresholds'),
};

// Analytics Services
export const analyticsService = {
  getSubjectPerformance: (studentId) => api.get(`/analytics/subject-performance/${studentId}`),
  
  getMyPerformance: () => api.get('/analytics/my-performance'),
  
  getClassAnalytics: (params) => api.get('/analytics/class-analytics', { params }),
};

// Student Services
export const studentService = {
  getAll: () => api.get('/students'),
  
  getById: (id) => api.get(`/students/${id}`),
  
  create: (data) => api.post('/students', data),
  
  update: (id, data) => api.put(`/students/${id}`, data),
  
  delete: (id) => api.delete(`/students/${id}`),
  
  getPerformance: (id) => api.get(`/students/${id}/performance`),
};

// Subject Services
export const subjectService = {
  getAll: () => api.get('/subjects'),
  
  getById: (id) => api.get(`/subjects/${id}`),
  
  create: (data) => api.post('/subjects', data),
  
  update: (id, data) => api.put(`/subjects/${id}`, data),
  
  delete: (id) => api.delete(`/subjects/${id}`),
  
  getStatistics: (id) => api.get(`/subjects/${id}/statistics`),
};

// Performance Services
export const performanceService = {
  getAll: (params) => api.get('/performance', { params }),
  
  getById: (id) => api.get(`/performance/${id}`),
  
  create: (data) => api.post('/performance', data),
  
  update: (id, data) => api.put(`/performance/${id}`, data),
  
  delete: (id) => api.delete(`/performance/${id}`),
  
  getAnalytics: (params) => api.get('/performance/analytics/overview', { params }),
};
