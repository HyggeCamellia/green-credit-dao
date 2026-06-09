"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("@/middleware/auth");
const response_1 = require("@/utils/response");
const database_1 = __importDefault(require("@/config/database"));
const logger_1 = __importDefault(require("@/config/logger"));
const router = (0, express_1.Router)();
/**
 * 穿透式审计 - 查询企业历史
 */
router.post('/audit-enterprise', auth_1.authMiddleware, (0, auth_1.roleMiddleware)(['regulatory']), async (req, res) => {
    try {
        const { enterpriseName } = req.body;
        // 查询企业
        const enterprise = await database_1.default.query(`SELECT * FROM enterprises 
       WHERE name ILIKE $1`, [`%${enterpriseName}%`]);
        if (enterprise.rows.length === 0) {
            return res.status(404).json({ code: 404, message: 'Enterprise not found' });
        }
        const enterpriseId = enterprise.rows[0].id;
        // 查询评级历史
        const ratingHistory = await database_1.default.query(`SELECT ra.*, b.company_name as bank_name
       FROM rating_applications ra
       LEFT JOIN users b ON ra.bank_id = b.id
       WHERE ra.enterprise_id = $1
       ORDER BY ra.submitted_date DESC`, [enterpriseId]);
        // 查询授权记录
        const authorizations = await database_1.default.query(`SELECT a.*, ds.company_name as data_source_name
       FROM authorizations a
       LEFT JOIN users ds ON a.data_source_id = ds.id
       WHERE a.enterprise_id = $1
       ORDER BY a.created_date DESC`, [enterpriseId]);
        // 查询原始数据
        const carbonData = await database_1.default.query(`SELECT id, data_type, value, unit, timestamp, status
       FROM carbon_data
       WHERE enterprise_id = $1
       ORDER BY timestamp DESC`, [enterpriseId]);
        res.json((0, response_1.successResponse)({
            enterprise: enterprise.rows[0],
            ratingHistory: ratingHistory.rows,
            authorizations: authorizations.rows,
            carbonData: carbonData.rows,
        }, 'Audit trail retrieved'));
    }
    catch (error) {
        logger_1.default.error('Audit enterprise error:', error);
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 漂绿预警 - 检测数据偏差
 */
router.get('/green-washing-alerts', auth_1.authMiddleware, (0, auth_1.roleMiddleware)(['regulatory']), async (_req, res) => {
    try {
        // TODO: 实现复杂的漂绿检测算法
        // 1. 对比企业自报数据与权威数据源数据
        // 2. 计算偏差率
        // 3. 超过阈值则生成警告
        const alerts = await database_1.default.query(`SELECT DISTINCT 
        e.id, e.name as enterprise_name, 
        ra.rating as reported_rating,
        COUNT(*) as data_discrepancies
       FROM enterprises e
       JOIN rating_applications ra ON e.id = ra.enterprise_id
       JOIN carbon_data cd ON e.id = cd.enterprise_id
       WHERE ra.status = 'approved'
       GROUP BY e.id, e.name, ra.rating
       HAVING COUNT(*) > 5`);
        res.json((0, response_1.successResponse)(alerts.rows, 'Green washing alerts retrieved'));
    }
    catch (error) {
        logger_1.default.error('Get green washing alerts error:', error);
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 调查企业漂绿行为
 */
router.post('/investigate', auth_1.authMiddleware, (0, auth_1.roleMiddleware)(['regulatory']), async (req, res) => {
    try {
        const { enterpriseName } = req.body;
        const enterprise = await database_1.default.query(`SELECT e.*, ra.rating, ra.rating_score, ra.submitted_date
       FROM enterprises e
       LEFT JOIN rating_applications ra ON e.id = ra.enterprise_id AND ra.status = 'approved'
       WHERE e.name ILIKE $1`, [`%${enterpriseName}%`]);
        if (enterprise.rows.length === 0) {
            return res.status(404).json({ code: 404, message: 'Enterprise not found' });
        }
        // 查询该企业的碳数据用于对比分析
        const carbonData = await database_1.default.query(`SELECT cd.*, ds.company_name as source_name
       FROM carbon_data cd
       LEFT JOIN users ds ON cd.data_source_id = ds.id
       WHERE cd.enterprise_id = $1
       ORDER BY cd.timestamp DESC`, [enterprise.rows[0].id]);
        res.json((0, response_1.successResponse)({
            enterprise: enterprise.rows[0],
            carbonData: carbonData.rows,
        }, 'Investigation data retrieved'));
    }
    catch (error) {
        logger_1.default.error('Investigate enterprise error:', error);
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 撤销企业评级
 */
router.post('/revoke-rating', auth_1.authMiddleware, (0, auth_1.roleMiddleware)(['regulatory']), async (req, res) => {
    try {
        const { enterpriseName } = req.body;
        const enterprise = await database_1.default.query(`SELECT id FROM enterprises WHERE name ILIKE $1`, [`%${enterpriseName}%`]);
        if (enterprise.rows.length === 0) {
            return res.status(404).json({ code: 404, message: 'Enterprise not found' });
        }
        const enterpriseId = enterprise.rows[0].id;
        // 将企业的评级置为NULL
        await database_1.default.query(`UPDATE enterprises SET rating = NULL, rating_score = NULL, rating_date = NULL WHERE id = $1`, [enterpriseId]);
        // 将相关的评级申请状态更新为 revoked
        await database_1.default.query(`UPDATE rating_applications SET status = 'rejected' WHERE enterprise_id = $1 AND status = 'approved'`, [enterpriseId]);
        res.json((0, response_1.successResponse)({ enterpriseId }, 'Rating revoked successfully'));
    }
    catch (error) {
        logger_1.default.error('Revoke rating error:', error);
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 统计报告 - 绿色信贷投放
 */
router.get('/statistics-report', auth_1.authMiddleware, (0, auth_1.roleMiddleware)(['regulatory']), async (_req, res) => {
    try {
        const stats = await database_1.default.query(`SELECT 
        COUNT(DISTINCT e.id) as total_enterprises,
        COUNT(DISTINCT ra.id) as total_ratings,
        SUM(CASE WHEN ra.status = 'approved' THEN 1 ELSE 0 END) as approved_ratings,
        AVG(ra.rating_score) as avg_rating_score
       FROM enterprises e
       LEFT JOIN rating_applications ra ON e.id = ra.enterprise_id`);
        const industryDistribution = await database_1.default.query(`SELECT industry_type, COUNT(*) as count
       FROM enterprises
       GROUP BY industry_type`);
        const ratingDistribution = await database_1.default.query(`SELECT rating, COUNT(*) as count
       FROM enterprises
       WHERE rating IS NOT NULL
       GROUP BY rating`);
        res.json((0, response_1.successResponse)({
            summary: stats.rows[0],
            byIndustry: industryDistribution.rows,
            byRating: ratingDistribution.rows,
        }, 'Statistics report generated'));
    }
    catch (error) {
        logger_1.default.error('Get statistics report error:', error);
        res.status(500).json({ code: 500, message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=regulatory.js.map