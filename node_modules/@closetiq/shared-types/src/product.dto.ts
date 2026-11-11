import { z } from 'zod';
import { ClothingCategorySchema, FormalitySchema } from './wardrobe.dto.js';

export const CATALOG_VERIFICATION_MAX_AGE_HOURS = 24;

export const ProductDataSourceSchema = z.enum([
  'ADMIN_MANUAL',
  'OFFICIAL_API',
  'AFFILIATE_FEED',
  'MERCHANT_FEED',
]);
export type ProductDataSource = z.infer<typeof ProductDataSourceSchema>;

export const ProductVerificationStatusSchema = z.enum([
  'UNVERIFIED',
  'MANUALLY_VERIFIED',
  'LIVE_VERIFIED',
]);
export type ProductVerificationStatus = z.infer<typeof ProductVerificationStatusSchema>;

export const MerchantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  homepageUrl: z.string().url(),
  commissionRate: z.number().optional().nullable(),
  isActive: z.boolean(),
});

export type MerchantDto = z.infer<typeof MerchantSchema>;

const SecureUrlSchema = z.string().url().refine((value) => new URL(value).protocol === 'https:', {
  message: 'A secure HTTPS URL is required',
});

export const CreateMerchantSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  homepageUrl: SecureUrlSchema,
});
export type CreateMerchantDto = z.infer<typeof CreateMerchantSchema>;

const CatalogProductFieldsSchema = z.object({
  merchantId: z.string().uuid(),
  externalId: z.string().trim().min(1).max(150),
  title: z.string().trim().min(1).max(200),
  brand: z.string().trim().min(1).max(100),
  description: z.string().trim().max(4000).optional().nullable(),
  category: ClothingCategorySchema,
  displayCategory: z.string().trim().min(1).max(80).optional(),
  subCategory: z.string().trim().min(1).max(100),
  styleCategory: z.string().trim().max(80).optional().nullable(),
  primaryColorHex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
  primaryColorName: z.string().trim().min(1).max(60),
  pattern: z.string().trim().min(1).max(80).default('Solid'),
  formalityLevel: FormalitySchema.default('SMART_CASUAL'),
  seasons: z.array(z.string().trim().min(1).max(30)).default([]),
  price: z.number().finite().positive(),
  currency: z.literal('INR').default('INR'),
  retailPrice: z.number().finite().positive().optional().nullable(),
  productUrl: SecureUrlSchema,
  imageUrls: z.array(SecureUrlSchema).max(8).default([]),
  imageAttributionUrl: SecureUrlSchema.optional().nullable(),
  imagePermissionConfirmed: z.boolean().default(false),
  availableSizes: z.array(z.string().trim().min(1).max(30)).default([]),
});
const validateProductImages = (
  product: { imageUrls?: string[]; imagePermissionConfirmed?: boolean; imageAttributionUrl?: string | null },
  context: z.RefinementCtx,
) => {
  if ((product.imageUrls?.length ?? 0) > 0 &&
      (!product.imagePermissionConfirmed || !product.imageAttributionUrl)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Product images require confirmed usage permission and an attribution/source URL.',
      path: ['imageUrls'],
    });
  }
};

export const CreateCatalogProductSchema = CatalogProductFieldsSchema.superRefine(validateProductImages);
export type CreateCatalogProductDto = z.infer<typeof CreateCatalogProductSchema>;

export const UpdateCatalogProductSchema = CatalogProductFieldsSchema
  .partial()
  .omit({ merchantId: true })
  .superRefine(validateProductImages);
export type UpdateCatalogProductDto = z.infer<typeof UpdateCatalogProductSchema>;

export const VerifyCatalogProductSchema = z.object({
  inStock: z.boolean(),
  attestAccuracy: z.literal(true),
});
export type VerifyCatalogProductDto = z.infer<typeof VerifyCatalogProductSchema>;

export const ProductSortBySchema = z.enum(['recommended', 'price_asc', 'price_desc', 'newest']);
export type ProductSortBy = z.infer<typeof ProductSortBySchema>;

export const ProductQuerySchema = z.object({
  category: ClothingCategorySchema.optional(),
  displayCategory: z.string().trim().max(80).optional(),
  brand: z.string().optional(),
  brands: z.string().optional(),
  styleCategory: z.string().optional(),
  formalityLevel: FormalitySchema.optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  search: z.string().optional(),
  sortBy: ProductSortBySchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ProductQueryDto = z.infer<typeof ProductQuerySchema>;

export interface ProductDto {
  id: string;
  merchantId: string;
  merchantName?: string;
  externalId: string;
  title: string;
  brand: string;
  description: string | null;
  category: z.infer<typeof ClothingCategorySchema>;
  subCategory: string;
  displayCategory?: string | null;
  styleCategory?: string | null;
  primaryColorHex: string;
  primaryColorName: string;
  pattern: string;
  formalityLevel: z.infer<typeof FormalitySchema>;
  seasons: string[];
  price: number;
  currency: string;
  retailPrice: number | null;
  inStock: boolean;
  productUrl: string;
  affiliateUrl: string | null;
  imageUrls: string[];
  imageAttributionUrl?: string | null;
  imagePermissionConfirmed?: boolean;
  availableSizes: string[];
  dataSource: ProductDataSource;
  verificationStatus: ProductVerificationStatus;
  verifiedAt: string | null;
  sourceReference?: string | null;
  occasionTags?: string[];
  lastPriceVerified?: string | null;
  createdAt: string;
  updatedAt: string;
}
