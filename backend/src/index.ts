import path from 'path'
import express, { Request, Response } from 'express'
import app from '@/app'
import { config } from '@/config'
import logger from '@/config/logger'
import authRoutes from '@/routes/auth'
import enterpriseRoutes from '@/routes/enterprise'
import bankRoutes from '@/routes/bank'
import regulatoryRoutes from '@/routes/regulatory'
import datasourceRoutes from '@/routes/datasource'

app.use(`${config.API_PREFIX}/auth`, authRoutes)
app.use(`${config.API_PREFIX}/enterprise`, enterpriseRoutes)
app.use(`${config.API_PREFIX}/bank`, bankRoutes)
app.use(`${config.API_PREFIX}/regulatory`, regulatoryRoutes)
app.use(`${config.API_PREFIX}/datasource`, datasourceRoutes)

// 挂载前端静态文件（生产环境）
const frontendDist = path.resolve(__dirname, '../../frontend/dist')
app.use(express.static(frontendDist))

// SPA fallback: 未匹配 API 的请求返回 index.html
app.use((_req: Request, res: Response) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})

const PORT = config.PORT

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
  logger.info(`Environment: ${config.NODE_ENV}`)
  logger.info(`API endpoints:`)
  logger.info(`  Auth: ${config.API_PREFIX}/auth`)
  logger.info(`  Enterprise: ${config.API_PREFIX}/enterprise`)
  logger.info(`  Bank: ${config.API_PREFIX}/bank`)
  logger.info(`  Regulatory: ${config.API_PREFIX}/regulatory`)
  logger.info(`  DataSource: ${config.API_PREFIX}/datasource`)
})
