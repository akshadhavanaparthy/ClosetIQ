import { Formality } from '@closetiq/shared-types';

export const FORMALITY_NUMERIC: Record<Formality, number> = {
  CASUAL: 1,
  SMART_CASUAL: 2,
  BUSINESS_CASUAL: 3,
  BUSINESS_FORMAL: 4,
  BLACK_TIE: 5,
};

export interface FormalityScoreResult {
  score: number;
  deltaF: number;
  critique: string;
}

export function evaluateFormalityAlignment(
  formalityLevels: Formality[],
  targetFormality?: Formality
): FormalityScoreResult {
  if (formalityLevels.length <= 1) {
    return {
      score: 100,
      deltaF: 0,
      critique: 'Uniform formality baseline across pieces.',
    };
  }

  const numericValues = formalityLevels.map((f) => FORMALITY_NUMERIC[f] || 2);
  const minF = Math.min(...numericValues);
  const maxF = Math.max(...numericValues);
  const deltaF = maxF - minF;

  let score = 100;
  let critique = 'Impeccable formality consistency throughout the ensemble.';

  if (deltaF === 0) {
    score = 100;
    critique = 'Perfect contextual cohesion; every layer speaks the exact same dress code.';
  } else if (deltaF === 1) {
    score = 90;
    critique = 'Elevated high-low synthesis (e.g., tailored blazer over relaxed staple) creating effortless nuance.';
  } else if (deltaF === 2) {
    score = 65;
    critique = 'Noticeable formality friction between pieces. Best reserved for deliberate avant-garde styling.';
  } else {
    score = 20;
    critique = 'Severe formality clash (e.g., formal tailoring paired with athletic/grunge casuals).';
  }

  // Adjust if target formality was specified and outfit deviates substantially
  if (targetFormality) {
    const targetNumeric = FORMALITY_NUMERIC[targetFormality] || 2;
    const avgOutfitF = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
    const targetDeviation = Math.abs(avgOutfitF - targetNumeric);
    if (targetDeviation > 1.5) {
      score = Math.max(10, score - 20);
      critique += ` Deviates from intended ${targetFormality} occasion context.`;
    }
  }

  return { score, deltaF, critique };
}
