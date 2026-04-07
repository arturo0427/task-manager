import { apiClient } from './client.js'

export function getTasksRequest() {
  return apiClient.get('/tasks')
}

export function createTaskRequest(payload) {
  return apiClient.post('/tasks', payload)
}

export function updateTaskRequest(taskId, payload) {
  return apiClient.put(`/tasks/${taskId}`, payload)
}

export function deleteTaskRequest(taskId) {
  return apiClient.delete(`/tasks/${taskId}`)
}
