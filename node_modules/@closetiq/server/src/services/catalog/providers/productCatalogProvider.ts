import { ProductDataSource } from '@closetiq/shared-types';

export type ExternalCatalogSource = Exclude<ProductDataSource, 'ADMIN_MANUAL'>;

export interface CatalogProviderProduct {
  externalId: string;
  title: string;
  brand: string;
  description?: string | null;
  category: string;
  displayCategory?: string | null;
  subCategory: string;
  styleCategory?: string | null;
  primaryColorHex: string;
  primaryColorName: string;
  price: number;
  currency: 'INR';
  inStock: boolean;
  productUrl: string;
  imageUrls: string[];
  imageAttributionUrl?: string | null;
  imagePermissionConfirmed: boolean;
  availableSizes: string[];
  sourceReference: string;
  verifiedAt: Date;
}

export interface ProductCatalogProvider {
  readonly source: ExternalCatalogSource;
  fetchProducts(cursor?: string): Promise<{
    products: CatalogProviderProduct[];
    nextCursor: string | null;
  }>;
}
