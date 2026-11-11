import { prisma } from '@closetiq/database';
import { NotFoundError } from '../utils/errors.js';
import { isCatalogVerificationCurrent } from './catalog/productVerification.js';

function parseSecureUrl(value: string): URL {
  try {
    const url = new URL(value);
    if (url.protocol === 'https:') return url;
  } catch {
    throw new NotFoundError('Product link is not a verified merchant destination.');
  }
  throw new NotFoundError('Product link is not a verified merchant destination.');
}

export class MerchantService {
  async handleRedirect(productId: string, userId?: string, outfitId?: string, ipAddress?: string): Promise<string> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { merchant: true },
    });

    if (
      !product ||
      !product.inStock ||
      !isCatalogVerificationCurrent(product.verifiedAt) ||
      !product.merchant.isActive ||
      !['MANUALLY_VERIFIED', 'LIVE_VERIFIED'].includes(product.verificationStatus)
    ) {
      throw new NotFoundError('Product not found for redirection');
    }
    const productUrl = parseSecureUrl(product.productUrl);
    const merchantUrl = parseSecureUrl(product.merchant.homepageUrl);
    const merchantHost = merchantUrl.hostname.toLowerCase();
    if (
      (productUrl.hostname.toLowerCase() !== merchantHost &&
        !productUrl.hostname.toLowerCase().endsWith(`.${merchantHost}`))
    ) {
      throw new NotFoundError('Product link is not a verified merchant destination.');
    }

    // Record outbound click event in AuditLog
    await prisma.auditLog.create({
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

export const merchantService = new MerchantService();
