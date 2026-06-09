import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: any;
}
/**
 * JWT认证中间件
 */
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
/**
 * 角色权限检查中间件
 */
export declare const roleMiddleware: (allowedRoles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map