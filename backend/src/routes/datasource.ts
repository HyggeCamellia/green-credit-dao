import { Router, Response } from 'express'
import { AuthRequest, authMiddleware, roleMiddleware } from '@/middleware/auth'
import { successResponse } from '@/utils/response'
import pool from '@/config/database'
import logger from '@/config/logger'
import * as dataService from '@/services/dataService'

const router: Router = Router()

/**
 * 数据上传（加密后）
 */
router.post('/upload', authMiddleware, roleMiddleware(['datasource']), async (req: AuthRequest, res: Response) => {
  try {
    const { enterpriseId, dataType, value, unit, encryptedValue } = req.body
    const dataSourceId = req.user?.userId

    const carbonData = await dataService.createCarbonData({
      enterpriseId,
      dataSourceId,
      dataType,
      value,
      unit,
      encryptedValue,
      status: 'verified',
    })

    res.json(successResponse(carbonData, 'Data uploaded successfully'))
  } catch (error: any) {
    logger.error('Upload data error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 获取待处理的授权请求
 */
router.get('/pending-authorizations', authMiddleware, roleMiddleware(['datasource']), async (req: AuthRequest, res: Response) => {
  try {
    const dataSourceId = req.user?.userId

    const result = await pool.query(
      `SELECT a.*, e.name as enterprise_name
       FROM authorizations a
       JOIN enterprises e ON a.enterprise_id = e.id
       WHERE a.data_source_id = $1 AND a.status = 'pending'
       ORDER BY a.created_date DESC`,
      [dataSourceId]
    )

    res.json(successResponse(result.rows, 'Pending authorizations retrieved'))
  } catch (error: any) {
    logger.error('Get pending authorizations error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 批准授权请求
 */
router.post('/approve-authorization/:authId', authMiddleware, roleMiddleware(['datasource']), async (req: AuthRequest, res: Response) => {
  try {
    const { authId } = req.params

    const result = await pool.query(
      `UPDATE authorizations 
       SET status = $1 
       WHERE id = $2 AND status = 'pending'
       RETURNING *`,
      ['authorized', authId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ code: 404, message: 'Authorization not found' })
    }

    res.json(successResponse(result.rows[0], 'Authorization approved'))
  } catch (error: any) {
    logger.error('Approve authorization error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 拒绝授权请求
 */
router.post('/reject-authorization/:authId', authMiddleware, roleMiddleware(['datasource']), async (req: AuthRequest, res: Response) => {
  try {
    const { authId } = req.params

    const result = await pool.query(
      `UPDATE authorizations 
       SET status = $1 
       WHERE id = $2
       RETURNING *`,
      ['revoked', authId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ code: 404, message: 'Authorization not found' })
    }

    res.json(successResponse(result.rows[0], 'Authorization rejected'))
  } catch (error: any) {
    logger.error('Reject authorization error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 数据质量监控
 */
router.get('/quality-monitor', authMiddleware, roleMiddleware(['datasource']), async (req: AuthRequest, res: Response) => {
  try {
    const dataSourceId = req.user?.userId

    const stats = await dataService.getDataQualityStats(dataSourceId as string)

    const uploadHistory = await pool.query(
      `SELECT 
        DATE(timestamp) as upload_date,
        COUNT(*) as total_records,
        SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as success_count,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failure_count
       FROM carbon_data
       WHERE data_source_id = $1 AND timestamp >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(timestamp)
       ORDER BY upload_date DESC`,
      [dataSourceId]
    )

    res.json(successResponse({
      currentStats: stats,
      uploadHistory: uploadHistory.rows,
    }, 'Quality monitor data retrieved'))
  } catch (error: any) {
    logger.error('Get quality monitor error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

export default router
