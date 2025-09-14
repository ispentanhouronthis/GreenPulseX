import axios from 'axios'
import { useAuthStore } from './stores/auth-store'

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const apiEndpoints = {
  // Auth
  auth: {
    login: (email: string, password: string) =>
      api.post('/api/v1/auth/login-email', { email, password }),
    register: (userData: any) =>
      api.post('/api/v1/auth/register', userData),
    me: () => api.get('/api/v1/users/me'),
  },

  // Users
  users: {
    get: (id: string) => api.get(`/api/v1/users/${id}`),
    update: (id: string, data: any) => api.put(`/api/v1/users/${id}`, data),
    list: (params?: any) => api.get('/api/v1/users', { params }),
  },

  // Farms
  farms: {
    list: () => api.get('/api/v1/farms'),
    get: (id: string) => api.get(`/api/v1/farms/${id}`),
    create: (data: any) => api.post('/api/v1/farms', data),
    update: (id: string, data: any) => api.put(`/api/v1/farms/${id}`, data),
    delete: (id: string) => api.delete(`/api/v1/farms/${id}`),
  },

  // Devices
  devices: {
    list: (farmId?: string) => 
      api.get('/api/v1/devices', { params: farmId ? { farm_id: farmId } : {} }),
    get: (id: string) => api.get(`/api/v1/devices/${id}`),
    create: (data: any) => api.post('/api/v1/devices', data),
    update: (id: string, data: any) => api.put(`/api/v1/devices/${id}`, data),
    delete: (id: string) => api.delete(`/api/v1/devices/${id}`),
  },

  // Telemetry
  telemetry: {
    ingest: (data: any) => api.post('/api/v1/telemetry', data),
    ingestBatch: (data: any[]) => api.post('/api/v1/telemetry/batch', data),
    getFarmReadings: (farmId: string, params?: any) =>
      api.get(`/api/v1/telemetry/farm/${farmId}/readings`, { params }),
    getDeviceReadings: (deviceId: string, params?: any) =>
      api.get(`/api/v1/telemetry/device/${deviceId}/readings`, { params }),
    getFarmStats: (farmId: string, days: number = 30) =>
      api.get(`/api/v1/telemetry/farm/${farmId}/stats`, { params: { days } }),
  },

  // Predictions
  predictions: {
    predict: (data: any) => api.post('/api/v1/predict', data),
    getLatest: (farmId: string) => api.get(`/api/v1/predict/farm/${farmId}/latest`),
    getHistory: (farmId: string, params?: any) =>
      api.get(`/api/v1/predict/farm/${farmId}/history`, { params }),
    getModelVersion: () => api.get('/api/v1/predict/model/version'),
  },

  // Notifications
  notifications: {
    list: (params?: any) => api.get('/api/v1/notifications', { params }),
    getStats: () => api.get('/api/v1/notifications/stats'),
    update: (id: string, data: any) => api.put(`/api/v1/notifications/${id}`, data),
    markAllRead: () => api.put('/api/v1/notifications/mark-all-read'),
    delete: (id: string) => api.delete(`/api/v1/notifications/${id}`),
  },

  // Admin
  admin: {
    getStats: () => api.get('/api/v1/admin/stats'),
    getUsers: (params?: any) => api.get('/api/v1/admin/users', { params }),
    getFarms: (params?: any) => api.get('/api/v1/admin/farms', { params }),
    getDevices: (params?: any) => api.get('/api/v1/admin/devices', { params }),
    getPredictions: (params?: any) => api.get('/api/v1/admin/predictions', { params }),
    retrainModel: () => api.post('/api/v1/admin/retrain-model'),
    getModelVersions: () => api.get('/api/v1/admin/model-versions'),
  },
}

export default api
