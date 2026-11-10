import { z } from 'zod';
import { ClothingCategorySchema, FormalitySchema } from './wardrobe.dto.js';

export const MerchantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  homepageUrl: z.string().url(),
  commissionRate: z.number().optional().nullable(),
  isActive: z.boolean(),
});

export type MerchantDto = z.infer<typeof MerchantSchema>;

export const ProductSortBySchema = z.enum(['recommended', 'price_asc', 'price_desc', 'newest']);
export type ProductSortBy = z.infer<typeof ProductSortBySchema>;

export const ProductQuerySchema = z.object({
  category: ClothingCategorySchema.optional(),
  brand: z.string().optional(),
  brands: z.string().optional(),
  styleCategory: z.string().optional(),
  formalityLevel: FormalitySchema.optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  color: z.string().optional(),
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
  occasionTags?: string[];
  availableSizes?: string[];
  lastPriceVerified?: string | null;
  createdAt: string;
  updatedAt: string;
}
