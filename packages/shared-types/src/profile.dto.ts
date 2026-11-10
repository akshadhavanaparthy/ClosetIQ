import { z } from 'zod';
import { SeasonalPaletteSchema, UndertoneSchema } from './color.dto.js';

export const GenderPreferenceSchema = z.enum(['WOMENSWEAR', 'MENSWEAR', 'ANDROGYNOUS']);
export type GenderPreference = z.infer<typeof GenderPreferenceSchema>;

export const BodyShapeSchema = z.enum([
  'HOURGLASS',
  'RECTANGLE',
  'PEAR',
  'INVERTED_TRIANGLE',
  'APPLE',
  'UNSPECIFIED'
]);
export type BodyShape = z.infer<typeof BodyShapeSchema>;

export const UpdateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  genderPreference: GenderPreferenceSchema.optional(),
  heightCm: z.number().min(50).max(250).optional(),
  bustChestCm: z.number().min(30).max(200).optional(),
  waistCm: z.number().min(30).max(200).optional(),
  hipCm: z.number().min(30).max(200).optional(),
  budgetTier: z.number().int().min(1).max(3).optional(),
  bodyShapeConfirmed: BodyShapeSchema.optional(),
  undertoneConfirmed: UndertoneSchema.optional(),
  seasonalPalette: SeasonalPaletteSchema.optional(),
  styleKeywords: z.array(z.string()).optional(),
  avoidColors: z.array(z.string()).optional(),
  preferredBrands: z.array(z.string()).optional(),
  preferredCategories: z.array(z.string()).optional(),
  preferredOccasions: z.array(z.string()).optional(),
  sizeTop: z.string().optional(),
  sizeBottom: z.string().optional(),
  sizeShoes: z.string().optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;

export interface ProfileResponseDto {
  id: string;
  userId: string;
  fullName: string | null;
  genderPreference: GenderPreference;
  heightCm: number | null;
  bustChestCm?: number | null;
  waistCm?: number | null;
  hipCm?: number | null;
  budgetTier: number;
  bodyShapeEstimated: BodyShape;
  bodyShapeConfirmed: BodyShape;
  undertoneEstimated: z.infer<typeof UndertoneSchema>;
  undertoneConfirmed: z.infer<typeof UndertoneSchema>;
  seasonalPalette: z.infer<typeof SeasonalPaletteSchema>;
  styleKeywords: string[];
  avoidColors: string[];
  preferredBrands: string[];
  preferredCategories?: string[];
  preferredOccasions?: string[];
  sizeTop: string | null;
  sizeBottom: string | null;
  sizeShoes: string | null;
  createdAt: string;
  updatedAt: string;
}
