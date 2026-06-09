import axios from 'axios'
import { config } from '@/config'
import logger from '@/config/logger'

export const callBlockchainService = async (method: string, params: any) => {
  try {
    const response = await axios.post(`${config.JAVA_SERVICE_URL}/api/blockchain/${method}`, params, {
      timeout: 30000,
    })
    return response.data
  } catch (error: any) {
    logger.error(`Blockchain service error: ${method}`, error)
    throw error
  }
}

export const submitRatingToContract = async (enterpriseId: string, ratingData: any) => {
  return callBlockchainService('submitRating', {
    enterpriseId,
    ...ratingData,
  })
}

export const getRatingFromContract = async (enterpriseId: string) => {
  return callBlockchainService('getRating', { enterpriseId })
}

export const generateZKProof = async (data: any) => {
  return callBlockchainService('generateZKProof', data)
}

export const verifyZKProof = async (proof: string, data: any) => {
  return callBlockchainService('verifyZKProof', { proof, data })
}
