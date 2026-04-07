import { apiClient } from './client.js'

export function getCurrentUserRequest() {
  return apiClient.get('/users/me')
}
