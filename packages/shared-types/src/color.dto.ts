import { z } from 'zod';

export interface CIELABColor {
  L: number; // 0 to 100
  a: number; // -128 to 127 (Green to Red)
  b: number; // -128 to 127 (Blue to Yellow)
}

export interface HSLColor {
  h: number; // 0 to 360
  s: number; // 0 to 100
  l: number; // 0 to 100
}

export const HarmonyTypeSchema = z.enum([
  'MONOCHROMATIC',
  'COMPLEMENTARY',
  'ANALOGOUS',
  'TRIADIC',
  'SPLIT_COMPLEMENTARY',
  'NEUTRAL_ACCENT',
  'DISCORDANT'
]);

export type HarmonyType = z.infer<typeof HarmonyTypeSchema>;

export const SeasonalPaletteSchema = z.enum([
  'TRUE_SPRING',
  'LIGHT_SPRING',
  'BRIGHT_SPRING',
  'TRUE_SUMMER',
  'LIGHT_SUMMER',
  'SOFT_SUMMER',
  'TRUE_AUTUMN',
  'SOFT_AUTUMN',
  'DEEP_AUTUMN',
  'TRUE_WINTER',
  'BRIGHT_WINTER',
  'DEEP_WINTER',
  'UNSPECIFIED'
]);

export type SeasonalPalette = z.infer<typeof SeasonalPaletteSchema>;

export const UndertoneSchema = z.enum([
  'COOL',
  'WARM',
  'NEUTRAL',
  'OLIVE',
  'UNSPECIFIED'
]);

export type Undertone = z.infer<typeof UndertoneSchema>;
