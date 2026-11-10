"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductQuerySchema = exports.ProductSortBySchema = exports.MerchantSchema = void 0;
const zod_1 = require("zod");
const wardrobe_dto_js_1 = require("./wardrobe.dto.js");
exports.MerchantSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    homepageUrl: zod_1.z.string().url(),
    commissionRate: zod_1.z.number().optional().nullable(),
    isActive: zod_1.z.boolean(),
});
exports.ProductSortBySchema = zod_1.z.enum(['recommended', 'price_asc', 'price_desc', 'newest']);
exports.ProductQuerySchema = zod_1.z.object({
    category: wardrobe_dto_js_1.ClothingCategorySchema.optional(),
    brand: zod_1.z.string().optional(),
    brands: zod_1.z.string().optional(),
    styleCategory: zod_1.z.string().optional(),
    formalityLevel: wardrobe_dto_js_1.FormalitySchema.optional(),
    priceMin: zod_1.z.coerce.number().min(0).optional(),
    priceMax: zod_1.z.coerce.number().min(0).optional(),
    color: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    sortBy: exports.ProductSortBySchema.optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
