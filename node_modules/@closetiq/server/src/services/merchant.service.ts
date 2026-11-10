import { prisma } from '@closetiq/database';
import { NotFoundError } from '../utils/errors.js';

export class MerchantService {
  async handleRedirect(productId: string, userId?: string, outfitId?: string, ipAddress?: string): Promise<string> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { merchant: true },
    });

    if (!product) {
      throw new NotFoundError('Product not found for redirection');
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
    let targetUrl = product.affiliateUrl || product.productUrl;
    const subParam = product.merchant.subIdParamName || 'subId1';
    const subValue = `closetiq_${userId || 'anon'}_${Date.now()}`;

    const separator = targetUrl.includes('?') ? '&' : '?';
    targetUrl = `${targetUrl}${separator}${subParam}=${encodeURIComponent(subValue)}`;

    return targetUrl;
  }
}

export const merchantService = new MerchantService();
