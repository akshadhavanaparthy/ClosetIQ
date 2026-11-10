"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WardrobeQuerySchema = exports.UpdateWardrobeItemSchema = exports.CreateWardrobeItemSchema = exports.FormalitySchema = exports.ClothingCategorySchema = void 0;
const zod_1 = require("zod");
exports.ClothingCategorySchema = zod_1.z.enum([
    'TOP',
    'BOTTOM',
    'DRESS',
    'OUTERWEAR',
    'FOOTWEAR',
    'ACCESSORY',
    'BAG'
]);
exports.FormalitySchema = zod_1.z.enum([
    'CASUAL',
    'SMART_CASUAL',
    'BUSINESS_CASUAL',
    'BUSINESS_FORMAL',
    'BLACK_TIE'
]);
exports.CreateWardrobeItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Item name is required').max(120),
    imageKey: zod_1.z.string().min(1, 'Image key is required'),
    category: exports.ClothingCategorySchema,
    subCategory: zod_1.z.string().min(1, 'Subcategory is required'),
    primaryColorHex: zod_1.z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Valid hex code required'),
    primaryColorName: zod_1.z.string().min(1),
    secondaryColorHex: zod_1.z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional().nullable(),
    pattern: zod_1.z.string().default('Solid'),
    material: zod_1.z.string().optional().nullable(),
    formalityLevel: exports.FormalitySchema.default('CASUAL'),
    seasons: zod_1.z.array(zod_1.z.string()).default(['SPRING', 'SUMMER', 'AUTUMN', 'WINTER']),
    fitType: zod_1.z.string().optional().nullable(),
    brand: zod_1.z.string().optional().nullable(),
    cost: zod_1.z.number().optional().nullable(),
});
exports.UpdateWardrobeItemSchema = exports.CreateWardrobeItemSchema.partial();
exports.WardrobeQuerySchema = zod_1.z.object({
    category: exports.ClothingCategorySchema.optional(),
    formalityLevel: exports.FormalitySchema.optional(),
    season: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    isArchived: zod_1.z.coerce.boolean().optional().default(false),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
