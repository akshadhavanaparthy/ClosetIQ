import { z } from 'zod';

export interface OutfitExplanationContext {
  userProfile: {
    confirmedBodyShape: string;
    confirmedUndertone: string;
    seasonalPalette: string;
    styleKeywords: string[];
  };
  outfit: {
    occasion: string;
    formality: string;
    items: Array<{
      category: string;
      color: string;
      subCategory: string;
      isOwned: boolean;
      brand?: string;
      name: string;
    }>;
  };
  scoringBreakdown: {
    overallScore: number;
    colorScore: number;
    silhouetteScore: number;
    formalityScore: number;
    primaryColorHarmonies: string;
    silhouetteAdvice: string;
  };
}

export const StylingAdviceSchema = z.object({
  headline: z.string(),
  editorialSummary: z.string(),
  stylingTips: z.array(z.string()),
  colorStory: z.string(),
});

export type StylingAdviceResult = z.infer<typeof StylingAdviceSchema>;

export interface IAIService {
  generateOutfitExplanation(context: OutfitExplanationContext): Promise<StylingAdviceResult>;
}
