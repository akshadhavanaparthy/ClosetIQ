import { z } from 'zod';
import { BodyShapeSchema } from './profile.dto.js';
import { SeasonalPaletteSchema, UndertoneSchema } from './color.dto.js';
export declare const ProcessBodyAnalysisSchema: z.ZodObject<{
    imageKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    imageKey: string;
}, {
    imageKey: string;
}>;
export declare const ProcessPortraitAnalysisSchema: z.ZodObject<{
    imageKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    imageKey: string;
}, {
    imageKey: string;
}>;
export declare const ConfirmAnalysisSchema: z.ZodObject<{
    bodyShapeConfirmed: z.ZodEnum<["HOURGLASS", "RECTANGLE", "PEAR", "INVERTED_TRIANGLE", "APPLE", "UNSPECIFIED"]>;
    undertoneConfirmed: z.ZodEnum<["COOL", "WARM", "NEUTRAL", "OLIVE", "UNSPECIFIED"]>;
    seasonalPalette: z.ZodOptional<z.ZodEnum<["TRUE_SPRING", "LIGHT_SPRING", "BRIGHT_SPRING", "TRUE_SUMMER", "LIGHT_SUMMER", "SOFT_SUMMER", "TRUE_AUTUMN", "SOFT_AUTUMN", "DEEP_AUTUMN", "TRUE_WINTER", "BRIGHT_WINTER", "DEEP_WINTER", "UNSPECIFIED"]>>;
}, "strip", z.ZodTypeAny, {
    bodyShapeConfirmed: "UNSPECIFIED" | "HOURGLASS" | "RECTANGLE" | "PEAR" | "INVERTED_TRIANGLE" | "APPLE";
    undertoneConfirmed: "UNSPECIFIED" | "COOL" | "WARM" | "NEUTRAL" | "OLIVE";
    seasonalPalette?: "TRUE_SPRING" | "LIGHT_SPRING" | "BRIGHT_SPRING" | "TRUE_SUMMER" | "LIGHT_SUMMER" | "SOFT_SUMMER" | "TRUE_AUTUMN" | "SOFT_AUTUMN" | "DEEP_AUTUMN" | "TRUE_WINTER" | "BRIGHT_WINTER" | "DEEP_WINTER" | "UNSPECIFIED" | undefined;
}, {
    bodyShapeConfirmed: "UNSPECIFIED" | "HOURGLASS" | "RECTANGLE" | "PEAR" | "INVERTED_TRIANGLE" | "APPLE";
    undertoneConfirmed: "UNSPECIFIED" | "COOL" | "WARM" | "NEUTRAL" | "OLIVE";
    seasonalPalette?: "TRUE_SPRING" | "LIGHT_SPRING" | "BRIGHT_SPRING" | "TRUE_SUMMER" | "LIGHT_SUMMER" | "SOFT_SUMMER" | "TRUE_AUTUMN" | "SOFT_AUTUMN" | "DEEP_AUTUMN" | "TRUE_WINTER" | "BRIGHT_WINTER" | "DEEP_WINTER" | "UNSPECIFIED" | undefined;
}>;
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
