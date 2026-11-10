import { z } from 'zod';
export interface CIELABColor {
    L: number;
    a: number;
    b: number;
}
export interface HSLColor {
    h: number;
    s: number;
    l: number;
}
export declare const HarmonyTypeSchema: z.ZodEnum<["MONOCHROMATIC", "COMPLEMENTARY", "ANALOGOUS", "TRIADIC", "SPLIT_COMPLEMENTARY", "NEUTRAL_ACCENT", "DISCORDANT"]>;
export type HarmonyType = z.infer<typeof HarmonyTypeSchema>;
export declare const SeasonalPaletteSchema: z.ZodEnum<["TRUE_SPRING", "LIGHT_SPRING", "BRIGHT_SPRING", "TRUE_SUMMER", "LIGHT_SUMMER", "SOFT_SUMMER", "TRUE_AUTUMN", "SOFT_AUTUMN", "DEEP_AUTUMN", "TRUE_WINTER", "BRIGHT_WINTER", "DEEP_WINTER", "UNSPECIFIED"]>;
export type SeasonalPalette = z.infer<typeof SeasonalPaletteSchema>;
export declare const UndertoneSchema: z.ZodEnum<["COOL", "WARM", "NEUTRAL", "OLIVE", "UNSPECIFIED"]>;
export type Undertone = z.infer<typeof UndertoneSchema>;
