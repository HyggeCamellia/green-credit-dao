"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataQualityStats = exports.updateCarbonDataStatus = exports.getCarbonDataByEnterprise = exports.createCarbonData = void 0;
const database_1 = __importDefault(require("@/config/database"));
const logger_1 = __importDefault(require("@/config/logger"));
/**
 * 创建碳数据记录
 */
const createCarbonData = async (data) => {
    try {
        const result = await database_1.default.query(`INSERT INTO carbon_data (enterprise_id, data_source_id, data_type, value, unit, encrypted_value, timestamp, status)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
       RETURNING *`, [data.enterpriseId, data.dataSourceId, data.dataType, data.value, data.unit, data.encryptedValue, data.status || 'pending']);
        return result.rows[0];
    }
    catch (error) {
        logger_1.default.error('Create carbon data error:', error);
        throw error;
    }
};
exports.createCarbonData = createCarbonData;
/**
 * 获取企业的碳数据
 */
const getCarbonDataByEnterprise = async (enterpriseId, limit = 10) => {
    try {
        const result = await database_1.default.query(`SELECT * FROM carbon_data 
       WHERE enterprise_id = $1 
       ORDER BY timestamp DESC
       LIMIT $2`, [enterpriseId, limit]);
        return result.rows;
    }
    catch (error) {
        logger_1.default.error('Get carbon data error:', error);
        throw error;
    }
};
exports.getCarbonDataByEnterprise = getCarbonDataByEnterprise;
/**
 * 更新碳数据状态
 */
const updateCarbonDataStatus = async (dataId, status, encryptedValue) => {
    try {
        const result = await database_1.default.query(`UPDATE carbon_data 
       SET status = $1, encrypted_value = COALESCE($2, encrypted_value)
       WHERE id = $3
       RETURNING *`, [status, encryptedValue, dataId]);
        return result.rows[0];
    }
    catch (error) {
        logger_1.default.error('Update carbon data status error:', error);
        throw error;
    }
};
exports.updateCarbonDataStatus = updateCarbonDataStatus;
/**
 * 获取数据质量统计
 */
const getDataQualityStats = async (dataSourceId) => {
    try {
        const result = await database_1.default.query(`SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as success_count,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failure_count
       FROM carbon_data 
       WHERE data_source_id = $1 AND timestamp >= NOW() - INTERVAL '7 days'`, [dataSourceId]);
        return result.rows[0];
    }
    catch (error) {
        logger_1.default.error('Get data quality stats error:', error);
        throw error;
    }
};
exports.getDataQualityStats = getDataQualityStats;
//# sourceMappingURL=dataService.js.map