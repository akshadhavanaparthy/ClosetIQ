import { z } from 'zod';
import { BodyShapeSchema } from './profile.dto.js';
import { SeasonalPaletteSchema, UndertoneSchema } from './color.dto.js';

export const ProcessBodyAnalysisSchema = z.object({
  imageKey: z.string().min(1),
});

export const ProcessPortraitAnalysisSchema = z.object({
  imageKey: z.string().min(1),
});

export const ConfirmAnalysisSchema = z.object({
  bodyShapeConfirmed: BodyShapeSchema,
  undertoneConfirmed: UndertoneSchema,
  seasonalPalette: SeasonalPaletteSchema.optional(),
});

export type ConfirmAnalysisDto = z.infer<typeof ConfirmAnalysisSchema>;

export interface BodyAnalysisResponseDto {
  id: string;
  userId: string;
  shoulderHipRatio: number | null;
  waistHipRatio: number | null;
  torsoLegRatio: number | null;
  skinLabL: number | null;
  skinLabA: number | null;
  skinLabB: number | null;
  itaAngle: number | null;
  detectedBodyShape: z.infer<typeof BodyShapeSchema>;
  detectedUndertone: z.infer<typeof UndertoneSchema>;
  detectedPalette: z.infer<typeof SeasonalPaletteSchema>;
  confidenceScore: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  errorMessage?: string | null;
  createdAt: string;
}
