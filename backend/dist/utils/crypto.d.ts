/**
 * 密码加密
 */
export declare const hashPassword: (password: string) => Promise<string>;
/**
 * 密码验证
 */
export declare const verifyPassword: (password: string, hash: string) => Promise<boolean>;
//# sourceMappingURL=crypto.d.ts.map