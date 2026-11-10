"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmAnalysisSchema = exports.ProcessPortraitAnalysisSchema = exports.ProcessBodyAnalysisSchema = void 0;
const zod_1 = require("zod");
const profile_dto_js_1 = require("./profile.dto.js");
const color_dto_js_1 = require("./color.dto.js");
exports.ProcessBodyAnalysisSchema = zod_1.z.object({
    imageKey: zod_1.z.string().min(1),
});
exports.ProcessPortraitAnalysisSchema = zod_1.z.object({
    imageKey: zod_1.z.string().min(1),
});
exports.ConfirmAnalysisSchema = zod_1.z.object({
    bodyShapeConfirmed: profile_dto_js_1.BodyShapeSchema,
    undertoneConfirmed: color_dto_js_1.UndertoneSchema,
    seasonalPalette: color_dto_js_1.SeasonalPaletteSchema.optional(),
});
