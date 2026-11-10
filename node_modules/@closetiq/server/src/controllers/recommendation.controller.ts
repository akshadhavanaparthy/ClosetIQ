import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate.js';
import { executeCompleteMyOutfit } from '../services/recommendation/completeMyOutfit.js';
import { prisma } from '@closetiq/database';
import { UnauthorizedError } from '../utils/errors.js';

export class RecommendationController {
  async completeMyOutfit(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const outfits = await executeCompleteMyOutfit({
      userId: req.user.userId,
      seedItemId: req.body.seedItemId,
      occasion: req.body.occasion,
      includeShoppingCatalog: req.body.includeShoppingCatalog ?? true,
      maxBudget: req.body.maxBudget,
    });

    res.json({
      success: true,
      data: outfits,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async daily(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    // Fetch user's first active wardrobe item to use as seed, or seed from top
    const seed = await prisma.wardrobeItem.findFirst({
      where: { userId: req.user.userId, isArchived: false },
    });

    if (!seed) {
      res.json({
        success: true,
        data: [],
        meta: {
          message: 'Please add items to your wardrobe to receive daily curated styling looks.',
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    const outfits = await executeCompleteMyOutfit({
      userId: req.user.userId,
      seedItemId: seed.id,
      occasion: req.body.occasion || 'Smart Casual Daily',
      includeShoppingCatalog: true,
    });

    res.json({
      success: true,
      data: outfits,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async feedback(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const { outfitId, rating, feedbackTags, feedbackText } = req.body;

    // Check if outfit exists or log in RecommendationLog
    const existingOutfit = await prisma.outfit.findUnique({
      where: { id: outfitId },
    });

    if (existingOutfit) {
      await prisma.recommendationLog.create({
        data: {
          userId: req.user.userId,
          outfitId,
          userRating: rating,
          feedbackTags: feedbackTags || [],
          feedbackText: feedbackText || null,
          context: {},
        },
      });
    }

    res.json({
      success: true,
      data: { message: 'Feedback recorded successfully' },
      meta: { timestamp: new Date().toISOString() },
    });
  }
}

export const recommendationController = new RecommendationController();
