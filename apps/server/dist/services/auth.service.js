"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const database_1 = require("@closetiq/database");
const password_js_1 = require("../utils/password.js");
const jwt_js_1 = require("../utils/jwt.js");
const errors_js_1 = require("../utils/errors.js");
const crypto_1 = require("crypto");
function hashToken(token) {
    return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
}
class AuthService {
    async register(dto) {
        const existing = await database_1.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existing) {
            throw new errors_js_1.ConflictError('A user with this email address already exists');
        }
        const passwordHash = await (0, password_js_1.hashPassword)(dto.password);
        const user = await database_1.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                passwordHash,
                role: database_1.Role.USER,
                profile: {
                    create: {
                        fullName: dto.fullName || null,
                    },
                },
            },
            include: { profile: true },
        });
        const accessToken = (0, jwt_js_1.signAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        // Record audit log
        await database_1.prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'USER_REGISTERED',
                details: { email: user.email },
            },
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            tokens: {
                accessToken,
                expiresIn: 900,
            },
        };
    }
    async login(dto) {
        const user = await database_1.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (!user || user.deletedAt) {
            throw new errors_js_1.UnauthorizedError('Invalid email or password');
        }
        const isValid = await (0, password_js_1.verifyPassword)(dto.password, user.passwordHash);
        if (!isValid) {
            throw new errors_js_1.UnauthorizedError('Invalid email or password');
        }
        const accessToken = (0, jwt_js_1.signAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const rawRefreshToken = (0, jwt_js_1.signRefreshToken)(user.id);
        const tokenHash = hashToken(rawRefreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await database_1.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt,
            },
        });
        return {
            authResponse: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                },
                tokens: {
                    accessToken,
                    expiresIn: 900,
                },
            },
            rawRefreshToken,
        };
    }
    async refreshToken(rawToken) {
        const { userId } = (0, jwt_js_1.verifyRefreshToken)(rawToken);
        const tokenHash = hashToken(rawToken);
        const existingToken = await database_1.prisma.refreshToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });
        // Token reuse detection! If already revoked or not found, invalidate ALL refresh tokens for user
        if (!existingToken || existingToken.revokedAt || existingToken.expiresAt < new Date()) {
            await database_1.prisma.refreshToken.updateMany({
                where: { userId },
                data: { revokedAt: new Date() },
            });
            throw new errors_js_1.UnauthorizedError('Invalid or reused refresh token. Session terminated.');
        }
        // Revoke old token
        await database_1.prisma.refreshToken.update({
            where: { id: existingToken.id },
            data: { revokedAt: new Date() },
        });
        // Issue new token pair
        const accessToken = (0, jwt_js_1.signAccessToken)({
            userId: existingToken.user.id,
            email: existingToken.user.email,
            role: existingToken.user.role,
        });
        const newRawRefreshToken = (0, jwt_js_1.signRefreshToken)(existingToken.user.id);
        const newTokenHash = hashToken(newRawRefreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await database_1.prisma.refreshToken.create({
            data: {
                userId: existingToken.user.id,
                tokenHash: newTokenHash,
                expiresAt,
            },
        });
        return { accessToken, newRawRefreshToken };
    }
    async logout(rawToken) {
        if (rawToken) {
            const tokenHash = hashToken(rawToken);
            await database_1.prisma.refreshToken.updateMany({
                where: { tokenHash },
                data: { revokedAt: new Date() },
            });
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
