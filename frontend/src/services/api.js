import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.params = config.params || {}
    config.params.token = token
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  refresh: (token) => apiClient.post('/auth/refresh', { token }),
}

// Review API
export const reviewAPI = {
  reviewCode: (code, language, fileName) =>
    apiClient.post('/review/code', { code_content: code, code_language: language, file_name: fileName }),
  uploadFile: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/review/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  getReview: (id) => apiClient.get(`/review/${id}`),
}

// Chat API
export const chatAPI = {
  sendMessage: (message, reviewId) =>
    apiClient.post('/chat/message', { message, review_id: reviewId }),
  getHistory: (reviewId) =>
    apiClient.get('/chat/history', { params: { review_id: reviewId } }),
  deleteMessage: (id) => apiClient.delete(`/chat/message/${id}`),
}

// History API
export const historyAPI = {
  getHistory: (skip = 0, limit = 20, language = null) =>
    apiClient.get('/history', { params: { skip, limit, language } }),
  getStats: () => apiClient.get('/history/stats'),
  deleteReview: (id) => apiClient.delete(`/history/${id}`),
  exportReview: (id, format = 'json') =>
    apiClient.post(`/history/export/${id}`, null, { params: { format }, responseType: 'blob' }),
}

export default apiClient
