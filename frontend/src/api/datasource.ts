import client from './client'
import { ApiResponse } from '@/types'

export const uploadData = async (data: {
  enterpriseId: string
  dataType: string
  value: number
  unit: string
  encryptedValue?: string
}): Promise<ApiResponse<any>> => {
  const response = await client.post('/datasource/upload', data)
  return response.data
}

export const getPendingAuthorizations = async (): Promise<ApiResponse<any[]>> => {
  const response = await client.get('/datasource/pending-authorizations')
  return response.data
}

export const approveAuthorization = async (authId: string): Promise<ApiResponse<any>> => {
  const response = await client.post(`/datasource/approve-authorization/${authId}`)
  return response.data
}

export const rejectAuthorization = async (authId: string): Promise<ApiResponse<any>> => {
  const response = await client.post(`/datasource/reject-authorization/${authId}`)
  return response.data
}

export const getQualityMonitor = async (): Promise<ApiResponse<any>> => {
  const response = await client.get('/datasource/quality-monitor')
  return response.data
}
