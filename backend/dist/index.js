"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("@/app"));
const config_1 = require("@/config");
const logger_1 = __importDefault(require("@/config/logger"));
const auth_1 = __importDefault(require("@/routes/auth"));
const enterprise_1 = __importDefault(require("@/routes/enterprise"));
const bank_1 = __importDefault(require("@/routes/bank"));
const regulatory_1 = __importDefault(require("@/routes/regulatory"));
const datasource_1 = __importDefault(require("@/routes/datasource"));
// 注册所有路由
app_1.default.use(`${config_1.config.API_PREFIX}/auth`, auth_1.default);
app_1.default.use(`${config_1.config.API_PREFIX}/enterprise`, enterprise_1.default);
app_1.default.use(`${config_1.config.API_PREFIX}/bank`, bank_1.default);
app_1.default.use(`${config_1.config.API_PREFIX}/regulatory`, regulatory_1.default);
app_1.default.use(`${config_1.config.API_PREFIX}/datasource`, datasource_1.default);
// 404处理 - 必须在路由之后
app_1.default.use((_req, res) => {
    res.status(404).json({
        code: 404,
        message: 'Not Found',
    });
});
const PORT = config_1.config.PORT;
app_1.default.listen(PORT, () => {
    logger_1.default.info(`Server is running on port ${PORT}`);
    logger_1.default.info(`Environment: ${config_1.config.NODE_ENV}`);
    logger_1.default.info(`API endpoints:`);
    logger_1.default.info(`  Auth: ${config_1.config.API_PREFIX}/auth`);
    logger_1.default.info(`  Enterprise: ${config_1.config.API_PREFIX}/enterprise`);
    logger_1.default.info(`  Bank: ${config_1.config.API_PREFIX}/bank`);
    logger_1.default.info(`  Regulatory: ${config_1.config.API_PREFIX}/regulatory`);
    logger_1.default.info(`  DataSource: ${config_1.config.API_PREFIX}/datasource`);
});
//# sourceMappingURL=index.js.map