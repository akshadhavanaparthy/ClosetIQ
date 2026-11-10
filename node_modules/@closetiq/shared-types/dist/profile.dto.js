"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileSchema = exports.BodyShapeSchema = exports.GenderPreferenceSchema = void 0;
const zod_1 = require("zod");
const color_dto_js_1 = require("./color.dto.js");
exports.GenderPreferenceSchema = zod_1.z.enum(['WOMENSWEAR', 'MENSWEAR', 'ANDROGYNOUS']);
exports.BodyShapeSchema = zod_1.z.enum([
    'HOURGLASS',
    'RECTANGLE',
    'PEAR',
    'INVERTED_TRIANGLE',
    'APPLE',
    'UNSPECIFIED'
]);
exports.UpdateProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1).max(100).optional(),
    genderPreference: exports.GenderPreferenceSchema.optional(),
    heightCm: zod_1.z.number().min(50).max(250).optional(),
    bustChestCm: zod_1.z.number().min(30).max(200).optional(),
    waistCm: zod_1.z.number().min(30).max(200).optional(),
    hipCm: zod_1.z.number().min(30).max(200).optional(),
    budgetTier: zod_1.z.number().int().min(1).max(3).optional(),
    bodyShapeConfirmed: exports.BodyShapeSchema.optional(),
    undertoneConfirmed: color_dto_js_1.UndertoneSchema.optional(),
    seasonalPalette: color_dto_js_1.SeasonalPaletteSchema.optional(),
    styleKeywords: zod_1.z.array(zod_1.z.string()).optional(),
    avoidColors: zod_1.z.array(zod_1.z.string()).optional(),
    preferredBrands: zod_1.z.array(zod_1.z.string()).optional(),
    preferredCategories: zod_1.z.array(zod_1.z.string()).optional(),
    preferredOccasions: zod_1.z.array(zod_1.z.string()).optional(),
    sizeTop: zod_1.z.string().optional(),
    sizeBottom: zod_1.z.string().optional(),
    sizeShoes: zod_1.z.string().optional(),
});
