const AUTH_TOKEN_KEY = 'encuba.frontend.token'

export function getStoredToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY) ?? ''
}

export function setStoredToken(token) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearStoredToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
}
