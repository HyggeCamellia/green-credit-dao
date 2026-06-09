import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import logger from '@/config/logger'

const app: Express = express()

// 中间件（禁用 HSTS 和 upgrade-insecure-requests，防止 HTTPS 重定向循环）
app.use(helmet({
  hsts: false,
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'", "https:", "data:"],
      upgradeInsecureRequests: null,
    },
  },
}))
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// 日志
app.use((req: Request, _res: Response, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// 健康检查
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// 错误处理
app.use((err: any, _req: Request, res: Response, _next: any) => {
  logger.error('Error:', err)
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || 'Internal Server Error',
  })
})

export default app
