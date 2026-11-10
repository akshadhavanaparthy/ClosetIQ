"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StylingAdviceSchema = void 0;
const zod_1 = require("zod");
exports.StylingAdviceSchema = zod_1.z.object({
    headline: zod_1.z.string(),
    editorialSummary: zod_1.z.string(),
    stylingTips: zod_1.z.array(zod_1.z.string()),
    colorStory: zod_1.z.string(),
});
