import { WardrobeItem, WardrobeGap, FormulaColor, MainCategory, SubCategory, ShapeSilhouette, FinishTexture, Occasion } from './types';
import { EVERYDAY_COLOR_CHEAT_SHEET, UNIVERSAL_NEUTRALS } from './style-formula-rules';

/**
 * Identifies high-value wardrobe gaps and calculates how many new formulas each addition would unlock
 */
export function analyzeWardrobeGaps(wardrobe: WardrobeItem[]): WardrobeGap[] {
  const gaps: WardrobeGap[] = [];

  const tops = wardrobe.filter(i => i.category === 'Tops');
  const bottoms = wardrobe.filter(i => i.category === 'Bottoms');
  const outerwears = wardrobe.filter(i => i.category === 'Outerwear');
  const shoes = wardrobe.filter(i => i.category === 'Shoes');
  const bags = wardrobe.filter(i => i.category === 'Bags');

  // Count occurrences of colors in closet
  const colorCounts: Partial<Record<FormulaColor, number>> = {};
  wardrobe.forEach(item => {
    colorCounts[item.primaryColor] = (colorCounts[item.primaryColor] || 0) + 1;
  });

  // 1. Color Bridge Gap Detection
  // Check main guide colors that the user owns, but lacks their official cheat-sheet partner colors
  const mainGuideColors: FormulaColor[] = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Brown'];

  for (const mainColor of mainGuideColors) {
    const itemsInColor = wardrobe.filter(i => i.primaryColor === mainColor);
    if (itemsInColor.length > 0) {
      const cheatSheetRule = EVERYDAY_COLOR_CHEAT_SHEET[mainColor];
      if (cheatSheetRule) {
        // Find which official pairing colors are missing from bottoms/outerwear
        for (const targetPairing of cheatSheetRule.pairings) {
          const matchingPartners = wardrobe.filter(i => 
            i.primaryColor === targetPairing && 
            (i.category === 'Bottoms' || i.category === 'Outerwear')
          );

          if (matchingPartners.length === 0) {
            const potentialOutfitsUnlocked = itemsInColor.length * 3; // Each top pairs with bottoms, layers, shoes
            gaps.push({
              id: `gap-color-${mainColor}-${targetPairing}`,
              type: 'color_bridge',
              title: `${targetPairing} Essential Piece to Pair with ${mainColor}`,
              description: `You have ${itemsInColor.length} ${mainColor} piece(s), but no ${targetPairing} bottoms or layers to activate the official Style Formula pairing.`,
              impactScore: potentialOutfitsUnlocked,
              recommendedCategory: 'Bottoms',
              recommendedSubcategory: targetPairing === 'Denim' ? 'Jeans' : 'Tailored Trousers',
              recommendedColor: targetPairing,
              recommendedShape: 'Wide-Leg',
              recommendedFinish: targetPairing === 'Denim' ? 'Denim' : 'Wool',
              recommendedOccasion: 'Work',
              whyNeeded: `According to the Style Formula Color Cheat Sheet, ${mainColor} + ${targetPairing} creates an effortlessly polished pairing. Adding this piece unlocks multiple new combinations for your existing ${mainColor} items.`,
              unlockedOutfitExamples: [
                `${mainColor} Top + ${targetPairing} Trousers + Neutral Loafers`,
                `${mainColor} Knit + ${targetPairing} Pants + Shoulder Bag`
              ]
            });
          }
        }
      }
    }
  }

  // 2. Shape / Silhouette Proportion Gap Detection
  const fittedTops = tops.filter(t => t.shape === 'Fitted' || t.shape === 'Cropped');
  const wideBottoms = bottoms.filter(b => b.shape === 'Wide-Leg' || b.shape === 'Fluid / Flowy');

  if (fittedTops.length >= 2 && wideBottoms.length === 0) {
    gaps.push({
      id: 'gap-shape-wide-leg',
      type: 'shape_balance',
      title: 'Wide-Leg Tailored Trousers (Shape Balancing Staple)',
      description: `You own ${fittedTops.length} fitted/cropped tops, but lack wide-leg trousers to achieve the Golden Proportion silhouette.`,
      impactScore: fittedTops.length * 4,
      recommendedCategory: 'Bottoms',
      recommendedSubcategory: 'Wide-Leg Pants',
      recommendedColor: 'Camel',
      recommendedShape: 'Wide-Leg',
      recommendedFinish: 'Wool',
      recommendedOccasion: 'Work',
      whyNeeded: 'Page 2 of the guide emphasizes balancing volume: fitted tops require wider silhouettes at the bottom to balance visual weight and create clean waist placement.',
      unlockedOutfitExamples: [
        'Fitted White Tee + Camel Wide-Leg Pants',
        'Fitted Black Ribbed Knit + Wide-Leg Trousers'
      ]
    });
  }

  // Check for Structured Layering Outerwear
  const structuredLayers = outerwears.filter(o => o.shape === 'Structured');
  if (structuredLayers.length === 0 && tops.length + bottoms.length > 4) {
    gaps.push({
      id: 'gap-outerwear-blazer',
      type: 'shape_balance',
      title: 'Structured Neutral Blazer (The Ultimate Third Piece)',
      description: 'You lack a structured third piece layer to give architectural shape and formality transitions to casual bases.',
      impactScore: Math.min(12, (tops.length + bottoms.length) * 2),
      recommendedCategory: 'Outerwear',
      recommendedSubcategory: 'Structured Blazer',
      recommendedColor: 'Navy',
      recommendedShape: 'Structured',
      recommendedFinish: 'Wool',
      recommendedOccasion: 'Work',
      whyNeeded: 'Outerwear provides the "Finish" and structure needed to adapt casual weekend basics into dinner or work-ready ensembles.',
      unlockedOutfitExamples: [
        'T-Shirt + Denim + Navy Blazer + Loafers',
        'Midi Dress + Structured Blazer'
      ]
    });
  }

  // 3. Finishing Piece Gap Detection (Shoes & Bags)
  const neutralShoes = shoes.filter(s => ['Tan', 'Camel', 'Black', 'Cream', 'White', 'Brown'].includes(s.primaryColor));
  if (neutralShoes.length === 0) {
    gaps.push({
      id: 'gap-shoes-loafers',
      type: 'finishing_piece',
      title: 'Neutral Leather Loafers or Ankle Boots',
      description: 'Your closet needs a dependable neutral shoe anchor to ground color pairings without competing.',
      impactScore: 15,
      recommendedCategory: 'Shoes',
      recommendedSubcategory: 'Loafers',
      recommendedColor: 'Tan',
      recommendedShape: 'Structured',
      recommendedFinish: 'Leather',
      recommendedOccasion: 'Work',
      whyNeeded: 'Finish Rule (F): Footwear should connect the outfit rather than compete with your color story.',
      unlockedOutfitExamples: [
        'Completes all Work and Weekend combinations effortlessly.'
      ]
    });
  }

  const structuredBags = bags.filter(b => b.shape === 'Structured' || b.finishTexture === 'Leather');
  if (structuredBags.length === 0) {
    gaps.push({
      id: 'gap-bag-tote',
      type: 'finishing_piece',
      title: 'Classic Leather Crossbody or Structured Bag',
      description: 'A versatile neutral leather bag to provide texture and polished hardware accents.',
      impactScore: 10,
      recommendedCategory: 'Bags',
      recommendedSubcategory: 'Crossbody Bag',
      recommendedColor: 'Brown',
      recommendedShape: 'Structured',
      recommendedFinish: 'Leather',
      recommendedOccasion: 'Weekends',
      whyNeeded: 'A quality leather bag ties together the "Finish" step of the Style Formula.',
      unlockedOutfitExamples: [
        'Elevates weekend denim and gives structure to relaxed silhouettes.'
      ]
    });
  }

  // Sort gaps by impact score (highest unlocked combinations first)
  return gaps.sort((a, b) => b.impactScore - a.impactScore);
}
