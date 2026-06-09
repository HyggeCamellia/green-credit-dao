"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyZKProof = exports.generateZKProof = exports.getRatingFromContract = exports.submitRatingToContract = exports.callBlockchainService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("@/config");
const logger_1 = __importDefault(require("@/config/logger"));
/**
 * 调用Java区块链交互服务
 */
const callBlockchainService = async (method, params) => {
    try {
        const response = await axios_1.default.post(`${config_1.config.JAVA_SERVICE_URL}/api/blockchain/${method}`, params, {
            timeout: 30000,
        });
        return response.data;
    }
    catch (error) {
        logger_1.default.error(`Blockchain service error: ${method}`, error);
        throw error;
    }
};
exports.callBlockchainService = callBlockchainService;
/**
 * 提交评级请求到智能合约
 */
const submitRatingToContract = async (enterpriseId, ratingData) => {
    return (0, exports.callBlockchainService)('submitRating', {
        enterpriseId,
        ...ratingData,
    });
};
exports.submitRatingToContract = submitRatingToContract;
/**
 * 获取链上评级结果
 */
const getRatingFromContract = async (enterpriseId) => {
    return (0, exports.callBlockchainService)('getRating', { enterpriseId });
};
exports.getRatingFromContract = getRatingFromContract;
/**
 * 生成零知识证明
 */
const generateZKProof = async (data) => {
    return (0, exports.callBlockchainService)('generateZKProof', data);
};
exports.generateZKProof = generateZKProof;
/**
 * 验证零知识证明
 */
const verifyZKProof = async (proof, data) => {
    return (0, exports.callBlockchainService)('verifyZKProof', { proof, data });
};
exports.verifyZKProof = verifyZKProof;
//# sourceMappingURL=blockchain.js.map