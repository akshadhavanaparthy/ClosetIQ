"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merchantService = exports.MerchantService = void 0;
const database_1 = require("@closetiq/database");
const errors_js_1 = require("../utils/errors.js");
const productVerification_js_1 = require("./catalog/productVerification.js");
function parseSecureUrl(value) {
    try {
        const url = new URL(value);
        if (url.protocol === 'https:')
            return url;
    }
    catch {
        throw new errors_js_1.NotFoundError('Product link is not a verified merchant destination.');
    }
    throw new errors_js_1.NotFoundError('Product link is not a verified merchant destination.');
}
class MerchantService {
    async handleRedirect(productId, userId, outfitId, ipAddress) {
        const product = await database_1.prisma.product.findUnique({
            where: { id: productId },
            include: { merchant: true },
        });
        if (!product ||
            !product.inStock ||
            !(0, productVerification_js_1.isCatalogVerificationCurrent)(product.verifiedAt) ||
            !product.merchant.isActive ||
            !['MANUALLY_VERIFIED', 'LIVE_VERIFIED'].includes(product.verificationStatus)) {
            throw new errors_js_1.NotFoundError('Product not found for redirection');
        }
        const productUrl = parseSecureUrl(product.productUrl);
        const merchantUrl = parseSecureUrl(product.merchant.homepageUrl);
        const merchantHost = merchantUrl.hostname.toLowerCase();
        if ((productUrl.hostname.toLowerCase() !== merchantHost &&
            !productUrl.hostname.toLowerCase().endsWith(`.${merchantHost}`))) {
            throw new errors_js_1.NotFoundError('Product link is not a verified merchant destination.');
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
        return productUrl.toString();
    }
}
exports.MerchantService = MerchantService;
exports.merchantService = new MerchantService();
