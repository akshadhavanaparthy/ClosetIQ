"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductQuerySchema = exports.ProductSortBySchema = exports.VerifyCatalogProductSchema = exports.UpdateCatalogProductSchema = exports.CreateCatalogProductSchema = exports.CreateMerchantSchema = exports.MerchantSchema = exports.ProductVerificationStatusSchema = exports.ProductDataSourceSchema = exports.CATALOG_VERIFICATION_MAX_AGE_HOURS = void 0;
const zod_1 = require("zod");
const wardrobe_dto_js_1 = require("./wardrobe.dto.js");
exports.CATALOG_VERIFICATION_MAX_AGE_HOURS = 24;
exports.ProductDataSourceSchema = zod_1.z.enum([
    'ADMIN_MANUAL',
    'OFFICIAL_API',
    'AFFILIATE_FEED',
    'MERCHANT_FEED',
]);
exports.ProductVerificationStatusSchema = zod_1.z.enum([
    'UNVERIFIED',
    'MANUALLY_VERIFIED',
    'LIVE_VERIFIED',
]);
exports.MerchantSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    homepageUrl: zod_1.z.string().url(),
    commissionRate: zod_1.z.number().optional().nullable(),
    isActive: zod_1.z.boolean(),
});
const SecureUrlSchema = zod_1.z.string().url().refine((value) => new URL(value).protocol === 'https:', {
    message: 'A secure HTTPS URL is required',
});
exports.CreateMerchantSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(100),
    slug: zod_1.z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    homepageUrl: SecureUrlSchema,
});
const CatalogProductFieldsSchema = zod_1.z.object({
    merchantId: zod_1.z.string().uuid(),
    externalId: zod_1.z.string().trim().min(1).max(150),
    title: zod_1.z.string().trim().min(1).max(200),
    brand: zod_1.z.string().trim().min(1).max(100),
    description: zod_1.z.string().trim().max(4000).optional().nullable(),
    category: wardrobe_dto_js_1.ClothingCategorySchema,
    displayCategory: zod_1.z.string().trim().min(1).max(80).optional(),
    subCategory: zod_1.z.string().trim().min(1).max(100),
    styleCategory: zod_1.z.string().trim().max(80).optional().nullable(),
    primaryColorHex: zod_1.z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
    primaryColorName: zod_1.z.string().trim().min(1).max(60),
    pattern: zod_1.z.string().trim().min(1).max(80).default('Solid'),
    formalityLevel: wardrobe_dto_js_1.FormalitySchema.default('SMART_CASUAL'),
    seasons: zod_1.z.array(zod_1.z.string().trim().min(1).max(30)).default([]),
    price: zod_1.z.number().finite().positive(),
    currency: zod_1.z.literal('INR').default('INR'),
    retailPrice: zod_1.z.number().finite().positive().optional().nullable(),
    productUrl: SecureUrlSchema,
    imageUrls: zod_1.z.array(SecureUrlSchema).max(8).default([]),
    imageAttributionUrl: SecureUrlSchema.optional().nullable(),
    imagePermissionConfirmed: zod_1.z.boolean().default(false),
    availableSizes: zod_1.z.array(zod_1.z.string().trim().min(1).max(30)).default([]),
});
const validateProductImages = (product, context) => {
    if ((product.imageUrls?.length ?? 0) > 0 &&
        (!product.imagePermissionConfirmed || !product.imageAttributionUrl)) {
        context.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Product images require confirmed usage permission and an attribution/source URL.',
            path: ['imageUrls'],
        });
    }
};
exports.CreateCatalogProductSchema = CatalogProductFieldsSchema.superRefine(validateProductImages);
exports.UpdateCatalogProductSchema = CatalogProductFieldsSchema
    .partial()
    .omit({ merchantId: true })
    .superRefine(validateProductImages);
exports.VerifyCatalogProductSchema = zod_1.z.object({
    inStock: zod_1.z.boolean(),
    attestAccuracy: zod_1.z.literal(true),
});
exports.ProductSortBySchema = zod_1.z.enum(['recommended', 'price_asc', 'price_desc', 'newest']);
exports.ProductQuerySchema = zod_1.z.object({
    category: wardrobe_dto_js_1.ClothingCategorySchema.optional(),
    displayCategory: zod_1.z.string().trim().max(80).optional(),
    brand: zod_1.z.string().optional(),
    brands: zod_1.z.string().optional(),
    styleCategory: zod_1.z.string().optional(),
    formalityLevel: wardrobe_dto_js_1.FormalitySchema.optional(),
    priceMin: zod_1.z.coerce.number().min(0).optional(),
    priceMax: zod_1.z.coerce.number().min(0).optional(),
    color: zod_1.z.string().optional(),
    size: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    sortBy: exports.ProductSortBySchema.optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
