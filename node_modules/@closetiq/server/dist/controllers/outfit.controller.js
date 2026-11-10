"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outfitController = exports.OutfitController = void 0;
const database_1 = require("@closetiq/database");
const scoringEngine_js_1 = require("../services/recommendation/scoringEngine.js");
const ai_factory_js_1 = require("../services/ai/ai.factory.js");
const errors_js_1 = require("../utils/errors.js");
class OutfitController {
    async list(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const outfits = await database_1.prisma.outfit.findMany({
            where: { userId: req.user.userId },
            include: {
                items: {
                    include: {
                        wardrobeItem: true,
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({
            success: true,
            data: outfits,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async create(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const { name, occasion, items, targetFormality } = req.body;
        // Fetch user profile for scoring
        const profile = await database_1.prisma.profile.findUnique({
            where: { userId: req.user.userId },
        });
        // Score the manual outfit
        const scoreResult = (0, scoringEngine_js_1.computeOutfitScore)(items, {
            targetFormality: targetFormality || database_1.Formality.CASUAL,
            userBodyShape: profile?.bodyShapeConfirmed || 'HOURGLASS',
            userPalette: profile?.seasonalPalette || 'TRUE_WINTER',
            budgetTier: profile?.budgetTier || 2,
        });
        const aiProvider = ai_factory_js_1.AIFactory.getProvider();
        const stylingAdvice = await aiProvider.generateOutfitExplanation({
            userProfile: {
                confirmedBodyShape: profile?.bodyShapeConfirmed || 'HOURGLASS',
                confirmedUndertone: profile?.undertoneConfirmed || 'COOL',
                seasonalPalette: profile?.seasonalPalette || 'TRUE_WINTER',
                styleKeywords: profile?.styleKeywords || [],
            },
            outfit: {
                occasion: occasion || 'Custom Creation',
                formality: targetFormality || 'CASUAL',
                items: items.map((i) => ({
                    category: i.category,
                    color: i.primaryColorName || 'Neutral',
                    subCategory: i.subCategory || 'Garment',
                    isOwned: !!i.wardrobeItemId,
                    name: i.name || 'Garment',
                })),
            },
            scoringBreakdown: {
                overallScore: scoreResult.overallScore,
                colorScore: scoreResult.colorScore,
                silhouetteScore: scoreResult.silhouetteScore,
                formalityScore: scoreResult.formalityScore,
                primaryColorHarmonies: scoreResult.ruleBreakdown.colorHarmony.details,
                silhouetteAdvice: scoreResult.ruleBreakdown.silhouetteBalance.critique,
            },
        });
        const outfit = await database_1.prisma.outfit.create({
            data: {
                userId: req.user.userId,
                name: name || 'Canvas Creation',
                occasion: occasion || 'Daily Elevated',
                targetFormality: targetFormality || database_1.Formality.CASUAL,
                overallScore: scoreResult.overallScore,
                colorHarmonyScore: scoreResult.colorScore,
                silhouetteScore: scoreResult.silhouetteScore,
                formalityScore: scoreResult.formalityScore,
                ruleBreakdown: scoreResult.ruleBreakdown,
                stylingAdvice: stylingAdvice.editorialSummary,
                isUserCreated: true,
                items: {
                    create: items.map((item, idx) => ({
                        slotType: item.category,
                        layerOrder: idx + 1,
                        wardrobeItemId: item.wardrobeItemId || null,
                        productId: item.productId || null,
                    })),
                },
            },
            include: {
                items: true,
            },
        });
        res.status(201).json({
            success: true,
            data: outfit,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async getById(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const outfit = await database_1.prisma.outfit.findFirst({
            where: { id, userId: req.user.userId },
            include: {
                items: {
                    include: {
                        wardrobeItem: true,
                        product: true,
                    },
                },
            },
        });
        if (!outfit)
            throw new errors_js_1.NotFoundError('Outfit not found');
        res.json({
            success: true,
            data: outfit,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    async delete(req, res) {
        if (!req.user)
            throw new errors_js_1.UnauthorizedError();
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const outfit = await database_1.prisma.outfit.findFirst({
            where: { id, userId: req.user.userId },
        });
        if (!outfit)
            throw new errors_js_1.NotFoundError('Outfit not found');
        await database_1.prisma.outfit.delete({ where: { id } });
        res.json({
            success: true,
            data: { message: 'Outfit removed successfully' },
            meta: { timestamp: new Date().toISOString() },
        });
    }
}
exports.OutfitController = OutfitController;
exports.outfitController = new OutfitController();
