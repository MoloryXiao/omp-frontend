import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import { removeToken, removeUserEmail } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'JWT' + getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.log(error) // for debug
    console.log(error.response) // for debug
    if (error.response.status) {
      switch (error.response.status) {
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          Message({
            message: '登录过期，请重新登录',
            type: 'error',
            duration: 5 * 1000
          })
          // 清除token
          removeToken()
          removeUserEmail()
          // resetRouter()
          break
        // 404请求不存在
        case 404:
          Message({
            message: '网络资源不存在',
            type: 'error',
            duration: 5 * 1000
          })
          break
        // 其他错误，直接抛出错误提示
        default:
          Message({
            message: error.response,
            type: 'error',
            duration: 5 * 1000
          })
      }
    }
    return Promise.reject(error)
  }
)

export default service
