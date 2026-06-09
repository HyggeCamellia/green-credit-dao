"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrorResponse = exports.unauthorizedResponse = exports.errorResponse = exports.successResponse = void 0;
/**
 * 成功响应
 */
const successResponse = (data, message = 'Success') => ({
    code: 0,
    message,
    data,
});
exports.successResponse = successResponse;
/**
 * 错误响应
 */
const errorResponse = (message, code = 500) => ({
    code,
    message,
});
exports.errorResponse = errorResponse;
/**
 * 授权错误
 */
const unauthorizedResponse = (message = 'Unauthorized') => ({
    code: 401,
    message,
});
exports.unauthorizedResponse = unauthorizedResponse;
/**
 * 验证错误
 */
const validationErrorResponse = (message = 'Validation Error') => ({
    code: 400,
    message,
});
exports.validationErrorResponse = validationErrorResponse;
//# sourceMappingURL=response.js.map