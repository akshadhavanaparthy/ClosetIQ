"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privacyController = exports.PrivacyController = void 0;
const database_1 = require("@closetiq/database");
const errors_js_1 = require("../utils/errors.js");
class PrivacyController {
    async exportData(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const userId = req.user.userId;
        const [user, profile, wardrobeItems, analyses, outfits, wishlist] = await Promise.all([
            database_1.prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, createdAt: true } }),
            database_1.prisma.profile.findUnique({ where: { id: userId } }),
            database_1.prisma.wardrobeItem.findMany({ where: { userId } }),
            database_1.prisma.bodyAnalysis.findMany({ where: { userId } }),
            database_1.prisma.outfit.findMany({ where: { userId }, include: { items: true } }),
            database_1.prisma.wishlistItem.findMany({ where: { userId }, include: { product: true } }),
        ]);
        await database_1.prisma.auditLog.create({
            data: {
                userId,
                action: 'GDPR_DATA_EXPORTED',
            },
        });
        res.json({
            success: true,
            data: {
                user,
                profile,
                wardrobeItems,
                bodyAnalyses: analyses,
                outfits,
                wishlist,
                exportedAt: new Date().toISOString(),
            },
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async deleteAccount(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const userId = req.user.userId;
        // Soft delete user and anonymize
        await database_1.prisma.user.update({
            where: { id: userId },
            data: {
                deletedAt: new Date(),
                email: `deleted_${userId}_${Date.now()}@anonymized.closetiq.fashion`,
            },
        });
        // Revoke all refresh tokens
        await database_1.prisma.refreshToken.updateMany({
            where: { userId },
            data: { revokedAt: new Date() },
        });
        await database_1.prisma.auditLog.create({
            data: {
                userId,
                action: 'GDPR_ACCOUNT_DELETED',
            },
        });
        res.json({
            success: true,
            data: { message: 'Account and associated personal data successfully queued for permanent purge.' },
            meta: { timestamp: new Date().toISOString() },
        });
    }
}
exports.PrivacyController = PrivacyController;
exports.privacyController = new PrivacyController();
