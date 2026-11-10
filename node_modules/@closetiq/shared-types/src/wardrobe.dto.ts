import { z } from 'zod';

export const ClothingCategorySchema = z.enum([
  'TOP',
  'BOTTOM',
  'DRESS',
  'OUTERWEAR',
  'FOOTWEAR',
  'ACCESSORY',
  'BAG'
]);
export type ClothingCategory = z.infer<typeof ClothingCategorySchema>;

export const FormalitySchema = z.enum([
  'CASUAL',
  'SMART_CASUAL',
  'BUSINESS_CASUAL',
  'BUSINESS_FORMAL',
  'BLACK_TIE'
]);
export type Formality = z.infer<typeof FormalitySchema>;

export const CreateWardrobeItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(120),
  imageKey: z.string().min(1, 'Image key is required'),
  category: ClothingCategorySchema,
  subCategory: z.string().min(1, 'Subcategory is required'),
  primaryColorHex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Valid hex code required'),
  primaryColorName: z.string().min(1),
  secondaryColorHex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional().nullable(),
  pattern: z.string().default('Solid'),
  material: z.string().optional().nullable(),
  formalityLevel: FormalitySchema.default('CASUAL'),
  seasons: z.array(z.string()).default(['SPRING', 'SUMMER', 'AUTUMN', 'WINTER']),
  fitType: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  cost: z.number().optional().nullable(),
});

export type CreateWardrobeItemDto = z.infer<typeof CreateWardrobeItemSchema>;

export const UpdateWardrobeItemSchema = CreateWardrobeItemSchema.partial();
export type UpdateWardrobeItemDto = z.infer<typeof UpdateWardrobeItemSchema>;

export const WardrobeQuerySchema = z.object({
  category: ClothingCategorySchema.optional(),
  formalityLevel: FormalitySchema.optional(),
  season: z.string().optional(),
  search: z.string().optional(),
  isArchived: z.coerce.boolean().optional().default(false),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type WardrobeQueryDto = z.infer<typeof WardrobeQuerySchema>;

export interface WardrobeItemDto {
  id: string;
  userId: string;
  name: string;
  imageKey: string;
  imageUrl?: string;
  category: ClothingCategory;
  subCategory: string;
  primaryColorHex: string;
  primaryColorName: string;
  secondaryColorHex: string | null;
  pattern: string;
  material: string | null;
  formalityLevel: Formality;
  seasons: string[];
  fitType: string | null;
  brand: string | null;
  cost: number | null;
  timesWorn: number;
  isArchived: boolean;
  detectionConfidence?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}
