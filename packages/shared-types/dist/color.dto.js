"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndertoneSchema = exports.SeasonalPaletteSchema = exports.HarmonyTypeSchema = void 0;
const zod_1 = require("zod");
exports.HarmonyTypeSchema = zod_1.z.enum([
    'MONOCHROMATIC',
    'COMPLEMENTARY',
    'ANALOGOUS',
    'TRIADIC',
    'SPLIT_COMPLEMENTARY',
    'NEUTRAL_ACCENT',
    'DISCORDANT'
]);
exports.SeasonalPaletteSchema = zod_1.z.enum([
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
exports.UndertoneSchema = zod_1.z.enum([
    'COOL',
    'WARM',
    'NEUTRAL',
    'OLIVE',
    'UNSPECIFIED'
]);
