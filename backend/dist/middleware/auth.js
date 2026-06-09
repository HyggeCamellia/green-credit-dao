"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const jwt_1 = require("@/utils/jwt");
const response_1 = require("@/utils/response");
/**
 * JWT认证中间件
 */
const authMiddleware = (req, res, next) => {
    try {
        const token = (0, jwt_1.getTokenFromHeader)(req.headers.authorization);
        if (!token) {
            res.status(401).json((0, response_1.unauthorizedResponse)('Missing token'));
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json((0, response_1.unauthorizedResponse)(error.message));
    }
};
exports.authMiddleware = authMiddleware;
/**
 * 角色权限检查中间件
 */
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                code: 403,
                message: 'Forbidden: Insufficient permissions',
            });
            return;
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
//# sourceMappingURL=auth.js.map