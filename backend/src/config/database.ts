import { Pool } from 'pg'
import { config } from './index'
import logger from './logger'

const pool: Pool = new Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
})

pool.on('error', (err: any) => {
  logger.error('PostgreSQL connection error:', err)
})

export default pool
