"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = createRateLimiter;
const errors_js_1 = require("../utils/errors.js");
const rateLimitStore = new Map();
// Simple in-memory rate limiter for development and local testing
function createRateLimiter(windowMs = 60 * 1000, maxRequests = 100) {
    return (req, _res, next) => {
        const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
        const now = Date.now();
        const record = rateLimitStore.get(ip);
        if (!record || now > record.resetTime) {
            rateLimitStore.set(ip, {
                count: 1,
                resetTime: now + windowMs,
            });
            return next();
        }
        if (record.count >= maxRequests) {
            const retryAfter = Math.ceil((record.resetTime - now) / 1000);
            throw new errors_js_1.AppError(`Too many requests. Please retry in ${retryAfter} seconds.`, 429, 'RATE_LIMIT_EXCEEDED', { retryAfterSeconds: retryAfter });
        }
        record.count += 1;
        next();
    };
}
