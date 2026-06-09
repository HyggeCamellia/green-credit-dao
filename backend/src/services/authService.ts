import pool from '@/config/database'
import logger from '@/config/logger'

export const createUser = async (data: any) => {
  try {
    const result = await pool.query(
      `INSERT INTO users (username, password, role, company_name, email, phone, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, username, role, company_name, email, phone`,
      [data.username, data.password, data.role, data.companyName, data.email, data.phone]
    )
    return result.rows[0]
  } catch (error) {
    logger.error('Create user error:', error)
    throw error
  }
}

export const getUserByUsername = async (username: string) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )
    return result.rows[0] || null
  } catch (error) {
    logger.error('Get user by username error:', error)
    throw error
  }
}

export const getUserById = async (id: string) => {
  try {
    const result = await pool.query(
      'SELECT id, username, role, company_name, email, phone FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  } catch (error) {
    logger.error('Get user by id error:', error)
    throw error
  }
}
