"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merchantService = exports.MerchantService = void 0;
const database_1 = require("@closetiq/database");
const errors_js_1 = require("../utils/errors.js");
class MerchantService {
    async handleRedirect(productId, userId, outfitId, ipAddress) {
        const product = await database_1.prisma.product.findUnique({
            where: { id: productId },
            include: { merchant: true },
        });
        if (!product) {
            throw new errors_js_1.NotFoundError('Product not found for redirection');
        }
        // Record outbound click event in AuditLog
        await database_1.prisma.auditLog.create({
            data: {
                userId: userId || null,
                action: 'AFFILIATE_CLICK',
                ipAddress: ipAddress || null,
                details: {
                    productId: product.id,
                    merchantId: product.merchantId,
                    merchantName: product.merchant.name,
                    outfitId: outfitId || null,
                    timestamp: new Date().toISOString(),
                },
            },
        });
        // Build tracked destination URL
        let targetUrl = product.affiliateUrl || product.productUrl;
        const subParam = product.merchant.subIdParamName || 'subId1';
        const subValue = `closetiq_${userId || 'anon'}_${Date.now()}`;
        const separator = targetUrl.includes('?') ? '&' : '?';
        targetUrl = `${targetUrl}${separator}${subParam}=${encodeURIComponent(subValue)}`;
        return targetUrl;
    }
}
exports.MerchantService = MerchantService;
exports.merchantService = new MerchantService();
