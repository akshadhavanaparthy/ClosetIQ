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

export const CompleteMyOutfitSchema = z.object({
  seedItemId: z.string().uuid(),
  occasion: z.string().default('Everyday Elevated'),
  includeShoppingCatalog: z.boolean().default(true),
  maxBudget: z.number().optional(),
});

export type CompleteMyOutfitDto = z.infer<typeof CompleteMyOutfitSchema>;

export const DailyRecommendationsSchema = z.object({
  occasion: z.string().optional().default('Smart Casual Daily'),
  weatherCondition: z.string().optional(),
  targetSeason: z.string().optional(),
});

export type DailyRecommendationsDto = z.infer<typeof DailyRecommendationsSchema>;

export const RecommendationFeedbackSchema = z.object({
  outfitId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  feedbackTags: z.array(z.string()).default([]),
  feedbackText: z.string().optional(),
});

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
