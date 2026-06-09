import client from './client'
import { User, ApiResponse } from '@/types'

export const login = async (username: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
  const response = await client.post('/auth/login', { username, password })
  return response.data
}

export const register = async (data: {
  username: string
  password: string
  role: string
  companyName: string
  email: string
  phone: string
}): Promise<ApiResponse<User>> => {
  const response = await client.post('/auth/register', data)
  return response.data
}

export const refreshToken = async (): Promise<ApiResponse<{ token: string }>> => {
  const response = await client.post('/auth/refresh')
  return response.data
}

export const getUserInfo = async (): Promise<ApiResponse<User>> => {
  const response = await client.get('/auth/user')
  return response.data
}
