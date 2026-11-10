"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationFeedbackSchema = exports.DailyRecommendationsSchema = exports.CompleteMyOutfitSchema = void 0;
const zod_1 = require("zod");
exports.CompleteMyOutfitSchema = zod_1.z.object({
    seedItemId: zod_1.z.string().uuid(),
    occasion: zod_1.z.string().default('Everyday Elevated'),
    includeShoppingCatalog: zod_1.z.boolean().default(true),
    maxBudget: zod_1.z.number().optional(),
});
exports.DailyRecommendationsSchema = zod_1.z.object({
    occasion: zod_1.z.string().optional().default('Smart Casual Daily'),
    weatherCondition: zod_1.z.string().optional(),
    targetSeason: zod_1.z.string().optional(),
});
exports.RecommendationFeedbackSchema = zod_1.z.object({
    outfitId: zod_1.z.string().uuid(),
    rating: zod_1.z.number().int().min(1).max(5),
    feedbackTags: zod_1.z.array(zod_1.z.string()).default([]),
    feedbackText: zod_1.z.string().optional(),
});
