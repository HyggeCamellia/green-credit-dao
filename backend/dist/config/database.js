"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const index_1 = require("./index");
const logger_1 = __importDefault(require("./logger"));
const pool = new pg_1.Pool({
    host: index_1.config.DB_HOST,
    port: index_1.config.DB_PORT,
    user: index_1.config.DB_USER,
    password: index_1.config.DB_PASSWORD,
    database: index_1.config.DB_NAME,
});
pool.on('error', (err) => {
    logger_1.default.error('PostgreSQL connection error:', err);
});
exports.default = pool;
//# sourceMappingURL=database.js.map