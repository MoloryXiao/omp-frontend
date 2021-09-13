import Cookies from 'js-cookie'

const TokenKey = 'omp_platform_token'
const EmailKey = 'user_email'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserEmail() {
  return Cookies.get(EmailKey)
}

export function setUserEmail(email) {
  return Cookies.set(EmailKey, email)
}

export function removeUserEmail() {
  return Cookies.remove(EmailKey)
}
