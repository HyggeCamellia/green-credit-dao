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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("@/middleware/auth");
const response_1 = require("@/utils/response");
const enterpriseService = __importStar(require("@/services/enterpriseService"));
const blockchainService = __importStar(require("@/utils/blockchain"));
const router = (0, express_1.Router)();
/**
 * 企业数字身份注册
 */
router.post('/register', auth_1.authMiddleware, async (req, res) => {
    try {
        const { name, businessLicense, industryType, registeredAddress, legalRepresentative } = req.body;
        // 调用Java服务生成钱包
        const walletResponse = await blockchainService.callBlockchainService('generateWallet', {});
        // 创建企业记录
        const enterprise = await enterpriseService.createEnterprise({
            name,
            businessLicense,
            industryType,
            registeredAddress,
            legalRepresentative,
            walletAddress: walletResponse.address,
        });
        res.json((0, response_1.successResponse)(enterprise, 'Enterprise registered successfully'));
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 获取企业信息
 */
router.get('/:enterpriseId', auth_1.authMiddleware, async (req, res) => {
    try {
        const enterprise = await enterpriseService.getEnterprise(req.params.enterpriseId);
        if (!enterprise) {
            return res.status(404).json({ code: 404, message: 'Enterprise not found' });
        }
        res.json((0, response_1.successResponse)(enterprise));
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 提交绿色评级申请
 */
router.post('/rating/apply', auth_1.authMiddleware, async (req, res) => {
    try {
        const { enterpriseId, bankId } = req.body;
        // 创建评级申请
        const application = await enterpriseService.createRatingApplication({
            enterpriseId,
            bankId,
        });
        res.json((0, response_1.successResponse)(application, 'Rating application submitted successfully'));
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 获取企业的评级申请列表
 */
router.get('/rating/applications', auth_1.authMiddleware, async (_req, res) => {
    try {
        // TODO: 实现分页获取评级申请列表
        res.json((0, response_1.successResponse)([], 'Rating applications retrieved'));
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 授权数据提供者
 */
router.post('/authorize', auth_1.authMiddleware, async (req, res) => {
    try {
        const { enterpriseId, dataSourceId, dataType, expiryDate } = req.body;
        const authorization = await enterpriseService.createAuthorization({
            enterpriseId,
            dataSourceId,
            dataType,
            expiryDate,
            txHash: '',
        });
        res.json((0, response_1.successResponse)(authorization, 'Authorization created successfully'));
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 获取授权记录
 */
router.get('/authorizations', auth_1.authMiddleware, async (req, res) => {
    try {
        const enterpriseId = req.user?.userId;
        const authorizations = await enterpriseService.getAuthorizationRecords(enterpriseId);
        res.json((0, response_1.successResponse)(authorizations, 'Authorizations retrieved'));
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 获取绿色证书
 */
router.get('/certificate/:enterpriseId', auth_1.authMiddleware, async (req, res) => {
    try {
        // TODO: 从数据库或缓存获取证书
        res.json((0, response_1.successResponse)({
            id: 'CERT-001',
            enterpriseId: req.params.enterpriseId,
            rating: 'AAA',
            certificateHash: '0x1234567890abcdef',
        }, 'Certificate retrieved'));
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 获取企业积分
 */
router.get('/credits/:enterpriseId', auth_1.authMiddleware, async (_req, res) => {
    try {
        // TODO: 从数据库获取积分
        res.json((0, response_1.successResponse)({
            credits: 2500,
            redeemable: 1200,
        }, 'Credits retrieved'));
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=enterprise.js.map