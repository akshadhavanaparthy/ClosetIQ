import { z } from 'zod';
import { ClothingCategorySchema, FormalitySchema } from './wardrobe.dto.js';
export interface ScoreRuleBreakdown {
    colorHarmony: {
        score: number;
        harmonyType: string;
        details: string;
        paletteBonus: boolean;
    };
    silhouetteBalance: {
        score: number;
        targetShape: string;
        proportions: string;
        critique: string;
    };
    formalityAlignment: {
        score: number;
        deltaF: number;
        critique: string;
    };
    budgetAdherence: {
        score: number;
        totalCost: number;
        budgetTier: number;
    };
    preferenceAffinity: {
        score: number;
        matches: string[];
    };
}
export declare const CompleteMyOutfitSchema: z.ZodObject<{
    seedItemId: z.ZodString;
    occasion: z.ZodDefault<z.ZodString>;
    includeShoppingCatalog: z.ZodDefault<z.ZodBoolean>;
    maxBudget: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    seedItemId: string;
    occasion: string;
    includeShoppingCatalog: boolean;
    maxBudget?: number | undefined;
}, {
    seedItemId: string;
    occasion?: string | undefined;
    includeShoppingCatalog?: boolean | undefined;
    maxBudget?: number | undefined;
}>;
export type CompleteMyOutfitDto = z.infer<typeof CompleteMyOutfitSchema>;
export declare const DailyRecommendationsSchema: z.ZodObject<{
    occasion: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    weatherCondition: z.ZodOptional<z.ZodString>;
    targetSeason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    occasion: string;
    weatherCondition?: string | undefined;
    targetSeason?: string | undefined;
}, {
    occasion?: string | undefined;
    weatherCondition?: string | undefined;
    targetSeason?: string | undefined;
}>;
export type DailyRecommendationsDto = z.infer<typeof DailyRecommendationsSchema>;
export declare const RecommendationFeedbackSchema: z.ZodObject<{
    outfitId: z.ZodString;
    rating: z.ZodNumber;
    feedbackTags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    feedbackText: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    outfitId: string;
    rating: number;
    feedbackTags: string[];
    feedbackText?: string | undefined;
}, {
    outfitId: string;
    rating: number;
    feedbackTags?: string[] | undefined;
    feedbackText?: string | undefined;
}>;
export type RecommendationFeedbackDto = z.infer<typeof RecommendationFeedbackSchema>;
export interface OutfitItemDto {
    id: string;
    slotType: z.infer<typeof ClothingCategorySchema>;
    layerOrder: number;
    isOwned: boolean;
    wardrobeItemId?: string | null;
    productId?: string | null;
    name: string;
    brand?: string | null;
    subCategory: string;
    primaryColorHex: string;
    primaryColorName: string;
    imageUrl: string;
    price?: number | null;
    affiliateUrl?: string | null;
}
export interface OutfitDto {
    id: string;
    name: string;
    occasion: string;
    season?: string | null;
    targetFormality: z.infer<typeof FormalitySchema>;
    overallScore: number;
    colorHarmonyScore: number;
    silhouetteScore: number;
    formalityScore: number;
    ruleBreakdown: ScoreRuleBreakdown;
    stylingAdvice: {
        headline: string;
        editorialSummary: string;
        stylingTips: string[];
        colorStory: string;
    } | null;
    items: OutfitItemDto[];
    isCurated: boolean;
    isUserCreated: boolean;
    isSaved?: boolean;
    createdAt: string;
}
