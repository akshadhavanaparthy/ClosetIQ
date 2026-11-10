"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationController = exports.RecommendationController = void 0;
const completeMyOutfit_js_1 = require("../services/recommendation/completeMyOutfit.js");
const database_1 = require("@closetiq/database");
const errors_js_1 = require("../utils/errors.js");
class RecommendationController {
    async completeMyOutfit(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const outfits = await (0, completeMyOutfit_js_1.executeCompleteMyOutfit)({
            userId: req.user.userId,
            seedItemId: req.body.seedItemId,
            occasion: req.body.occasion,
            includeShoppingCatalog: req.body.includeShoppingCatalog ?? true,
            maxBudget: req.body.maxBudget,
        });
        res.json({
            success: true,
            data: outfits,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async daily(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        // Fetch user's first active wardrobe item to use as seed, or seed from top
        const seed = await database_1.prisma.wardrobeItem.findFirst({
            where: { userId: req.user.userId, isArchived: false },
        });
        if (!seed) {
            res.json({
                success: true,
                data: [],
                meta: {
                    message: 'Please add items to your wardrobe to receive daily curated styling looks.',
                    timestamp: new Date().toISOString(),
                },
            });
            return;
        }
        const outfits = await (0, completeMyOutfit_js_1.executeCompleteMyOutfit)({
            userId: req.user.userId,
            seedItemId: seed.id,
            occasion: req.body.occasion || 'Smart Casual Daily',
            includeShoppingCatalog: true,
        });
        res.json({
            success: true,
            data: outfits,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async feedback(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const { outfitId, rating, feedbackTags, feedbackText } = req.body;
        // Check if outfit exists or log in RecommendationLog
        const existingOutfit = await database_1.prisma.outfit.findUnique({
            where: { id: outfitId },
        });
        if (existingOutfit) {
            await database_1.prisma.recommendationLog.create({
                data: {
                    userId: req.user.userId,
                    outfitId,
                    userRating: rating,
                    feedbackTags: feedbackTags || [],
                    feedbackText: feedbackText || null,
                    context: {},
                },
            });
        }
        res.json({
            success: true,
            data: { message: 'Feedback recorded successfully' },
            meta: { timestamp: new Date().toISOString() },
        });
    }
}
exports.RecommendationController = RecommendationController;
exports.recommendationController = new RecommendationController();
