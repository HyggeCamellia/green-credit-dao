import pool from '@/config/database'
import logger from '@/config/logger'

export const createCarbonData = async (data: any) => {
  try {
    const result = await pool.query(
      `INSERT INTO carbon_data (enterprise_id, data_source_id, data_type, value, unit, encrypted_value, timestamp, status)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
       RETURNING *`,
      [data.enterpriseId, data.dataSourceId, data.dataType, data.value, data.unit, data.encryptedValue, data.status || 'pending']
    )
    return result.rows[0]
  } catch (error) {
    logger.error('Create carbon data error:', error)
    throw error
  }
}

export const getCarbonDataByEnterprise = async (enterpriseId: string, limit: number = 10) => {
  try {
    const result = await pool.query(
      `SELECT * FROM carbon_data 
       WHERE enterprise_id = $1 
       ORDER BY timestamp DESC
       LIMIT $2`,
      [enterpriseId, limit]
    )
    return result.rows
  } catch (error) {
    logger.error('Get carbon data error:', error)
    throw error
  }
}

export const updateCarbonDataStatus = async (dataId: string, status: string, encryptedValue?: string) => {
  try {
    const result = await pool.query(
      `UPDATE carbon_data 
       SET status = $1, encrypted_value = COALESCE($2, encrypted_value)
       WHERE id = $3
       RETURNING *`,
      [status, encryptedValue, dataId]
    )
    return result.rows[0]
  } catch (error) {
    logger.error('Update carbon data status error:', error)
    throw error
  }
}

export const getDataQualityStats = async (dataSourceId: string) => {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as success_count,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failure_count
       FROM carbon_data 
       WHERE data_source_id = $1 AND timestamp >= NOW() - INTERVAL '7 days'`,
      [dataSourceId]
    )
    return result.rows[0]
  } catch (error) {
    logger.error('Get data quality stats error:', error)
    throw error
  }
}
