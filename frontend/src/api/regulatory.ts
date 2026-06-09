import client from './client'
import { ApiResponse } from '@/types'

export interface GreenWashAlert {
  id: number
  enterpriseName: string
  reportedRating: string
  actualRating: string
  discrepancy: number
  status: string
  alertDate: string
  severity: string
}

export const getGreenWashingAlerts = async (): Promise<ApiResponse<GreenWashAlert[]>> => {
  const response = await client.get('/regulatory/green-washing-alerts')
  return response.data
}

export const investigateEnterprise = async (enterpriseName: string): Promise<ApiResponse<any>> => {
  const response = await client.post('/regulatory/investigate', { enterpriseName })
  return response.data
}

export const revokeRating = async (enterpriseName: string): Promise<ApiResponse<any>> => {
  const response = await client.post('/regulatory/revoke-rating', { enterpriseName })
  return response.data
}
