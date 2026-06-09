import { Router, Response } from 'express'
import { AuthRequest, authMiddleware, roleMiddleware } from '@/middleware/auth'
import { successResponse } from '@/utils/response'
import pool from '@/config/database'
import logger from '@/config/logger'

const router: Router = Router()

/**
 * 获取待处理评级申请列表（银行端）
 */
router.get('/pending-applications', authMiddleware, roleMiddleware(['bank']), async (req: AuthRequest, res: Response) => {
  try {
    const bankId = req.user?.userId
    const result = await pool.query(
      `SELECT ra.*, e.name as enterprise_name, e.rating_score, e.rating
       FROM rating_applications ra
       JOIN enterprises e ON ra.enterprise_id = e.id
       WHERE ra.bank_id = $1 AND ra.status IN ('pending', 'processing')
       ORDER BY ra.submitted_date DESC`,
      [bankId]
    )
    
    res.json(successResponse(result.rows, 'Pending applications retrieved'))
  } catch (error: any) {
    logger.error('Get pending applications error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 批准评级申请
 */
router.post('/approve-application/:applicationId', authMiddleware, roleMiddleware(['bank']), async (req: AuthRequest, res: Response) => {
  try {
    const { applicationId } = req.params
    const { ratingScore, rating, zkProof } = req.body

    const result = await pool.query(
      `UPDATE rating_applications 
       SET status = $1, rating_score = $2, rating = $3, zk_proof = $4, processed_date = NOW()
       WHERE id = $5 AND status != 'approved'
       RETURNING *`,
      ['approved', ratingScore, rating, zkProof, applicationId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ code: 404, message: 'Application not found or already processed' })
    }

    res.json(successResponse(result.rows[0], 'Application approved successfully'))
  } catch (error: any) {
    logger.error('Approve application error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 拒绝评级申请
 */
router.post('/reject-application/:applicationId', authMiddleware, roleMiddleware(['bank']), async (req: AuthRequest, res: Response) => {
  try {
    const { applicationId } = req.params
    const { reason: _reason } = req.body

    const result = await pool.query(
      `UPDATE rating_applications 
       SET status = $1, processed_date = NOW()
       WHERE id = $2
       RETURNING *`,
      ['rejected', applicationId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ code: 404, message: 'Application not found' })
    }

    res.json(successResponse(result.rows[0], 'Application rejected'))
  } catch (error: any) {
    logger.error('Reject application error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 获取企业监控数据（贷后监控）
 */
router.get('/monitor-enterprise/:enterpriseId', authMiddleware, roleMiddleware(['bank']), async (req: AuthRequest, res: Response) => {
  try {
    const { enterpriseId } = req.params

    const enterprise = await pool.query(
      'SELECT * FROM enterprises WHERE id = $1',
      [enterpriseId]
    )

    const carbonData = await pool.query(
      `SELECT * FROM carbon_data 
       WHERE enterprise_id = $1 
       ORDER BY timestamp DESC 
       LIMIT 10`,
      [enterpriseId]
    )

    const ratingHistory = await pool.query(
      `SELECT * FROM rating_applications 
       WHERE enterprise_id = $1 
       ORDER BY submitted_date DESC 
       LIMIT 5`,
      [enterpriseId]
    )

    res.json(successResponse({
      enterprise: enterprise.rows[0],
      recentCarbonData: carbonData.rows,
      ratingHistory: ratingHistory.rows,
    }, 'Enterprise monitor data retrieved'))
  } catch (error: any) {
    logger.error('Get monitor data error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

export default router
