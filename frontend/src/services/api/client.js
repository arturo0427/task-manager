import axios from 'axios'
import { getStoredToken } from '../../utils/auth-storage.js'

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim()

export const apiClient = axios.create({
  baseURL: configuredBaseUrl || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
