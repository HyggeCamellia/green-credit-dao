export interface JwtPayload {
    userId: string;
    role: string;
    username: string;
}
/**
 * 生成JWT Token
 */
export declare const generateToken: (payload: JwtPayload) => string;
/**
 * 验证JWT Token
 */
export declare const verifyToken: (token: string) => JwtPayload;
/**
 * 从请求头获取Token
 */
export declare const getTokenFromHeader: (authHeader: string | undefined) => string | null;
//# sourceMappingURL=jwt.d.ts.map