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
const crypto_1 = require("crypto");
const errors_js_1 = require("./errors.js");
const index_js_1 = require("../config/index.js");
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, index_js_1.config.jwtAccessSecret, { expiresIn: '15m' });
}
function signRefreshToken(userId) {
    return jsonwebtoken_1.default.sign({ userId, jti: (0, crypto_1.randomUUID)() }, index_js_1.config.jwtRefreshSecret, { expiresIn: '7d' });
}
function verifyAccessToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, index_js_1.config.jwtAccessSecret);
    }
    catch (err) {
        throw new errors_js_1.UnauthorizedError('Invalid or expired access token', err);
    }
}
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, index_js_1.config.jwtRefreshSecret);
    }
    catch (err) {
        throw new errors_js_1.UnauthorizedError('Invalid or expired refresh token', err);
    }
}
