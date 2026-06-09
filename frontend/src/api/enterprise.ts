import client from './client'
import { Enterprise, RatingApplication, AuthorizationRecord, GreenCertificate, ApiResponse, PageResult } from '@/types'

export const registerEnterprise = async (data: Omit<Enterprise, 'id' | 'walletAddress'>): Promise<ApiResponse<Enterprise>> => {
  const response = await client.post('/enterprise/register', data)
  return response.data
}

export const getEnterpriseInfo = async (enterpriseId: string): Promise<ApiResponse<Enterprise>> => {
  const response = await client.get(`/enterprise/${enterpriseId}`)
  return response.data
}

export const submitRatingApplication = async (enterpriseId: string, bankId: string): Promise<ApiResponse<RatingApplication>> => {
  const response = await client.post('/enterprise/rating/apply', { enterpriseId, bankId })
  return response.data
}

export const getRatingApplications = async (_enterpriseId: string, pageNum: number = 1, pageSize: number = 10): Promise<ApiResponse<PageResult<RatingApplication>>> => {
  const response = await client.get(`/enterprise/rating/applications?pageNum=${pageNum}&pageSize=${pageSize}`)
  return response.data
}

export const authorizeDataSource = async (enterpriseId: string, dataSourceId: string, dataType: string, expiryDate: string): Promise<ApiResponse<AuthorizationRecord>> => {
  const response = await client.post('/enterprise/authorize', { enterpriseId, dataSourceId, dataType, expiryDate })
  return response.data
}

export const getAuthorizationRecords = async (_enterpriseId: string, pageNum: number = 1, pageSize: number = 10): Promise<ApiResponse<PageResult<AuthorizationRecord>>> => {
  const response = await client.get(`/enterprise/authorizations?pageNum=${pageNum}&pageSize=${pageSize}`)
  return response.data
}

export const getGreenCertificate = async (enterpriseId: string): Promise<ApiResponse<GreenCertificate>> => {
  const response = await client.get(`/enterprise/certificate/${enterpriseId}`)
  return response.data
}

export const getCredits = async (enterpriseId: string): Promise<ApiResponse<{ credits: number; redeemable: number }>> => {
  const response = await client.get(`/enterprise/credits/${enterpriseId}`)
  return response.data
}
