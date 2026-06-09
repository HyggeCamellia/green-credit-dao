"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUserByUsername = exports.createUser = void 0;
const database_1 = __importDefault(require("@/config/database"));
const logger_1 = __importDefault(require("@/config/logger"));
/**
 * 创建用户
 */
const createUser = async (data) => {
    try {
        const result = await database_1.default.query(`INSERT INTO users (username, password, role, company_name, email, phone, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, username, role, company_name, email, phone`, [data.username, data.password, data.role, data.companyName, data.email, data.phone]);
        return result.rows[0];
    }
    catch (error) {
        logger_1.default.error('Create user error:', error);
        throw error;
    }
};
exports.createUser = createUser;
/**
 * 通过用户名获取用户
 */
const getUserByUsername = async (username) => {
    try {
        const result = await database_1.default.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0] || null;
    }
    catch (error) {
        logger_1.default.error('Get user by username error:', error);
        throw error;
    }
};
exports.getUserByUsername = getUserByUsername;
/**
 * 通过ID获取用户
 */
const getUserById = async (id) => {
    try {
        const result = await database_1.default.query('SELECT id, username, role, company_name, email, phone FROM users WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    catch (error) {
        logger_1.default.error('Get user by id error:', error);
        throw error;
    }
};
exports.getUserById = getUserById;
//# sourceMappingURL=authService.js.map