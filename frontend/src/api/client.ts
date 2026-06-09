import axios, { AxiosInstance } from 'axios'
import { ApiResponse } from '@/types'
import { useAuthStore } from '@/store/authStore'

const client: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
client.interceptors.response.use(
  (response) => {
    const data: ApiResponse<any> = response.data
    if (data.code === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default client
