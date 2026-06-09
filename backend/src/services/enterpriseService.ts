import pool from '@/config/database'
import logger from '@/config/logger'

export const getEnterprise = async (enterpriseId: string) => {
  try {
    const result = await pool.query(
      'SELECT * FROM enterprises WHERE id = $1',
      [enterpriseId]
    )
    return result.rows[0] || null
  } catch (error) {
    logger.error('Get enterprise error:', error)
    throw error
  }
}

export const createEnterprise = async (data: any) => {
  try {
    const result = await pool.query(
      `INSERT INTO enterprises (name, business_license, industry_type, registered_address, legal_representative, wallet_address, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [data.name, data.businessLicense, data.industryType, data.registeredAddress, data.legalRepresentative, data.walletAddress]
    )
    return result.rows[0]
  } catch (error) {
    logger.error('Create enterprise error:', error)
    throw error
  }
}

export const getRatingApplication = async (applicationId: string) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rating_applications WHERE id = $1',
      [applicationId]
    )
    return result.rows[0] || null
  } catch (error) {
    logger.error('Get rating application error:', error)
    throw error
  }
}

export const createRatingApplication = async (data: any) => {
  try {
    const result = await pool.query(
      `INSERT INTO rating_applications (enterprise_id, bank_id, status, submitted_date)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [data.enterpriseId, data.bankId, 'pending']
    )
    return result.rows[0]
  } catch (error) {
    logger.error('Create rating application error:', error)
    throw error
  }
}

export const updateRatingApplication = async (applicationId: string, data: any) => {
  try {
    const result = await pool.query(
      `UPDATE rating_applications 
       SET status = $1, rating_score = $2, rating = $3, tx_hash = $4, zk_proof = $5, processed_date = NOW()
       WHERE id = $6
       RETURNING *`,
      [data.status, data.ratingScore, data.rating, data.txHash, data.zkProof, applicationId]
    )
    return result.rows[0]
  } catch (error) {
    logger.error('Update rating application error:', error)
    throw error
  }
}

export const getAuthorizationRecords = async (enterpriseId: string) => {
  try {
    const result = await pool.query(
      'SELECT * FROM authorizations WHERE enterprise_id = $1 ORDER BY created_date DESC',
      [enterpriseId]
    )
    return result.rows
  } catch (error) {
    logger.error('Get authorization records error:', error)
    throw error
  }
}

export const createAuthorization = async (data: any) => {
  try {
    const result = await pool.query(
      `INSERT INTO authorizations (enterprise_id, data_source_id, data_type, status, expiry_date, tx_hash, created_date)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [data.enterpriseId, data.dataSourceId, data.dataType, 'pending', data.expiryDate, data.txHash]
    )
    return result.rows[0]
  } catch (error) {
    logger.error('Create authorization error:', error)
    throw error
  }
}
