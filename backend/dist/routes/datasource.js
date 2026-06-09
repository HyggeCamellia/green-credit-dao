"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("@/middleware/auth");
const response_1 = require("@/utils/response");
const database_1 = __importDefault(require("@/config/database"));
const logger_1 = __importDefault(require("@/config/logger"));
const dataService = __importStar(require("@/services/dataService"));
const router = (0, express_1.Router)();
/**
 * 数据上传（加密后）
 */
router.post('/upload', auth_1.authMiddleware, (0, auth_1.roleMiddleware)(['datasource']), async (req, res) => {
    try {
        const { enterpriseId, dataType, value, unit, encryptedValue } = req.body;
        const dataSourceId = req.user?.userId;
        const carbonData = await dataService.createCarbonData({
            enterpriseId,
            dataSourceId,
            dataType,
            value,
            unit,
            encryptedValue,
            status: 'verified',
        });
        res.json((0, response_1.successResponse)(carbonData, 'Data uploaded successfully'));
    }
    catch (error) {
        logger_1.default.error('Upload data error:', error);
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 获取待处理的授权请求
 */
router.get('/pending-authorizations', auth_1.authMiddleware, (0, auth_1.roleMiddleware)(['datasource']), async (req, res) => {
    try {
        const dataSourceId = req.user?.userId;
        const result = await database_1.default.query(`SELECT a.*, e.name as enterprise_name
       FROM authorizations a
       JOIN enterprises e ON a.enterprise_id = e.id
       WHERE a.data_source_id = $1 AND a.status = 'pending'
       ORDER BY a.created_date DESC`, [dataSourceId]);
        res.json((0, response_1.successResponse)(result.rows, 'Pending authorizations retrieved'));
    }
    catch (error) {
        logger_1.default.error('Get pending authorizations error:', error);
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 批准授权请求
 */
router.post('/approve-authorization/:authId', auth_1.authMiddleware, (0, auth_1.roleMiddleware)(['datasource']), async (req, res) => {
    try {
        const { authId } = req.params;
        const result = await database_1.default.query(`UPDATE authorizations 
       SET status = $1 
       WHERE id = $2 AND status = 'pending'
       RETURNING *`, ['authorized', authId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ code: 404, message: 'Authorization not found' });
        }
        res.json((0, response_1.successResponse)(result.rows[0], 'Authorization approved'));
    }
    catch (error) {
        logger_1.default.error('Approve authorization error:', error);
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 拒绝授权请求
 */
router.post('/reject-authorization/:authId', auth_1.authMiddleware, (0, auth_1.roleMiddleware)(['datasource']), async (req, res) => {
    try {
        const { authId } = req.params;
        const result = await database_1.default.query(`UPDATE authorizations 
       SET status = $1 
       WHERE id = $2
       RETURNING *`, ['revoked', authId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ code: 404, message: 'Authorization not found' });
        }
        res.json((0, response_1.successResponse)(result.rows[0], 'Authorization rejected'));
    }
    catch (error) {
        logger_1.default.error('Reject authorization error:', error);
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 数据质量监控
 */
router.get('/quality-monitor', auth_1.authMiddleware, (0, auth_1.roleMiddleware)(['datasource']), async (req, res) => {
    try {
        const dataSourceId = req.user?.userId;
        const stats = await dataService.getDataQualityStats(dataSourceId);
        const uploadHistory = await database_1.default.query(`SELECT 
        DATE(timestamp) as upload_date,
        COUNT(*) as total_records,
        SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as success_count,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failure_count
       FROM carbon_data
       WHERE data_source_id = $1 AND timestamp >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(timestamp)
       ORDER BY upload_date DESC`, [dataSourceId]);
        res.json((0, response_1.successResponse)({
            currentStats: stats,
            uploadHistory: uploadHistory.rows,
        }, 'Quality monitor data retrieved'));
    }
    catch (error) {
        logger_1.default.error('Get quality monitor error:', error);
        res.status(500).json({ code: 500, message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=datasource.js.map