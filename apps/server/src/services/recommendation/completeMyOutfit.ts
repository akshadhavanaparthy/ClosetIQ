import { prisma, ClothingCategory, Formality } from '@closetiq/database';
import { OutfitDto, OutfitItemDto } from '@closetiq/shared-types';
import { computeOutfitScore, ScoredCandidateItem } from './scoringEngine.js';
import { AIFactory } from '../ai/ai.factory.js';
import { randomUUID } from 'crypto';

interface CompleteMyOutfitParams {
  userId: string;
  seedItemId: string;
  occasion?: string;
  includeShoppingCatalog?: boolean;
  maxBudget?: number;
}

export async function executeCompleteMyOutfit(params: CompleteMyOutfitParams): Promise<OutfitDto[]> {
  const { userId, seedItemId, occasion = 'Everyday Elevated', includeShoppingCatalog = true, maxBudget } = params;

  // 1. Fetch User Profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  const profile = user?.profile;

  // 2. Fetch the Seed Item
  const seedItem = await prisma.wardrobeItem.findFirst({
    where: { id: seedItemId, userId },
  });

  if (!seedItem) {
    throw new Error('Seed item not found in user wardrobe');
  }

  // Determine needed slots
  const allCoreSlots: ClothingCategory[] = [
    ClothingCategory.TOP,
    ClothingCategory.BOTTOM,
    ClothingCategory.FOOTWEAR,
  ];

  const neededSlots = allCoreSlots.filter((slot) => slot !== seedItem.category);
  if (seedItem.category !== ClothingCategory.OUTERWEAR) {
    neededSlots.push(ClothingCategory.OUTERWEAR);
  }

  // 3. Fetch Candidate Owned Items for needed slots
  const ownedCandidates = await prisma.wardrobeItem.findMany({
    where: {
      userId,
      isArchived: false,
      category: { in: neededSlots },
    },
  });

  // 4. Fetch Candidate Catalog Products
  let productCandidates: Array<{
    id: string;
    title: string;
    brand: string;
    category: ClothingCategory;
    subCategory: string;
    primaryColorHex: string;
    primaryColorName: string;
    formalityLevel: Formality;
    price: any;
    imageUrls: string[];
    affiliateUrl: string | null;
  }> = [];

  if (includeShoppingCatalog) {
    productCandidates = await prisma.product.findMany({
      where: {
        category: { in: neededSlots },
        inStock: true,
      },
      take: 20,
    });
  }

  // Group items by slot
  const slotCandidates = new Map<ClothingCategory, ScoredCandidateItem[]>();

  for (const slot of neededSlots) {
    const list: ScoredCandidateItem[] = [];

    // Add owned items
    ownedCandidates
      .filter((i) => i.category === slot)
      .forEach((item) => {
        list.push({
          id: item.id,
          category: item.category,
          subCategory: item.subCategory,
          primaryColorHex: item.primaryColorHex,
          primaryColorName: item.primaryColorName,
          formalityLevel: item.formalityLevel,
          fitType: item.fitType,
          brand: item.brand,
          price: item.cost ? Number(item.cost) : 0,
        });
      });

    // Add catalog items
    productCandidates
      .filter((p) => p.category === slot)
      .forEach((prod) => {
        list.push({
          id: prod.id,
          category: prod.category,
          subCategory: prod.subCategory,
          primaryColorHex: prod.primaryColorHex,
          primaryColorName: prod.primaryColorName,
          formalityLevel: prod.formalityLevel,
          fitType: 'Regular',
          brand: prod.brand,
          price: Number(prod.price),
        });
      });

    if (list.length > 0) {
      slotCandidates.set(slot, list);
    }
  }

  const seedScoredItem: ScoredCandidateItem = {
    id: seedItem.id,
    category: seedItem.category,
    subCategory: seedItem.subCategory,
    primaryColorHex: seedItem.primaryColorHex,
    primaryColorName: seedItem.primaryColorName,
    formalityLevel: seedItem.formalityLevel,
    fitType: seedItem.fitType,
    brand: seedItem.brand,
    price: seedItem.cost ? Number(seedItem.cost) : 0,
  };

  // Synthesize candidate combinations
  const topSlotItems = slotCandidates.get(ClothingCategory.TOP) || [];
  const bottomSlotItems = slotCandidates.get(ClothingCategory.BOTTOM) || [];
  const footwearSlotItems = slotCandidates.get(ClothingCategory.FOOTWEAR) || [];
  const outerSlotItems = slotCandidates.get(ClothingCategory.OUTERWEAR) || [];

  const combinations: ScoredCandidateItem[][] = [];

  // Generate candidate combinations depending on what seed item is
  if (seedItem.category === ClothingCategory.OUTERWEAR) {
    for (const t of topSlotItems.slice(0, 3)) {
      for (const b of bottomSlotItems.slice(0, 3)) {
        for (const f of footwearSlotItems.slice(0, 2)) {
          combinations.push([seedScoredItem, t, b, f]);
        }
      }
    }
  } else if (seedItem.category === ClothingCategory.BOTTOM) {
    for (const t of topSlotItems.slice(0, 3)) {
      for (const f of footwearSlotItems.slice(0, 2)) {
        if (outerSlotItems.length > 0) {
          for (const o of outerSlotItems.slice(0, 2)) {
            combinations.push([seedScoredItem, t, o, f]);
          }
        } else {
          combinations.push([seedScoredItem, t, f]);
        }
      }
    }
  } else {
    // Seed is Top or other
    for (const b of bottomSlotItems.slice(0, 3)) {
      for (const f of footwearSlotItems.slice(0, 2)) {
        if (outerSlotItems.length > 0) {
          for (const o of outerSlotItems.slice(0, 2)) {
            combinations.push([seedScoredItem, b, o, f]);
          }
        } else {
          combinations.push([seedScoredItem, b, f]);
        }
      }
    }
  }

  // If combinations are empty (minimal wardrobe), construct minimal outfit from available candidates
  if (combinations.length === 0) {
    const fallbackList = [seedScoredItem];
    if (topSlotItems[0] && seedItem.category !== ClothingCategory.TOP) fallbackList.push(topSlotItems[0]);
    if (bottomSlotItems[0] && seedItem.category !== ClothingCategory.BOTTOM) fallbackList.push(bottomSlotItems[0]);
    if (footwearSlotItems[0] && seedItem.category !== ClothingCategory.FOOTWEAR) fallbackList.push(footwearSlotItems[0]);
    combinations.push(fallbackList);
  }

  // Score each combination
  const scoredCombos = combinations.map((items) => {
    const scoreResult = computeOutfitScore(items, {
      targetFormality: seedItem.formalityLevel,
      userBodyShape: profile?.bodyShapeConfirmed || 'HOURGLASS',
      userPalette: profile?.seasonalPalette || 'TRUE_WINTER',
      budgetTier: profile?.budgetTier || 2,
      maxBudget,
      preferredBrands: profile?.preferredBrands || [],
      avoidColors: profile?.avoidColors || [],
      styleKeywords: profile?.styleKeywords || [],
    });

    return {
      items,
      scoreResult,
    };
  });

  // Rank by overallScore descending and pick top 3
  scoredCombos.sort((a, b) => b.scoreResult.overallScore - a.scoreResult.overallScore);
  const topCombos = scoredCombos.slice(0, 3);

  const aiProvider = AIFactory.getProvider();
  const results: OutfitDto[] = [];

  for (let idx = 0; idx < topCombos.length; idx++) {
    const { items, scoreResult } = topCombos[idx];

    // Build visual OutfitItemDto list
    const outfitItemDtos: OutfitItemDto[] = items.map((item, layerIdx) => {
      const isOwned = item.id === seedItem.id || ownedCandidates.some((o) => o.id === item.id);
      const ownedMatch = isOwned ? (item.id === seedItem.id ? seedItem : ownedCandidates.find((o) => o.id === item.id)) : null;
      const productMatch = !isOwned ? productCandidates.find((p) => p.id === item.id) : null;

      return {
        id: randomUUID(),
        slotType: item.category as ClothingCategory,
        layerOrder: layerIdx + 1,
        isOwned,
        wardrobeItemId: isOwned ? item.id : null,
        productId: !isOwned ? item.id : null,
        name: ownedMatch?.name || productMatch?.title || item.subCategory,
        brand: ownedMatch?.brand || productMatch?.brand || item.brand || null,
        subCategory: item.subCategory,
        primaryColorHex: item.primaryColorHex,
        primaryColorName: item.primaryColorName,
        imageUrl:
          productMatch?.imageUrls[0] ||
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
        price: item.price,
        affiliateUrl: productMatch?.affiliateUrl || null,
      };
    });

    // Generate AI editorial explanation
    let stylingAdvice = null;
    try {
      stylingAdvice = await aiProvider.generateOutfitExplanation({
        userProfile: {
          confirmedBodyShape: profile?.bodyShapeConfirmed || 'HOURGLASS',
          confirmedUndertone: profile?.undertoneConfirmed || 'COOL',
          seasonalPalette: profile?.seasonalPalette || 'TRUE_WINTER',
          styleKeywords: profile?.styleKeywords || ['minimalist', 'architectural'],
        },
        outfit: {
          occasion,
          formality: seedItem.formalityLevel,
          items: outfitItemDtos.map((i) => ({
            category: i.slotType,
            color: i.primaryColorName,
            subCategory: i.subCategory,
            isOwned: i.isOwned,
            brand: i.brand || undefined,
            name: i.name,
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
    } catch {
      stylingAdvice = {
        headline: `Ensemble Curated around ${seedItem.name}`,
        editorialSummary: `A deliberate pairing balancing ${seedItem.primaryColorName} textures with tailored contrast.`,
        stylingTips: ['Wear with confidence', 'Harmonizes with your seasonal profile'],
        colorStory: scoreResult.ruleBreakdown.colorHarmony.details,
      };
    }

    results.push({
      id: randomUUID(),
      name: `Look ${idx + 1}: ${seedItem.name} Redefined`,
      occasion,
      season: 'CURRENT_SEASON',
      targetFormality: seedItem.formalityLevel,
      overallScore: scoreResult.overallScore,
      colorHarmonyScore: scoreResult.colorScore,
      silhouetteScore: scoreResult.silhouetteScore,
      formalityScore: scoreResult.formalityScore,
      ruleBreakdown: scoreResult.ruleBreakdown,
      stylingAdvice,
      items: outfitItemDtos,
      isCurated: true,
      isUserCreated: false,
      createdAt: new Date().toISOString(),
    });
  }

  return results;
}
