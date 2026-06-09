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
const jwt_1 = require("@/utils/jwt");
const crypto_1 = require("@/utils/crypto");
const authService = __importStar(require("@/services/authService"));
const router = (0, express_1.Router)();
/**
 * 用户注册
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password, role, companyName, email, phone } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json((0, response_1.validationErrorResponse)('Missing required fields'));
        }
        // 检查用户是否已存在
        const existingUser = await authService.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json((0, response_1.validationErrorResponse)('Username already exists'));
        }
        // 密码加密
        const hashedPassword = await (0, crypto_1.hashPassword)(password);
        // 创建用户
        const user = await authService.createUser({
            username,
            password: hashedPassword,
            role,
            companyName,
            email,
            phone,
        });
        res.json((0, response_1.successResponse)(user, 'User registered successfully'));
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 用户登录
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json((0, response_1.validationErrorResponse)('Missing username or password'));
        }
        // 获取用户
        const user = await authService.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ code: 401, message: 'Invalid credentials' });
        }
        // 验证密码
        const isPasswordValid = await (0, crypto_1.verifyPassword)(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ code: 401, message: 'Invalid credentials' });
        }
        // 生成Token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            role: user.role,
            username: user.username,
        });
        res.json((0, response_1.successResponse)({
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                companyName: user.company_name,
                email: user.email,
                phone: user.phone,
            },
            token,
        }, 'Login successful'));
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 获取当前用户信息
 */
router.get('/user', auth_1.authMiddleware, async (req, res) => {
    try {
        const user = await authService.getUserById(req.user?.userId);
        if (!user) {
            return res.status(404).json({ code: 404, message: 'User not found' });
        }
        res.json((0, response_1.successResponse)({
            id: user.id,
            username: user.username,
            role: user.role,
            companyName: user.company_name,
            email: user.email,
            phone: user.phone,
        }));
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
/**
 * 刷新Token
 */
router.post('/refresh', auth_1.authMiddleware, async (req, res) => {
    try {
        const token = (0, jwt_1.generateToken)({
            userId: req.user?.userId,
            role: req.user?.role,
            username: req.user?.username,
        });
        res.json((0, response_1.successResponse)({ token }, 'Token refreshed successfully'));
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map