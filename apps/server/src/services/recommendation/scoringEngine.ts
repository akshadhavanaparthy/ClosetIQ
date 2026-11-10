import { BodyShape, Formality, ScoreRuleBreakdown, SeasonalPalette } from '@closetiq/shared-types';
import { evaluateColorHarmony } from './colorHarmonies.js';
import { evaluateSilhouetteBalance, SilhouetteItem } from './silhouetteRules.js';
import { evaluateFormalityAlignment } from './formalityMatrix.js';

export interface ScoredCandidateItem {
  id: string;
  category: string;
  subCategory: string;
  primaryColorHex: string;
  primaryColorName: string;
  formalityLevel: Formality;
  fitType?: string | null;
  brand?: string | null;
  price?: number | null;
}

export interface ScoredCandidateContext {
  targetFormality?: Formality;
  userBodyShape?: BodyShape;
  userPalette?: SeasonalPalette;
  budgetTier?: number;
  maxBudget?: number;
  preferredBrands?: string[];
  avoidColors?: string[];
  styleKeywords?: string[];
}

export interface DeterministicScoreResult {
  overallScore: number;
  colorScore: number;
  silhouetteScore: number;
  formalityScore: number;
  budgetScore: number;
  preferenceScore: number;
  ruleBreakdown: ScoreRuleBreakdown;
}

export function computeOutfitScore(
  items: ScoredCandidateItem[],
  ctx: ScoredCandidateContext = {}
): DeterministicScoreResult {
  // 1. Color Harmony (30% weight)
  const hexColors = items.map((i) => i.primaryColorHex);
  const colorResult = evaluateColorHarmony(hexColors, ctx.userPalette || 'UNSPECIFIED');

  // 2. Silhouette Balance (25% weight)
  const silhouetteItems: SilhouetteItem[] = items.map((i) => ({
    category: i.category,
    subCategory: i.subCategory,
    fitType: i.fitType,
  }));
  const silhouetteResult = evaluateSilhouetteBalance(silhouetteItems, ctx.userBodyShape || 'UNSPECIFIED');

  // 3. Formality Alignment (20% weight)
  const formalityLevels = items.map((i) => i.formalityLevel);
  const formalityResult = evaluateFormalityAlignment(formalityLevels, ctx.targetFormality);

  // 4. Budget Adherence (15% weight)
  const totalCost = items.reduce((sum, item) => sum + (item.price || 0), 0);
  let budgetScore = 90;
  if (ctx.maxBudget && ctx.maxBudget > 0) {
    if (totalCost <= ctx.maxBudget) {
      budgetScore = 100;
    } else {
      const overagePercent = ((totalCost - ctx.maxBudget) / ctx.maxBudget) * 100;
      budgetScore = Math.max(20, Math.round(100 - overagePercent * 1.5));
    }
  } else {
    // Rely on tier (1: < $300, 2: $300 - $1500, 3: Luxury > $1500)
    const tier = ctx.budgetTier || 2;
    if (tier === 1 && totalCost <= 350) budgetScore = 95;
    else if (tier === 2 && totalCost <= 1600) budgetScore = 95;
    else if (tier === 3) budgetScore = 100;
    else budgetScore = 80;
  }

  // 5. Personal Preference Affinity (10% weight)
  let preferenceScore = 80;
  const brandMatches: string[] = [];
  if (ctx.preferredBrands && ctx.preferredBrands.length > 0) {
    items.forEach((item) => {
      if (item.brand && ctx.preferredBrands?.some((b) => b.toLowerCase() === item.brand?.toLowerCase())) {
        brandMatches.push(item.brand);
        preferenceScore = Math.min(100, preferenceScore + 10);
      }
    });
  }

  // Penalize avoidColors
  if (ctx.avoidColors && ctx.avoidColors.length > 0) {
    const hasAvoidColor = items.some((i) =>
      ctx.avoidColors?.some(
        (avoid) =>
          avoid.toLowerCase() === i.primaryColorHex.toLowerCase() ||
          avoid.toLowerCase() === i.primaryColorName.toLowerCase()
      )
    );
    if (hasAvoidColor) {
      preferenceScore = Math.max(30, preferenceScore - 30);
    }
  }

  // Weighted Multi-Objective Score Equation:
  // Score = 0.30 * C_color + 0.25 * S_silhouette + 0.20 * F_formality + 0.15 * B_budget + 0.10 * P_pref
  const rawWeightedScore =
    0.30 * colorResult.score +
    0.25 * silhouetteResult.score +
    0.20 * formalityResult.score +
    0.15 * budgetScore +
    0.10 * preferenceScore;

  const overallScore = Math.round(rawWeightedScore * 10) / 10;

  const ruleBreakdown: ScoreRuleBreakdown = {
    colorHarmony: {
      score: colorResult.score,
      harmonyType: colorResult.harmonyType,
      details: colorResult.details,
      paletteBonus: colorResult.paletteBonus,
    },
    silhouetteBalance: {
      score: silhouetteResult.score,
      targetShape: silhouetteResult.targetShape,
      proportions: silhouetteResult.proportions,
      critique: silhouetteResult.critique,
    },
    formalityAlignment: {
      score: formalityResult.score,
      deltaF: formalityResult.deltaF,
      critique: formalityResult.critique,
    },
    budgetAdherence: {
      score: budgetScore,
      totalCost,
      budgetTier: ctx.budgetTier || 2,
    },
    preferenceAffinity: {
      score: preferenceScore,
      matches: brandMatches,
    },
  };

  return {
    overallScore,
    colorScore: colorResult.score,
    silhouetteScore: silhouetteResult.score,
    formalityScore: formalityResult.score,
    budgetScore,
    preferenceScore,
    ruleBreakdown,
  };
}
