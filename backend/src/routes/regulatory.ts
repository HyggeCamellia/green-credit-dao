import { Router, Response } from 'express'
import { AuthRequest, authMiddleware, roleMiddleware } from '@/middleware/auth'
import { successResponse } from '@/utils/response'
import pool from '@/config/database'
import logger from '@/config/logger'

const router: Router = Router()

/**
 * 穿透式审计 - 查询企业历史
 */
router.post('/audit-enterprise', authMiddleware, roleMiddleware(['regulatory']), async (req: AuthRequest, res: Response) => {
  try {
    const { enterpriseName } = req.body

    // 查询企业
    const enterprise = await pool.query(
      `SELECT * FROM enterprises 
       WHERE name ILIKE $1`,
      [`%${enterpriseName}%`]
    )

    if (enterprise.rows.length === 0) {
      return res.status(404).json({ code: 404, message: 'Enterprise not found' })
    }

    const enterpriseId = enterprise.rows[0].id

    // 查询评级历史
    const ratingHistory = await pool.query(
      `SELECT ra.*, b.company_name as bank_name
       FROM rating_applications ra
       LEFT JOIN users b ON ra.bank_id = b.id
       WHERE ra.enterprise_id = $1
       ORDER BY ra.submitted_date DESC`,
      [enterpriseId]
    )

    // 查询授权记录
    const authorizations = await pool.query(
      `SELECT a.*, ds.company_name as data_source_name
       FROM authorizations a
       LEFT JOIN users ds ON a.data_source_id = ds.id
       WHERE a.enterprise_id = $1
       ORDER BY a.created_date DESC`,
      [enterpriseId]
    )

    // 查询原始数据
    const carbonData = await pool.query(
      `SELECT id, data_type, value, unit, timestamp, status
       FROM carbon_data
       WHERE enterprise_id = $1
       ORDER BY timestamp DESC`,
      [enterpriseId]
    )

    res.json(successResponse({
      enterprise: enterprise.rows[0],
      ratingHistory: ratingHistory.rows,
      authorizations: authorizations.rows,
      carbonData: carbonData.rows,
    }, 'Audit trail retrieved'))
  } catch (error: any) {
    logger.error('Audit enterprise error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 漂绿预警 - 检测数据偏差
 */
router.get('/green-washing-alerts', authMiddleware, roleMiddleware(['regulatory']), async (_req: AuthRequest, res: Response) => {
  try {
    // TODO: 实现复杂的漂绿检测算法
    // 1. 对比企业自报数据与权威数据源数据
    // 2. 计算偏差率
    // 3. 超过阈值则生成警告

    const alerts = await pool.query(
      `SELECT DISTINCT 
        e.id, e.name as enterprise_name, 
        ra.rating as reported_rating,
        COUNT(*) as data_discrepancies
       FROM enterprises e
       JOIN rating_applications ra ON e.id = ra.enterprise_id
       JOIN carbon_data cd ON e.id = cd.enterprise_id
       WHERE ra.status = 'approved'
       GROUP BY e.id, e.name, ra.rating
       HAVING COUNT(*) > 5`
    )

    res.json(successResponse(alerts.rows, 'Green washing alerts retrieved'))
  } catch (error: any) {
    logger.error('Get green washing alerts error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 调查企业漂绿行为
 */
router.post('/investigate', authMiddleware, roleMiddleware(['regulatory']), async (req: AuthRequest, res: Response) => {
  try {
    const { enterpriseName } = req.body

    const enterprise = await pool.query(
      `SELECT e.*, ra.rating, ra.rating_score, ra.submitted_date
       FROM enterprises e
       LEFT JOIN rating_applications ra ON e.id = ra.enterprise_id AND ra.status = 'approved'
       WHERE e.name ILIKE $1`,
      [`%${enterpriseName}%`]
    )

    if (enterprise.rows.length === 0) {
      return res.status(404).json({ code: 404, message: 'Enterprise not found' })
    }

    // 查询该企业的碳数据用于对比分析
    const carbonData = await pool.query(
      `SELECT cd.*, ds.company_name as source_name
       FROM carbon_data cd
       LEFT JOIN users ds ON cd.data_source_id = ds.id
       WHERE cd.enterprise_id = $1
       ORDER BY cd.timestamp DESC`,
      [enterprise.rows[0].id]
    )

    res.json(successResponse({
      enterprise: enterprise.rows[0],
      carbonData: carbonData.rows,
    }, 'Investigation data retrieved'))
  } catch (error: any) {
    logger.error('Investigate enterprise error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 撤销企业评级
 */
router.post('/revoke-rating', authMiddleware, roleMiddleware(['regulatory']), async (req: AuthRequest, res: Response) => {
  try {
    const { enterpriseName } = req.body

    const enterprise = await pool.query(
      `SELECT id FROM enterprises WHERE name ILIKE $1`,
      [`%${enterpriseName}%`]
    )

    if (enterprise.rows.length === 0) {
      return res.status(404).json({ code: 404, message: 'Enterprise not found' })
    }

    const enterpriseId = enterprise.rows[0].id

    // 将企业的评级置为NULL
    await pool.query(
      `UPDATE enterprises SET rating = NULL, rating_score = NULL, rating_date = NULL WHERE id = $1`,
      [enterpriseId]
    )

    // 将相关的评级申请状态更新为 revoked
    await pool.query(
      `UPDATE rating_applications SET status = 'rejected' WHERE enterprise_id = $1 AND status = 'approved'`,
      [enterpriseId]
    )

    res.json(successResponse({ enterpriseId }, 'Rating revoked successfully'))
  } catch (error: any) {
    logger.error('Revoke rating error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 统计报告 - 绿色信贷投放
 */
router.get('/statistics-report', authMiddleware, roleMiddleware(['regulatory']), async (_req: AuthRequest, res: Response) => {
  try {
    const stats = await pool.query(
      `SELECT 
        COUNT(DISTINCT e.id) as total_enterprises,
        COUNT(DISTINCT ra.id) as total_ratings,
        SUM(CASE WHEN ra.status = 'approved' THEN 1 ELSE 0 END) as approved_ratings,
        AVG(ra.rating_score) as avg_rating_score
       FROM enterprises e
       LEFT JOIN rating_applications ra ON e.id = ra.enterprise_id`
    )

    const industryDistribution = await pool.query(
      `SELECT industry_type, COUNT(*) as count
       FROM enterprises
       GROUP BY industry_type`
    )

    const ratingDistribution = await pool.query(
      `SELECT rating, COUNT(*) as count
       FROM enterprises
       WHERE rating IS NOT NULL
       GROUP BY rating`
    )

    res.json(successResponse({
      summary: stats.rows[0],
      byIndustry: industryDistribution.rows,
      byRating: ratingDistribution.rows,
    }, 'Statistics report generated'))
  } catch (error: any) {
    logger.error('Get statistics report error:', error)
    res.status(500).json({ code: 500, message: error.message })
  }
})

export default router
