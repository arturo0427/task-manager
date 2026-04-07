import { apiClient } from './client.js'

export function registerRequest(payload) {
  return apiClient.post('/auth/register', payload)
}

export function loginRequest(payload) {
  return apiClient.post('/auth/login', payload)
}
