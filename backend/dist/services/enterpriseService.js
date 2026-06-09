"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthorization = exports.getAuthorizationRecords = exports.updateRatingApplication = exports.createRatingApplication = exports.getRatingApplication = exports.createEnterprise = exports.getEnterprise = void 0;
const database_1 = __importDefault(require("@/config/database"));
const logger_1 = __importDefault(require("@/config/logger"));
/**
 * 获取企业信息
 */
const getEnterprise = async (enterpriseId) => {
    try {
        const result = await database_1.default.query('SELECT * FROM enterprises WHERE id = $1', [enterpriseId]);
        return result.rows[0] || null;
    }
    catch (error) {
        logger_1.default.error('Get enterprise error:', error);
        throw error;
    }
};
exports.getEnterprise = getEnterprise;
/**
 * 创建企业
 */
const createEnterprise = async (data) => {
    try {
        const result = await database_1.default.query(`INSERT INTO enterprises (name, business_license, industry_type, registered_address, legal_representative, wallet_address, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`, [data.name, data.businessLicense, data.industryType, data.registeredAddress, data.legalRepresentative, data.walletAddress]);
        return result.rows[0];
    }
    catch (error) {
        logger_1.default.error('Create enterprise error:', error);
        throw error;
    }
};
exports.createEnterprise = createEnterprise;
/**
 * 获取评级申请
 */
const getRatingApplication = async (applicationId) => {
    try {
        const result = await database_1.default.query('SELECT * FROM rating_applications WHERE id = $1', [applicationId]);
        return result.rows[0] || null;
    }
    catch (error) {
        logger_1.default.error('Get rating application error:', error);
        throw error;
    }
};
exports.getRatingApplication = getRatingApplication;
/**
 * 创建评级申请
 */
const createRatingApplication = async (data) => {
    try {
        const result = await database_1.default.query(`INSERT INTO rating_applications (enterprise_id, bank_id, status, submitted_date)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`, [data.enterpriseId, data.bankId, 'pending']);
        return result.rows[0];
    }
    catch (error) {
        logger_1.default.error('Create rating application error:', error);
        throw error;
    }
};
exports.createRatingApplication = createRatingApplication;
/**
 * 更新评级申请
 */
const updateRatingApplication = async (applicationId, data) => {
    try {
        const result = await database_1.default.query(`UPDATE rating_applications 
       SET status = $1, rating_score = $2, rating = $3, tx_hash = $4, zk_proof = $5, processed_date = NOW()
       WHERE id = $6
       RETURNING *`, [data.status, data.ratingScore, data.rating, data.txHash, data.zkProof, applicationId]);
        return result.rows[0];
    }
    catch (error) {
        logger_1.default.error('Update rating application error:', error);
        throw error;
    }
};
exports.updateRatingApplication = updateRatingApplication;
/**
 * 获取授权记录
 */
const getAuthorizationRecords = async (enterpriseId) => {
    try {
        const result = await database_1.default.query('SELECT * FROM authorizations WHERE enterprise_id = $1 ORDER BY created_date DESC', [enterpriseId]);
        return result.rows;
    }
    catch (error) {
        logger_1.default.error('Get authorization records error:', error);
        throw error;
    }
};
exports.getAuthorizationRecords = getAuthorizationRecords;
/**
 * 创建授权记录
 */
const createAuthorization = async (data) => {
    try {
        const result = await database_1.default.query(`INSERT INTO authorizations (enterprise_id, data_source_id, data_type, status, expiry_date, tx_hash, created_date)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`, [data.enterpriseId, data.dataSourceId, data.dataType, 'pending', data.expiryDate, data.txHash]);
        return result.rows[0];
    }
    catch (error) {
        logger_1.default.error('Create authorization error:', error);
        throw error;
    }
};
exports.createAuthorization = createAuthorization;
//# sourceMappingURL=enterpriseService.js.map