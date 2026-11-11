"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogAdminService = exports.CatalogAdminService = void 0;
const database_1 = require("@closetiq/database");
const errors_js_1 = require("../utils/errors.js");
function toProductDto(product) {
    return {
        id: product.id,
        merchantId: product.merchantId,
        merchantName: product.merchant.name,
        externalId: product.externalId,
        title: product.title,
        brand: product.brand,
        description: product.description,
        category: product.category,
        displayCategory: product.displayCategory,
        subCategory: product.subCategory,
        styleCategory: product.styleCategory,
        primaryColorHex: product.primaryColorHex,
        primaryColorName: product.primaryColorName,
        pattern: product.pattern,
        formalityLevel: product.formalityLevel,
        seasons: product.seasons,
        price: Number(product.price),
        currency: product.currency,
        retailPrice: product.retailPrice ? Number(product.retailPrice) : null,
        inStock: product.inStock,
        productUrl: product.productUrl,
        affiliateUrl: product.affiliateUrl,
        imageUrls: product.imagePermissionConfirmed ? product.imageUrls : [],
        availableSizes: product.availableSizes,
        imageAttributionUrl: product.imageAttributionUrl,
        imagePermissionConfirmed: product.imagePermissionConfirmed,
        dataSource: product.dataSource,
        verificationStatus: product.verificationStatus,
        verifiedAt: product.verifiedAt?.toISOString() ?? null,
        sourceReference: product.sourceReference,
        lastPriceVerified: product.lastPriceVerified?.toISOString() ?? null,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    };
}
function assertMerchantProductUrl(productUrl, homepageUrl) {
    const productHost = new URL(productUrl).hostname.toLowerCase();
    const merchantHost = new URL(homepageUrl).hostname.toLowerCase();
    if (productHost !== merchantHost && !productHost.endsWith(`.${merchantHost}`)) {
        throw new errors_js_1.ValidationError('The product URL must use the merchant website domain.');
    }
}
class CatalogAdminService {
    async listMerchants() {
        return database_1.prisma.merchant.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, slug: true, homepageUrl: true, isActive: true },
        });
    }
    async createMerchant(dto) {
        const existing = await database_1.prisma.merchant.findFirst({
            where: { OR: [{ name: { equals: dto.name, mode: 'insensitive' } }, { slug: dto.slug }] },
        });
        if (existing)
            throw new errors_js_1.ConflictError('A merchant with this name or slug already exists.');
        return database_1.prisma.merchant.create({
            data: { ...dto, isActive: true },
            select: { id: true, name: true, slug: true, homepageUrl: true, isActive: true },
        });
    }
    async listProducts() {
        const products = await database_1.prisma.product.findMany({
            include: { merchant: true },
            orderBy: { updatedAt: 'desc' },
        });
        return products.map(toProductDto);
    }
    async createProduct(dto) {
        if (dto.imageUrls.length > 0 && (!dto.imagePermissionConfirmed || !dto.imageAttributionUrl)) {
            throw new errors_js_1.ValidationError('Product images require confirmed usage permission and an attribution/source URL.');
        }
        const merchant = await database_1.prisma.merchant.findUnique({ where: { id: dto.merchantId } });
        if (!merchant || !merchant.isActive)
            throw new errors_js_1.NotFoundError('Active merchant not found.');
        assertMerchantProductUrl(dto.productUrl, merchant.homepageUrl);
        const duplicate = await database_1.prisma.product.findUnique({
            where: { merchantId_externalId: { merchantId: dto.merchantId, externalId: dto.externalId } },
            select: { id: true },
        });
        if (duplicate)
            throw new errors_js_1.ConflictError('This merchant product identifier already exists.');
        const product = await database_1.prisma.product.create({
            data: {
                ...dto,
                dataSource: database_1.ProductDataSource.ADMIN_MANUAL,
                verificationStatus: database_1.ProductVerificationStatus.UNVERIFIED,
                verifiedAt: null,
                inStock: false,
                lastPriceVerified: null,
            },
            include: { merchant: true },
        });
        return toProductDto(product);
    }
    async updateProduct(id, dto) {
        const existing = await database_1.prisma.product.findUnique({
            where: { id },
            include: { merchant: true },
        });
        if (!existing)
            throw new errors_js_1.NotFoundError('Product not found.');
        if (existing.dataSource !== database_1.ProductDataSource.ADMIN_MANUAL) {
            throw new errors_js_1.ValidationError('Provider-managed products must be updated by their source integration.');
        }
        const nextImageUrls = dto.imageUrls ?? existing.imageUrls;
        const permissionConfirmed = dto.imagePermissionConfirmed ?? existing.imagePermissionConfirmed;
        const attributionUrl = dto.imageAttributionUrl ?? existing.imageAttributionUrl;
        if (nextImageUrls.length > 0 && (!permissionConfirmed || !attributionUrl)) {
            throw new errors_js_1.ValidationError('Product images require confirmed usage permission and an attribution/source URL.');
        }
        const productUrl = dto.productUrl ?? existing.productUrl;
        assertMerchantProductUrl(productUrl, existing.merchant.homepageUrl);
        const product = await database_1.prisma.product.update({
            where: { id },
            data: {
                ...dto,
                verificationStatus: database_1.ProductVerificationStatus.UNVERIFIED,
                verifiedAt: null,
                inStock: false,
                lastPriceVerified: null,
            },
            include: { merchant: true },
        });
        return toProductDto(product);
    }
    async verifyManualProduct(id, inStock) {
        const existing = await database_1.prisma.product.findUnique({ where: { id } });
        if (!existing)
            throw new errors_js_1.NotFoundError('Product not found.');
        if (existing.dataSource !== database_1.ProductDataSource.ADMIN_MANUAL) {
            throw new errors_js_1.ValidationError('Provider-managed products cannot be manually verified.');
        }
        const verifiedAt = new Date();
        const product = await database_1.prisma.product.update({
            where: { id },
            data: {
                inStock,
                verificationStatus: database_1.ProductVerificationStatus.MANUALLY_VERIFIED,
                verifiedAt,
                lastPriceVerified: verifiedAt,
            },
            include: { merchant: true },
        });
        return toProductDto(product);
    }
    async setProductUnavailable(id) {
        const existing = await database_1.prisma.product.findUnique({ where: { id } });
        if (!existing)
            throw new errors_js_1.NotFoundError('Product not found.');
        const product = await database_1.prisma.product.update({
            where: { id },
            data: { inStock: false },
            include: { merchant: true },
        });
        return toProductDto(product);
    }
    toPublicProductDto(product) {
        return toProductDto(product);
    }
}
exports.CatalogAdminService = CatalogAdminService;
exports.catalogAdminService = new CatalogAdminService();
