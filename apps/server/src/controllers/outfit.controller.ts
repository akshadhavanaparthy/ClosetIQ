import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate.js';
import { prisma, Formality } from '@closetiq/database';
import { computeOutfitScore } from '../services/recommendation/scoringEngine.js';
import { AIFactory } from '../services/ai/ai.factory.js';
import { UnauthorizedError, NotFoundError } from '../utils/errors.js';

export class OutfitController {
  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const outfits = await prisma.outfit.findMany({
      where: { userId: req.user.userId },
      include: {
        items: {
          include: {
            wardrobeItem: true,
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: outfits,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const { name, occasion, items, targetFormality } = req.body;

    // Fetch user profile for scoring
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.userId },
    });

    // Score the manual outfit
    const scoreResult = computeOutfitScore(items, {
      targetFormality: targetFormality || Formality.CASUAL,
      userBodyShape: profile?.bodyShapeConfirmed || 'HOURGLASS',
      userPalette: profile?.seasonalPalette || 'TRUE_WINTER',
      budgetTier: profile?.budgetTier || 2,
    });

    const aiProvider = AIFactory.getProvider();
    const stylingAdvice = await aiProvider.generateOutfitExplanation({
      userProfile: {
        confirmedBodyShape: profile?.bodyShapeConfirmed || 'HOURGLASS',
        confirmedUndertone: profile?.undertoneConfirmed || 'COOL',
        seasonalPalette: profile?.seasonalPalette || 'TRUE_WINTER',
        styleKeywords: profile?.styleKeywords || [],
      },
      outfit: {
        occasion: occasion || 'Custom Creation',
        formality: targetFormality || 'CASUAL',
        items: items.map((i: any) => ({
          category: i.category,
          color: i.primaryColorName || 'Neutral',
          subCategory: i.subCategory || 'Garment',
          isOwned: !!i.wardrobeItemId,
          name: i.name || 'Garment',
        })),
      },
      scoringBreakdown: {
        overallScore: scoreResult.overallScore,
        colorScore: scoreResult.colorScore,
        silhouetteScore: scoreResult.silhouetteScore,
        formalityScore: scoreResult.formalityScore,
        primaryColorHarmonies: scoreResult.ruleBreakdown.colorHarmony.details,
        silhouetteAdvice: scoreResult.ruleBreakdown.silhouetteBalance.critique,
      },
    });

    const outfit = await prisma.outfit.create({
      data: {
        userId: req.user.userId,
        name: name || 'Canvas Creation',
        occasion: occasion || 'Daily Elevated',
        targetFormality: targetFormality || Formality.CASUAL,
        overallScore: scoreResult.overallScore,
        colorHarmonyScore: scoreResult.colorScore,
        silhouetteScore: scoreResult.silhouetteScore,
        formalityScore: scoreResult.formalityScore,
        ruleBreakdown: scoreResult.ruleBreakdown as any,
        stylingAdvice: stylingAdvice.editorialSummary,
        isUserCreated: true,
        items: {
          create: items.map((item: any, idx: number) => ({
            slotType: item.category,
            layerOrder: idx + 1,
            wardrobeItemId: item.wardrobeItemId || null,
            productId: item.productId || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      success: true,
      data: outfit,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const outfit = await prisma.outfit.findFirst({
      where: { id, userId: req.user.userId },
      include: {
        items: {
          include: {
            wardrobeItem: true,
            product: true,
          },
        },
      },
    });

    if (!outfit) throw new NotFoundError('Outfit not found');

    res.json({
      success: true,
      data: outfit,
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const outfit = await prisma.outfit.findFirst({
      where: { id, userId: req.user.userId },
    });
    if (!outfit) throw new NotFoundError('Outfit not found');

    await prisma.outfit.delete({ where: { id } });

    res.json({
      success: true,
      data: { message: 'Outfit removed successfully' },
      meta: { timestamp: new Date().toISOString() },
    });
  }
}

export const outfitController = new OutfitController();
