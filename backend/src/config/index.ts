import dotenv from 'dotenv'

dotenv.config()

export const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  API_PREFIX: process.env.API_PREFIX || '/api',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_NAME: process.env.DB_NAME || 'green_credit_dao',

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

  // Blockchain (FISCO BCOS)
  BC_RPC_URL: process.env.BC_RPC_URL || 'http://localhost:8545',
  BC_CHAIN_ID: process.env.BC_CHAIN_ID || '1',
  BC_GROUP_ID: process.env.BC_GROUP_ID || '1',
  BC_PRIVATE_KEY: process.env.BC_PRIVATE_KEY || '',

  // Java服务（智能合约交互层）
  JAVA_SERVICE_URL: process.env.JAVA_SERVICE_URL || 'http://localhost:8080',

  // 日志
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
}
