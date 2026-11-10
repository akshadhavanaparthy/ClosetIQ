"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileService = exports.ProfileService = void 0;
const database_1 = require("@closetiq/database");
const errors_js_1 = require("../utils/errors.js");
class ProfileService {
    async getProfile(userId) {
        const profile = await database_1.prisma.profile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new errors_js_1.NotFoundError('Profile not found for user');
        }
        return {
            id: profile.id,
            userId: profile.userId,
            fullName: profile.fullName,
            genderPreference: profile.genderPreference,
            heightCm: profile.heightCm,
            budgetTier: profile.budgetTier,
            bodyShapeEstimated: profile.bodyShapeEstimated,
            bodyShapeConfirmed: profile.bodyShapeConfirmed,
            undertoneEstimated: profile.undertoneEstimated,
            undertoneConfirmed: profile.undertoneConfirmed,
            seasonalPalette: profile.seasonalPalette,
            styleKeywords: profile.styleKeywords,
            avoidColors: profile.avoidColors,
            preferredBrands: profile.preferredBrands,
            sizeTop: profile.sizeTop,
            sizeBottom: profile.sizeBottom,
            sizeShoes: profile.sizeShoes,
            createdAt: profile.createdAt.toISOString(),
            updatedAt: profile.updatedAt.toISOString(),
        };
    }
    async updateProfile(userId, dto) {
        const profile = await database_1.prisma.profile.upsert({
            where: { userId },
            update: {
                ...dto,
            },
            create: {
                userId,
                ...dto,
            },
        });
        return {
            id: profile.id,
            userId: profile.userId,
            fullName: profile.fullName,
            genderPreference: profile.genderPreference,
            heightCm: profile.heightCm,
            budgetTier: profile.budgetTier,
            bodyShapeEstimated: profile.bodyShapeEstimated,
            bodyShapeConfirmed: profile.bodyShapeConfirmed,
            undertoneEstimated: profile.undertoneEstimated,
            undertoneConfirmed: profile.undertoneConfirmed,
            seasonalPalette: profile.seasonalPalette,
            styleKeywords: profile.styleKeywords,
            avoidColors: profile.avoidColors,
            preferredBrands: profile.preferredBrands,
            sizeTop: profile.sizeTop,
            sizeBottom: profile.sizeBottom,
            sizeShoes: profile.sizeShoes,
            createdAt: profile.createdAt.toISOString(),
            updatedAt: profile.updatedAt.toISOString(),
        };
    }
}
exports.ProfileService = ProfileService;
exports.profileService = new ProfileService();
