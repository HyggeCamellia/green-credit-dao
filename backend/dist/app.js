"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const logger_1 = __importDefault(require("@/config/logger"));
const app = (0, express_1.default)();
// 中间件
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
// 日志
app.use((req, _res, next) => {
    logger_1.default.info(`${req.method} ${req.path}`);
    next();
});
// 健康检查
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// 错误处理
app.use((err, _req, res, _next) => {
    logger_1.default.error('Error:', err);
    res.status(err.status || 500).json({
        code: err.status || 500,
        message: err.message || 'Internal Server Error',
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map