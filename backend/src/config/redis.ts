import { createClient } from 'redis'
import { config } from './index'

const redisUrl = config.REDIS_PASSWORD
  ? `redis://:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`
  : `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`

const redisClient: ReturnType<typeof createClient> = createClient({ url: redisUrl })

redisClient.on('error', (err: any) => {
  console.error('Redis connection error:', err)
})

redisClient.on('connect', () => {
  console.log('Redis connected')
})

export default redisClient
