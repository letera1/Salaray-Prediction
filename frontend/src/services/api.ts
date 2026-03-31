import axios from 'axios';
import { PredictionRequest, PredictionResult, DataStats, SalaryInsights } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.detail || 'Invalid request data.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
);

export const apiService = {
  // Health check
  async healthCheck() {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Predict salary
  async predictSalary(data: PredictionRequest): Promise<PredictionResult> {
    const response = await apiClient.post('/predict', data);
    return response.data;
  },

  // Get dataset statistics
  async getStats(): Promise<DataStats> {
    const response = await apiClient.get('/stats');
    return response.data;
  },

  // Get available departments
  async getDepartments(): Promise<string[]> {
    const response = await apiClient.get('/departments');
    return response.data;
  },

  // Get available education levels
  async getEducationLevels(): Promise<string[]> {
    const response = await apiClient.get('/education-levels');
    return response.data;
  },

  // Get available locations
  async getLocations(): Promise<string[]> {
    const response = await apiClient.get('/locations');
    return response.data;
  },

  // Get salary insights
  async getSalaryInsights(): Promise<SalaryInsights> {
    const response = await apiClient.get('/salary-insights');
    return response.data;
  },

  // Get API info
  async getApiInfo() {
    const response = await apiClient.get('/');
    return response.data;
  },
};

export default apiService;