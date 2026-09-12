import { FormulaColor, ColorPairingRule, ShapeSilhouette, MainCategory } from './types';

/**
 * Color metadata including hex representation for UI swatches and UI rendering
 */
export const COLOR_CONFIG: Record<FormulaColor, { hex: string; textDark: boolean; category: 'neutral' | 'accent' }> = {
  Red: { hex: '#BA2D2D', textDark: false, category: 'accent' },
  Orange: { hex: '#D96528', textDark: false, category: 'accent' },
  Yellow: { hex: '#E6AD3B', textDark: true, category: 'accent' },
  Green: { hex: '#2F664B', textDark: false, category: 'accent' },
  Blue: { hex: '#2C5E8A', textDark: false, category: 'accent' },
  Purple: { hex: '#684585', textDark: false, category: 'accent' },
  Pink: { hex: '#E5989B', textDark: true, category: 'accent' },
  Brown: { hex: '#583D28', textDark: false, category: 'neutral' },
  Camel: { hex: '#C49767', textDark: true, category: 'neutral' },
  Navy: { hex: '#1E293B', textDark: false, category: 'neutral' },
  Cream: { hex: '#F7F3E9', textDark: true, category: 'neutral' },
  Emerald: { hex: '#165B4C', textDark: false, category: 'accent' },
  Cobalt: { hex: '#195190', textDark: false, category: 'accent' },
  Denim: { hex: '#4F759B', textDark: false, category: 'neutral' },
  Tan: { hex: '#D2B48C', textDark: true, category: 'neutral' },
  Olive: { hex: '#636B46', textDark: false, category: 'neutral' },
  Lilac: { hex: '#C8A8D8', textDark: true, category: 'accent' },
  Gray: { hex: '#8C92AC', textDark: false, category: 'neutral' },
  Black: { hex: '#1C1917', textDark: false, category: 'neutral' },
  White: { hex: '#FFFFFF', textDark: true, category: 'neutral' },
  Burgundy: { hex: '#722F37', textDark: false, category: 'accent' },
  'Charcoal Gray': { hex: '#36454F', textDark: false, category: 'neutral' },
  Cerulean: { hex: '#007BA7', textDark: false, category: 'accent' },
  Pattern: { hex: '#8B5CF6', textDark: false, category: 'accent' },
};

/**
 * Direct encoding of the 8 Main Colors from "The Everyday Color Pairing Cheat Sheet" (Page 1)
 */
export const EVERYDAY_COLOR_CHEAT_SHEET: Record<string, ColorPairingRule> = {
  Red: {
    mainColor: 'Red',
    pairings: ['Camel', 'Navy', 'Pink', 'Cream', 'Emerald'],
    description: 'Elevated & bold. Camel softens the contrast, Navy grounds it classic, Pink creates tone-on-tone depth.',
    mood: 'Polished & Confident'
  },
  Orange: {
    mainColor: 'Orange',
    pairings: ['Cobalt', 'Denim', 'Tan', 'Olive', 'Brown'],
    description: 'Vibrant earthy balance. Cobalt creates complementary pop; Denim & Tan keep it wearable and chic.',
    mood: 'Warm & High-Energy'
  },
  Yellow: {
    mainColor: 'Yellow',
    pairings: ['Red', 'Lilac', 'Gray', 'Cream', 'Olive'],
    description: 'Playful yet refined. Gray and Cream temper the vibrancy; Olive offers an organic, modern twist.',
    mood: 'Fresh & Radiant'
  },
  Green: {
    mainColor: 'Green',
    pairings: ['Navy', 'Cream', 'Denim', 'Black', 'Brown'],
    description: 'Timeless nature-inspired harmony. Cream brightens, Black adds sleekness, Navy adds collegiate polish.',
    mood: 'Sophisticated & Grounded'
  },
  Blue: {
    mainColor: 'Blue',
    pairings: ['Camel', 'Orange', 'Gray', 'Denim', 'Brown'],
    description: 'The ultimate versatile staple. Camel & Brown warm up cooler blues; Orange adds an artistic complement.',
    mood: 'Crisp & Tailored'
  },
  Purple: {
    mainColor: 'Purple',
    pairings: ['White', 'Gray', 'Black', 'Yellow', 'Navy'],
    description: 'Regal and structured. White and Gray keep it luminous and crisp; Yellow provides dynamic accenting.',
    mood: 'Creative & Luxurious'
  },
  Pink: {
    mainColor: 'Pink',
    pairings: ['Burgundy', 'Denim', 'Gray', 'Cream', 'Brown'],
    description: 'Romantic modern edge. Burgundy builds rich monochrome gradients; Denim grounds soft pastels.',
    mood: 'Chic & Subtle Femininity'
  },
  Brown: {
    mainColor: 'Brown',
    pairings: ['Cream', 'Olive', 'Pink', 'Black', 'Blue'],
    description: 'Quiet luxury foundation. Cream creates high-end latte tones; Light Pink or Sky Blue adds gentle contrast.',
    mood: 'Effortless & Luxe'
  },
};

/**
 * Universal neutral tones that pair effortlessly across all wardrobes
 */
export const UNIVERSAL_NEUTRALS: FormulaColor[] = ['White', 'Cream', 'Black', 'Gray', 'Charcoal Gray', 'Denim', 'Tan', 'Camel', 'Navy'];

/**
 * Evaluate whether two colors form a valid Style Formula pairing
 */
export function evaluateColorPairing(colorA: FormulaColor, colorB: FormulaColor): {
  isMatch: boolean;
  score: number;
  reason: string;
} {
  if (colorA === colorB) {
    return {
      isMatch: true,
      score: 90,
      reason: 'Monochrome pairing: cohesive tonal elegance with continuous visual line.'
    };
  }

  // Handle Pattern color pairings
  if (colorA === 'Pattern' || colorB === 'Pattern') {
    return {
      isMatch: true,
      score: 88,
      reason: 'Pattern Accent: Anchored by solid tones present within or matching the print.'
    };
  }

  // Check cheat sheet directly
  const ruleA = EVERYDAY_COLOR_CHEAT_SHEET[colorA];
  if (ruleA && ruleA.pairings.includes(colorB)) {
    return {
      isMatch: true,
      score: 100,
      reason: `Official Style Formula Pairing: ${colorA} + ${colorB} (${ruleA.mood}).`
    };
  }

  const ruleB = EVERYDAY_COLOR_CHEAT_SHEET[colorB];
  if (ruleB && ruleB.pairings.includes(colorA)) {
    return {
      isMatch: true,
      score: 100,
      reason: `Official Style Formula Pairing: ${colorB} + ${colorA} (${ruleB.mood}).`
    };
  }

  // Check if one is an accent and the other is a universal neutral
  const isANeutral = UNIVERSAL_NEUTRALS.includes(colorA);
  const isBNeutral = UNIVERSAL_NEUTRALS.includes(colorB);

  if (isANeutral && isBNeutral) {
    return {
      isMatch: true,
      score: 85,
      reason: `Neutral Harmony: ${colorA} and ${colorB} provide a quiet, timeless foundation.`
    };
  }

  if (isANeutral || isBNeutral) {
    return {
      isMatch: true,
      score: 80,
      reason: `Grounded Accent: Neutral ${isANeutral ? colorA : colorB} balances vibrant ${isANeutral ? colorB : colorA}.`
    };
  }

  return {
    isMatch: false,
    score: 50,
    reason: `Experimental contrast: ${colorA} and ${colorB} require deliberate finishing accessories to bridge the look.`
  };
}

/**
 * Shape / Silhouette Harmony Rules (The 'S' in CSF)
 * Proportions rule: Balance volume (Fitted + Wide, Relaxed + Structured, Cropped + High Rise)
 */
export function evaluateShapeHarmony(
  topShape?: ShapeSilhouette,
  bottomShape?: ShapeSilhouette,
  outerwearShape?: ShapeSilhouette
): { isBalanced: boolean; score: number; description: string } {
  if (!topShape || !bottomShape) {
    return { isBalanced: true, score: 75, description: 'Single piece silhouette or incomplete set.' };
  }

  // Rule 1: Fitted Top + Wide-Leg / Relaxed Bottom
  if (topShape === 'Fitted' && (bottomShape === 'Wide-Leg' || bottomShape === 'Fluid / Flowy')) {
    return {
      isBalanced: true,
      score: 100,
      description: 'Golden Proportion: Fitted upper silhouette with wide/fluid bottom creates intentional waist definition.'
    };
  }

  // Rule 2: Relaxed / Oversized Top + Fitted / Structured Bottom
  if ((topShape === 'Relaxed' || topShape === 'Layered') && (bottomShape === 'Fitted' || bottomShape === 'Structured')) {
    return {
      isBalanced: true,
      score: 95,
      description: 'Modern Casual Balance: Relaxed top anchored by a structured/fitted bottom prevents visual overwhelm.'
    };
  }

  // Rule 3: Cropped Top + High-Rise / Wide Bottom
  if (topShape === 'Cropped' && (bottomShape === 'Wide-Leg' || bottomShape === 'Long / Maxi')) {
    return {
      isBalanced: true,
      score: 95,
      description: 'Elongating Ratio: Cropped upper length paired with long/wide bottom visually lengthens legs.'
    };
  }

  // Rule 4: Structured Layer over Fluid Base
  if (outerwearShape === 'Structured' && (bottomShape === 'Fluid / Flowy' || topShape === 'Fluid / Flowy')) {
    return {
      isBalanced: true,
      score: 100,
      description: 'Structured + Fluid Contrast: Tailored layer gives clean architectural shape over soft drapery.'
    };
  }

  // Rule 5: Fitted + Fitted or Relaxed + Relaxed (needs finishing layer)
  if (topShape === 'Relaxed' && bottomShape === 'Relaxed') {
    if (outerwearShape === 'Structured') {
      return {
        isBalanced: true,
        score: 85,
        description: 'Structured outerwear successfully reins in an all-relaxed base.'
      };
    }
    return {
      isBalanced: false,
      score: 65,
      description: 'Double relaxed pieces can lack definition. Try a tuck, belt, or structured outerwear layer.'
    };
  }

  return {
    isBalanced: true,
    score: 80,
    description: 'Clean balanced silhouette with cohesive proportions.'
  };
}
