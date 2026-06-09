import client from './client'
import { ApiResponse } from '@/types'

export const getPendingApplications = async (): Promise<ApiResponse<any[]>> => {
  const response = await client.get('/bank/pending-applications')
  return response.data
}

export const approveApplication = async (
  applicationId: string,
  data: { ratingScore: number; rating: string; zkProof: string }
): Promise<ApiResponse<any>> => {
  const response = await client.post(`/bank/approve-application/${applicationId}`, data)
  return response.data
}

export const rejectApplication = async (applicationId: string): Promise<ApiResponse<any>> => {
  const response = await client.post(`/bank/reject-application/${applicationId}`, { reason: 'Rejected by bank' })
  return response.data
}

export const getMonitorData = async (enterpriseId: string): Promise<ApiResponse<any>> => {
  const response = await client.get(`/bank/monitor-enterprise/${enterpriseId}`)
  return response.data
}
