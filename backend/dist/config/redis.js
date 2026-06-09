"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const index_1 = require("./index");
const redisUrl = index_1.config.REDIS_PASSWORD
    ? `redis://:${index_1.config.REDIS_PASSWORD}@${index_1.config.REDIS_HOST}:${index_1.config.REDIS_PORT}`
    : `redis://${index_1.config.REDIS_HOST}:${index_1.config.REDIS_PORT}`;
const redisClient = (0, redis_1.createClient)({ url: redisUrl });
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});
redisClient.on('connect', () => {
    console.log('Redis connected');
});
exports.default = redisClient;
//# sourceMappingURL=redis.js.map