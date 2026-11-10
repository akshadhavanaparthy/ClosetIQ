"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_js_1 = require("./errors.js");
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'closetiq_super_secret_access_key_2026_dev_mode';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'closetiq_super_secret_refresh_key_2026_dev_mode';
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
}
function signRefreshToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}
function verifyAccessToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_ACCESS_SECRET);
    }
    catch (err) {
        throw new errors_js_1.UnauthorizedError('Invalid or expired access token', err);
    }
}
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
    }
    catch (err) {
        throw new errors_js_1.UnauthorizedError('Invalid or expired refresh token', err);
    }
}
