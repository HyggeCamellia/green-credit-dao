"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenFromHeader = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@/config");
/**
 * 生成JWT Token
 */
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.config.JWT_SECRET, {
        expiresIn: config_1.config.JWT_EXPIRE,
    });
};
exports.generateToken = generateToken;
/**
 * 验证JWT Token
 */
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
exports.verifyToken = verifyToken;
/**
 * 从请求头获取Token
 */
const getTokenFromHeader = (authHeader) => {
    if (!authHeader) {
        return null;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1];
};
exports.getTokenFromHeader = getTokenFromHeader;
//# sourceMappingURL=jwt.js.map