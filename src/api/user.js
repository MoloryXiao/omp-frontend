import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/jwt-token',
    method: 'post',
    data
  })
}

export function getInfo(email) {
  return request({
    url: '/api/user/user-info',
    method: 'get',
    params: {
      'email': email
    }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function userRegister(data) {
  return request({
    url: '/api/user/user-register/',
    method: 'post',
    data
  })
}
