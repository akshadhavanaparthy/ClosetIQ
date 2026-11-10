import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate.js';
import { prisma } from '@closetiq/database';
import { UnauthorizedError } from '../utils/errors.js';

export class PrivacyController {
  async exportData(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const userId = req.user.userId;

    const [user, profile, wardrobeItems, analyses, outfits, wishlist] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, createdAt: true } }),
      prisma.profile.findUnique({ where: { id: userId } }),
      prisma.wardrobeItem.findMany({ where: { userId } }),
      prisma.bodyAnalysis.findMany({ where: { userId } }),
      prisma.outfit.findMany({ where: { userId }, include: { items: true } }),
      prisma.wishlistItem.findMany({ where: { userId }, include: { product: true } }),
    ]);

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'GDPR_DATA_EXPORTED',
      },
    });

    res.json({
      success: true,
      data: {
        user,
        profile,
        wardrobeItems,
        bodyAnalyses: analyses,
        outfits,
        wishlist,
        exportedAt: new Date().toISOString(),
      },
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const userId = req.user.userId;

    // Soft delete user and anonymize
    await prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        email: `deleted_${userId}_${Date.now()}@anonymized.closetiq.fashion`,
      },
    });

    // Revoke all refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'GDPR_ACCOUNT_DELETED',
      },
    });

    res.json({
      success: true,
      data: { message: 'Account and associated personal data successfully queued for permanent purge.' },
      meta: { timestamp: new Date().toISOString() },
    });
  }
}

export const privacyController = new PrivacyController();
