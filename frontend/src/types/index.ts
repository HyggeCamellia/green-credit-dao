/** 用户角色类型 */
export type UserRole = 'enterprise' | 'bank' | 'regulatory' | 'datasource'

export interface User {
  id: string
  username: string
  role: UserRole
  companyName: string
  email: string
  phone: string
  walletAddress?: string
}

export type GreenRating = 'A' | 'AA' | 'AAA'

export interface Enterprise {
  id: string
  name: string
  businessLicense: string
  industryType: string
  registeredAddress: string
  legalRepresentative: string
  walletAddress: string
  rating?: GreenRating
  ratingDate?: string
  ratingScore?: number
}

export interface RatingApplication {
  id: string
  enterpriseId: string
  enterpriseName: string
  bankId: string
  bankName: string
  status: 'pending' | 'processing' | 'approved' | 'rejected'
  submittedDate: string
  processedDate?: string
  ratingScore?: number
  rating?: GreenRating
  zkProof?: string
  txHash?: string
}

export interface AuthorizationRecord {
  id: string
  enterpriseId: string
  dataSourceId: string
  dataSourceName: string
  dataType: string
  status: 'pending' | 'authorized' | 'revoked'
  createdDate: string
  expiryDate: string
  txHash: string
}

export interface GreenCertificate {
  id: string
  enterpriseId: string
  enterpriseName: string
  rating: GreenRating
  issuedDate: string
  expiryDate: string
  certificateHash: string
  zkProof: string
  qrCode: string
}

export interface CarbonData {
  id: string
  enterpriseId: string
  dataSourceId: string
  dataType: string
  value: number
  unit: string
  encryptedValue?: string
  timestamp: string
  status: 'pending' | 'verified' | 'encrypted'
}

export interface RatingInput {
  enterpriseId: string
  carbonData: number
  powerConsumption: number
  complianceScore: number
  dataQuality: number
}

export interface ApiResponse<T> {
  code: number
  message: string
  data?: T
}

export interface PageResult<T> {
  total: number
  pageSize: number
  pageNum: number
  list: T[]
}
