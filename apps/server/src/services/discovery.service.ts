import { prisma, Prisma } from '@closetiq/database';
import { ProductQueryDto, ProductDto } from '@closetiq/shared-types';
import { NotFoundError } from '../utils/errors.js';
import { catalogVerificationCutoff } from './catalog/productVerification.js';

export class DiscoveryService {
  async searchProducts(query: ProductQueryDto): Promise<{ products: ProductDto[]; total: number }> {
    const where: Prisma.ProductWhereInput = {
      inStock: true,
      verificationStatus: { in: ['MANUALLY_VERIFIED', 'LIVE_VERIFIED'] },
      verifiedAt: { gte: catalogVerificationCutoff() },
      merchant: { isActive: true },
    };
    const textFilters: Prisma.ProductWhereInput[] = [];

    if (query.displayCategory) {
      textFilters.push({
        OR: [
          { displayCategory: { equals: query.displayCategory, mode: 'insensitive' } },
          { subCategory: { equals: query.displayCategory, mode: 'insensitive' } },
        ],
      });
    } else if (query.category) {
      where.category = query.category;
    }

    if (query.styleCategory && query.styleCategory.toLowerCase() !== 'all') {
      textFilters.push({
        OR: [
          { styleCategory: { equals: query.styleCategory, mode: 'insensitive' } },
          { subCategory: { contains: query.styleCategory, mode: 'insensitive' } },
        ],
      });
    }

    if (query.brands) {
      const brandList = query.brands.split(',').map((b) => b.trim()).filter(Boolean);
      if (brandList.length > 0) {
        where.brand = { in: brandList, mode: 'insensitive' };
      }
    } else if (query.brand) {
      where.brand = { equals: query.brand, mode: 'insensitive' };
    }

    if (query.formalityLevel) {
      where.formalityLevel = query.formalityLevel;
    }
    if (query.priceMin !== undefined || query.priceMax !== undefined) {
      where.price = {};
      if (query.priceMin !== undefined) where.price.gte = new Prisma.Decimal(query.priceMin);
      if (query.priceMax !== undefined) where.price.lte = new Prisma.Decimal(query.priceMax);
    }
    if (query.color) {
      where.primaryColorName = { contains: query.color, mode: 'insensitive' };
    }
    if (query.size) {
      where.availableSizes = { has: query.size };
    }
    if (query.search) {
      textFilters.push({
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { brand: { contains: query.search, mode: 'insensitive' } },
          { subCategory: { contains: query.search, mode: 'insensitive' } },
          { styleCategory: { contains: query.search, mode: 'insensitive' } },
          { primaryColorName: { contains: query.search, mode: 'insensitive' } },
        ],
      });
    }
    if (textFilters.length > 0) where.AND = textFilters;

    const page = query.page || 1;
    const pageSize = query.pageSize || 24;

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sortBy === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (query.sortBy === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (query.sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (query.sortBy === 'recommended') {
      orderBy = { price: 'desc' };
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { merchant: true },
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    const products: ProductDto[] = items.map((p) => ({
      id: p.id,
      merchantId: p.merchantId,
      merchantName: p.merchant.name,
      externalId: p.externalId,
      title: p.title,
      brand: p.brand,
      description: p.description,
      category: p.category,
      displayCategory: p.displayCategory,
      subCategory: p.subCategory,
      styleCategory: p.styleCategory,
      primaryColorHex: p.primaryColorHex,
      primaryColorName: p.primaryColorName,
      pattern: p.pattern,
      formalityLevel: p.formalityLevel,
      seasons: p.seasons,
      price: Number(p.price),
      currency: p.currency,
      retailPrice: p.retailPrice ? Number(p.retailPrice) : null,
      inStock: p.inStock,
      productUrl: p.productUrl,
      affiliateUrl: p.affiliateUrl,
      imageUrls: p.imagePermissionConfirmed ? p.imageUrls : [],
      availableSizes: p.availableSizes,
      imageAttributionUrl: p.imageAttributionUrl,
      imagePermissionConfirmed: p.imagePermissionConfirmed,
      dataSource: p.dataSource,
      verificationStatus: p.verificationStatus,
      verifiedAt: p.verifiedAt?.toISOString() ?? null,
      sourceReference: p.sourceReference,
      lastPriceVerified: p.lastPriceVerified ? p.lastPriceVerified.toISOString() : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return { products, total };
  }

  async getBrands(): Promise<string[]> {
    const brands = await prisma.product.findMany({
      where: {
        inStock: true,
        verificationStatus: { in: ['MANUALLY_VERIFIED', 'LIVE_VERIFIED'] },
        verifiedAt: { gte: catalogVerificationCutoff() },
        merchant: { isActive: true },
      },
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });
    return brands.map((b) => b.brand).filter(Boolean);
  }

  async getSizes(): Promise<string[]> {
    const products = await prisma.product.findMany({
      where: {
        inStock: true,
        verificationStatus: { in: ['MANUALLY_VERIFIED', 'LIVE_VERIFIED'] },
        verifiedAt: { gte: catalogVerificationCutoff() },
        merchant: { isActive: true },
      },
      select: { availableSizes: true },
    });
    return [...new Set(products.flatMap((product) => product.availableSizes))].sort();
  }

  async getProductById(id: string): Promise<ProductDto> {
    const p = await prisma.product.findUnique({
      where: { id },
      include: { merchant: true },
    });

    if (
      !p ||
      !p.inStock ||
      !p.verifiedAt ||
      p.verifiedAt < catalogVerificationCutoff() ||
      !p.merchant.isActive ||
      !['MANUALLY_VERIFIED', 'LIVE_VERIFIED'].includes(p.verificationStatus)
    ) {
      throw new NotFoundError('Product not found in catalog');
    }

    return {
      id: p.id,
      merchantId: p.merchantId,
      merchantName: p.merchant.name,
      externalId: p.externalId,
      title: p.title,
      brand: p.brand,
      description: p.description,
      category: p.category,
      displayCategory: p.displayCategory,
      subCategory: p.subCategory,
      primaryColorHex: p.primaryColorHex,
      primaryColorName: p.primaryColorName,
      pattern: p.pattern,
      formalityLevel: p.formalityLevel,
      seasons: p.seasons,
      price: Number(p.price),
      currency: p.currency,
      retailPrice: p.retailPrice ? Number(p.retailPrice) : null,
      inStock: p.inStock,
      productUrl: p.productUrl,
      affiliateUrl: p.affiliateUrl,
      imageUrls: p.imagePermissionConfirmed ? p.imageUrls : [],
      availableSizes: p.availableSizes,
      imageAttributionUrl: p.imageAttributionUrl,
      imagePermissionConfirmed: p.imagePermissionConfirmed,
      dataSource: p.dataSource,
      verificationStatus: p.verificationStatus,
      verifiedAt: p.verifiedAt?.toISOString() ?? null,
      sourceReference: p.sourceReference,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }

  async getWishlist(userId: string): Promise<ProductDto[]> {
    const wishlists = await prisma.wishlistItem.findMany({
      where: {
        userId,
        product: {
          inStock: true,
          verificationStatus: { in: ['MANUALLY_VERIFIED', 'LIVE_VERIFIED'] },
          verifiedAt: { gte: catalogVerificationCutoff() },
          merchant: { isActive: true },
        },
      },
      include: { product: { include: { merchant: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return wishlists.map((w) => ({
      id: w.product.id,
      merchantId: w.product.merchantId,
      merchantName: w.product.merchant.name,
      externalId: w.product.externalId,
      title: w.product.title,
      brand: w.product.brand,
      description: w.product.description,
      category: w.product.category,
      displayCategory: w.product.displayCategory,
      subCategory: w.product.subCategory,
      primaryColorHex: w.product.primaryColorHex,
      primaryColorName: w.product.primaryColorName,
      pattern: w.product.pattern,
      formalityLevel: w.product.formalityLevel,
      seasons: w.product.seasons,
      price: Number(w.product.price),
      currency: w.product.currency,
      retailPrice: w.product.retailPrice ? Number(w.product.retailPrice) : null,
      inStock: w.product.inStock,
      productUrl: w.product.productUrl,
      affiliateUrl: w.product.affiliateUrl,
      imageUrls: w.product.imagePermissionConfirmed ? w.product.imageUrls : [],
      availableSizes: w.product.availableSizes,
      imageAttributionUrl: w.product.imageAttributionUrl,
      imagePermissionConfirmed: w.product.imagePermissionConfirmed,
      dataSource: w.product.dataSource,
      verificationStatus: w.product.verificationStatus,
      verifiedAt: w.product.verifiedAt?.toISOString() ?? null,
      sourceReference: w.product.sourceReference,
      createdAt: w.createdAt.toISOString(),
      updatedAt: w.product.updatedAt.toISOString(),
    }));
  }

  async addToWishlist(userId: string, productId: string): Promise<void> {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        inStock: true,
        verificationStatus: { in: ['MANUALLY_VERIFIED', 'LIVE_VERIFIED'] },
        verifiedAt: { gte: catalogVerificationCutoff() },
        merchant: { isActive: true },
      },
    });
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    await prisma.wishlistItem.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      update: {},
      create: { userId, productId },
    });
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });
  }
}

export const discoveryService = new DiscoveryService();
