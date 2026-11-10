import { BodyShape } from '@closetiq/shared-types';

export interface SilhouetteItem {
  category: string;
  subCategory: string;
  fitType?: string | null;
}

export interface SilhouetteScoreResult {
  score: number;
  targetShape: BodyShape;
  proportions: string;
  critique: string;
}

export function evaluateSilhouetteBalance(
  items: SilhouetteItem[],
  shape: BodyShape = 'UNSPECIFIED'
): SilhouetteScoreResult {
  const top = items.find((i) => i.category === 'TOP' || i.category === 'DRESS');
  const bottom = items.find((i) => i.category === 'BOTTOM');
  const outerwear = items.find((i) => i.category === 'OUTERWEAR');

  const topFit = (top?.fitType || '').toLowerCase();
  const bottomFit = (bottom?.fitType || '').toLowerCase();
  const outerFit = (outerwear?.fitType || '').toLowerCase();
  const bottomSub = (bottom?.subCategory || '').toLowerCase();
  const topSub = (top?.subCategory || '').toLowerCase();

  switch (shape) {
    case 'PEAR': {
      // Accentuate shoulder line / torso structure while keeping bottoms streamlined / straight
      const hasTopVolume = outerFit.includes('oversized') || topFit.includes('relaxed') || !!outerwear;
      const isBottomStreamlined = bottomSub.includes('tailored') || bottomFit.includes('straight') || bottomFit.includes('regular');

      if (hasTopVolume && isBottomStreamlined) {
        return {
          score: 100,
          targetShape: shape,
          proportions: 'Upper-torso emphasis with vertical straight lower line',
          critique: 'Harmonious volume displacement balancing hip proportions flawlessly.',
        };
      }
      if (bottomFit.includes('skinny') && topFit.includes('boxy')) {
        return {
          score: 55,
          targetShape: shape,
          proportions: 'Heavy lower compression against top volume',
          critique: 'Skinny trousers with boxy cut unbalances hip-shoulder equilibrium.',
        };
      }
      return {
        score: 85,
        targetShape: shape,
        proportions: 'Moderate vertical alignment',
        critique: 'Clean baseline silhouette that complements natural waist.',
      };
    }

    case 'INVERTED_TRIANGLE': {
      // Soften broad shoulders, add fluid volume or width to lower body (wide-leg trousers, pleated pants)
      const hasWideBottom = bottomSub.includes('wide') || bottomFit.includes('relaxed') || bottomSub.includes('pleated');
      const isTopMinimalist = !topFit.includes('padded') && !outerFit.includes('shoulder pads');

      if (hasWideBottom && isTopMinimalist) {
        return {
          score: 100,
          targetShape: shape,
          proportions: 'Soft architectural drape with lower-body expansion',
          critique: 'Wide-leg trouser fluidly grounds broad shoulder architecture.',
        };
      }
      return {
        score: 80,
        targetShape: shape,
        proportions: 'Balanced contemporary proportions',
        critique: 'Standard tailored lines; consider wide-leg tailoring for peak architectural balance.',
      };
    }

    case 'HOURGLASS': {
      // Maintain natural waist proportion and balanced top/bottom ratios
      const isFittedOrBelted = topFit.includes('slim') || topFit.includes('tailored') || outerFit.includes('belted');
      if (isFittedOrBelted) {
        return {
          score: 100,
          targetShape: shape,
          proportions: 'Defined waistline with symmetrical frame distribution',
          critique: 'Highlights natural waist curvature without overpowering torso or hips.',
        };
      }
      return {
        score: 88,
        targetShape: shape,
        proportions: 'Balanced relaxed elegance',
        critique: 'Relaxed tailoring retains silhouette balance while exuding effortless ease.',
      };
    }

    case 'RECTANGLE': {
      // Add dimension through tailored layering, belts, or contrasting cuts
      const hasLayering = !!outerwear && (top || bottom);
      if (hasLayering) {
        return {
          score: 100,
          targetShape: shape,
          proportions: 'Multi-depth dimensional layering',
          critique: 'Structured outerwear over clean base breaks linear planes into sculpted depth.',
        };
      }
      return {
        score: 85,
        targetShape: shape,
        proportions: 'Streamlined columnar aesthetic',
        critique: 'Crisp architectural column line matching modern minimalist silhouettes.',
      };
    }

    case 'APPLE': {
      // Vertical drape lines, open outerwear or clean neckline
      const hasVerticalDrape = outerFit.includes('oversized') || outerFit.includes('long') || !!outerwear;
      if (hasVerticalDrape) {
        return {
          score: 95,
          targetShape: shape,
          proportions: 'Elongating vertical drape',
          critique: 'Unbuttoned/open outerwear establishes clean vertical eye-movement down the torso.',
        };
      }
      return {
        score: 82,
        targetShape: shape,
        proportions: 'Standard comfortable geometry',
        critique: 'Relaxed proportions providing freedom of movement and clean posture.',
      };
    }

    default:
      return {
        score: 85,
        targetShape: 'UNSPECIFIED',
        proportions: 'Versatile contemporary balance',
        critique: 'Well-proportioned editorial pairing suitable across diverse body profiles.',
      };
  }
}
