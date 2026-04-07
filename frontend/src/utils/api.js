import axios from 'axios'

export function extractErrorMessage(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message

    if (Array.isArray(responseMessage)) {
      return responseMessage.join(', ')
    }

    if (typeof responseMessage === 'string') {
      return responseMessage
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}
