"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
const index_js_1 = require("../config/index.js");
class AuthController {
    async register(req, res) {
        const result = await auth_service_js_1.authService.register(req.body);
        const response = {
            success: true,
            data: result,
            meta: { timestamp: new Date().toISOString() },
        };
        res.status(201).json(response);
    }
    async login(req, res) {
        const { authResponse, rawRefreshToken } = await auth_service_js_1.authService.login(req.body);
        res.cookie('refreshToken', rawRefreshToken, {
            httpOnly: true,
            secure: index_js_1.config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/v1/auth',
            domain: index_js_1.config.cookieDomain,
        });
        const response = {
            success: true,
            data: authResponse,
            meta: { timestamp: new Date().toISOString() },
        };
        res.json(response);
    }
    async refresh(req, res) {
        const rawToken = req.cookies?.refreshToken;
        if (!rawToken) {
            res.status(401).json({
                success: false,
                error: { code: 'NO_REFRESH_TOKEN', message: 'Refresh token cookie required' },
                timestamp: new Date().toISOString(),
            });
            return;
        }
        const { accessToken, newRawRefreshToken } = await auth_service_js_1.authService.refreshToken(rawToken);
        res.cookie('refreshToken', newRawRefreshToken, {
            httpOnly: true,
            secure: index_js_1.config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/v1/auth',
            domain: index_js_1.config.cookieDomain,
        });
        res.json({
            success: true,
            data: { accessToken, expiresIn: 900 },
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async logout(req, res) {
        const rawToken = req.cookies?.refreshToken;
        await auth_service_js_1.authService.logout(rawToken);
        res.clearCookie('refreshToken', {
            path: '/api/v1/auth',
            domain: index_js_1.config.cookieDomain,
        });
        res.json({
            success: true,
            data: { message: 'Logged out successfully' },
            meta: { timestamp: new Date().toISOString() },
        });
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
