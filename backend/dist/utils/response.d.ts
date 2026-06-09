/**
 * API 响应封装
 */
export interface ApiResponse<T> {
    code: number;
    message: string;
    data?: T;
}
/**
 * 成功响应
 */
export declare const successResponse: <T>(data: T, message?: string) => ApiResponse<T>;
/**
 * 错误响应
 */
export declare const errorResponse: (message: string, code?: number) => ApiResponse<any>;
/**
 * 授权错误
 */
export declare const unauthorizedResponse: (message?: string) => ApiResponse<any>;
/**
 * 验证错误
 */
export declare const validationErrorResponse: (message?: string) => ApiResponse<any>;
//# sourceMappingURL=response.d.ts.map