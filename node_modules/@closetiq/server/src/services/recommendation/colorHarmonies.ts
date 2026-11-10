import { CIELABColor, HSLColor, HarmonyType, SeasonalPalette } from '@closetiq/shared-types';

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function hexToHsl(hex: string): HSLColor {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hexToCielab(hex: string): CIELABColor {
  const { r, g, b } = hexToRgb(hex);

  // sRGB to XYZ with D65 illuminant
  const srgbToLinear = (c: number) => {
    const v = c / 255;
    return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
  };

  const rL = srgbToLinear(r);
  const gL = srgbToLinear(g);
  const bL = srgbToLinear(b);

  const x = (rL * 0.4124 + gL * 0.3576 + bL * 0.1805) / 0.95047;
  const y = (rL * 0.2126 + gL * 0.7152 + bL * 0.0722) / 1.00000;
  const z = (rL * 0.0193 + gL * 0.1192 + bL * 0.9505) / 1.08883;

  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  const L = Math.max(0, 116 * fy - 16);
  const a = 500 * (fx - fy);
  const bVal = 200 * (fy - fz);

  return {
    L: Math.round(L * 10) / 10,
    a: Math.round(a * 10) / 10,
    b: Math.round(bVal * 10) / 10,
  };
}

export interface ColorHarmonyResult {
  score: number;
  harmonyType: HarmonyType;
  details: string;
  paletteBonus: boolean;
}

export function evaluateColorHarmony(
  hexColors: string[],
  userPalette: SeasonalPalette = 'UNSPECIFIED'
): ColorHarmonyResult {
  if (hexColors.length === 0) {
    return { score: 70, harmonyType: 'NEUTRAL_ACCENT', details: 'No color inputs', paletteBonus: false };
  }
  if (hexColors.length === 1) {
    return { score: 90, harmonyType: 'MONOCHROMATIC', details: 'Single garment tone', paletteBonus: false };
  }

  const hslColors = hexColors.map(hexToHsl);

  // Check if outfit is composed mainly of luxury neutrals (black, white, ivory, beige, grey, navy)
  const isNeutral = (c: HSLColor) => c.s <= 18 || c.l <= 12 || c.l >= 90;
  const allNeutrals = hslColors.every(isNeutral);

  if (allNeutrals) {
    const lightnesses = hslColors.map((c) => c.l);
    const deltaL = Math.max(...lightnesses) - Math.min(...lightnesses);
    if (deltaL >= 20) {
      return {
        score: 95,
        harmonyType: 'NEUTRAL_ACCENT',
        details: `Architectural tonal neutrals with high contrast (ΔL=${deltaL}%)`,
        paletteBonus: false,
      };
    }
    return {
      score: 90,
      harmonyType: 'MONOCHROMATIC',
      details: 'Subdued minimalist monochrome palette',
      paletteBonus: false,
    };
  }

  // Filter for chromatic items
  const chromatic = hslColors.filter((c) => !isNeutral(c));

  if (chromatic.length <= 1) {
    // Neutral base with single accent color (editorial classic)
    return {
      score: 92,
      harmonyType: 'NEUTRAL_ACCENT',
      details: 'Elevated neutral canvas paired with intentional focal accent hue',
      paletteBonus: false,
    };
  }

  // Calculate hue delta between first two chromatic items
  const hue1 = chromatic[0].h;
  const hue2 = chromatic[1].h;
  const hueDiff = Math.abs(hue1 - hue2);
  const angularDistance = Math.min(hueDiff, 360 - hueDiff);

  let score = 75;
  let harmonyType: HarmonyType = 'DISCORDANT';
  let details = 'Varied chromatic hues';

  if (angularDistance <= 18) {
    score = 95;
    harmonyType = 'MONOCHROMATIC';
    details = `Tonal monochromatic pairing (hue angle difference ${angularDistance}°)`;
  } else if (Math.abs(angularDistance - 180) <= 22) {
    score = 90;
    harmonyType = 'COMPLEMENTARY';
    details = `High-impact complementary dynamic contrast (${angularDistance}°)`;
  } else if (Math.abs(angularDistance - 30) <= 15) {
    score = 88;
    harmonyType = 'ANALOGOUS';
    details = `Sophisticated analogous neighboring gradient (${angularDistance}°)`;
  } else if (Math.abs(angularDistance - 120) <= 20) {
    score = 82;
    harmonyType = 'TRIADIC';
    details = `Vibrant balanced triadic geometry (${angularDistance}°)`;
  } else {
    score = 70;
    harmonyType = 'DISCORDANT';
    details = `Unconventional chromatic pairing (${angularDistance}°)`;
  }

  // Palette bonus if matches seasonal palette
  let paletteBonus = false;
  if (userPalette !== 'UNSPECIFIED') {
    // Winter likes crisp high contrast; Autumn likes warm muted tones
    if (userPalette.includes('WINTER') && hslColors.some((c) => c.l <= 15 || c.l >= 88)) {
      score = Math.min(100, score + 10);
      paletteBonus = true;
    } else if (userPalette.includes('AUTUMN') && hslColors.some((c) => c.h >= 20 && c.h <= 50)) {
      score = Math.min(100, score + 10);
      paletteBonus = true;
    } else if (userPalette.includes('SUMMER') && hslColors.some((c) => c.s <= 40 && c.l >= 40)) {
      score = Math.min(100, score + 10);
      paletteBonus = true;
    } else if (userPalette.includes('SPRING') && hslColors.some((c) => c.s >= 50 && c.l >= 60)) {
      score = Math.min(100, score + 10);
      paletteBonus = true;
    }
  }

  return { score, harmonyType, details, paletteBonus };
}
