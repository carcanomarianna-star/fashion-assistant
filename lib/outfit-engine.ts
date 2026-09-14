import { WardrobeItem, OutfitFormula, Occasion, FormulaColor } from './types';
import { evaluateColorPairing, evaluateShapeHarmony, COLOR_CONFIG } from './style-formula-rules';

/**
 * Helper to ensure an outfit contains at most 1 pattern item, UNLESS all pattern items share the exact same pattern colorway (matching printed co-ord set).
 */
export function hasValidPatternCombination(items: (WardrobeItem | undefined)[]): boolean {
  const patternItems = items.filter((i): i is WardrobeItem => i?.primaryColor === 'Pattern');
  if (patternItems.length <= 1) return true;

  // More than 1 pattern item: check if ALL pattern items have identical patternColors
  const firstColors = patternItems[0].patternColors || [];
  if (firstColors.length === 0) return false;

  return patternItems.every((item) => {
    const itemColors = item.patternColors || [];
    return (
      itemColors.length === firstColors.length &&
      itemColors.every((c) => firstColors.includes(c))
    );
  });
}

/**
 * Generates recommendations and evaluates outfits based on Color + Shape + Finish (CSF)
 */
export function generateOutfitFormulas(
  wardrobe: WardrobeItem[],
  options?: {
    occasion?: Occasion;
    focusColor?: FormulaColor;
    anchorItem?: WardrobeItem;
    limit?: number;
  }
): OutfitFormula[] {
  const { occasion, focusColor, anchorItem, limit = 20 } = options || {};

  // Group items by category
  const tops = wardrobe.filter(i => i.category === 'Tops');
  const bottoms = wardrobe.filter(i => i.category === 'Bottoms');
  const onePieces = wardrobe.filter(i => i.category === 'One-Piece');
  const outerwears = wardrobe.filter(i => i.category === 'Outerwear');
  const shoes = wardrobe.filter(i => i.category === 'Shoes');
  const bags = wardrobe.filter(i => i.category === 'Bags');
  const accessories = wardrobe.filter(i => i.category === 'Accessories');

  const formulas: OutfitFormula[] = [];

  // Helper to test if item fits occasion
  const fitsOccasion = (item?: WardrobeItem) => {
    if (!item || !occasion) return true;
    return item.occasions.includes(occasion);
  };

  // Helper to test if item matches focus color
  const matchesFocus = (item?: WardrobeItem) => {
    if (!focusColor) return true;
    return item?.primaryColor === focusColor || item?.secondaryColor === focusColor;
  };

  // 1. Two-Piece Outfits (Top + Bottom)
  for (const top of tops) {
    if (anchorItem && anchorItem.category === 'Tops' && anchorItem.id !== top.id) continue;
    if (!fitsOccasion(top)) continue;

    for (const bottom of bottoms) {
      if (anchorItem && anchorItem.category === 'Bottoms' && anchorItem.id !== bottom.id) continue;
      if (!fitsOccasion(bottom)) continue;

      const hasFocus = matchesFocus(top) || matchesFocus(bottom);
      if (focusColor && !hasFocus) continue;

      // Evaluate Color Pairing
      const colorEval = evaluateColorPairing(
        top.primaryColor,
        bottom.primaryColor,
        top.patternColors,
        bottom.patternColors
      );

      // Skip if pairwise color evaluation fails or clashes
      if (!colorEval.isMatch || colorEval.score < 60) continue;

      // Evaluate Shape Harmony
      const shapeEval = evaluateShapeHarmony(top.shape, bottom.shape);

      // Pick matching outerwear (optional)
      const matchingOuter = outerwears.find(o => 
        fitsOccasion(o) && 
        (anchorItem?.id === o.id || evaluateColorPairing(o.primaryColor, top.primaryColor, o.patternColors, top.patternColors).isMatch)
      );

      // Pick matching shoes & bags
      const matchingShoes = shoes.find(s => 
        fitsOccasion(s) && 
        (anchorItem?.id === s.id || evaluateColorPairing(s.primaryColor, bottom.primaryColor, s.patternColors, bottom.patternColors).score >= 70)
      );

      const matchingBag = bags.find(b => 
        fitsOccasion(b) && 
        (anchorItem?.id === b.id || evaluateColorPairing(b.primaryColor, top.primaryColor, b.patternColors, top.patternColors).score >= 70)
      );

      const matchingAccessory = accessories.find(a => fitsOccasion(a));

      // Validate pattern combination across all items in ensemble
      if (!hasValidPatternCombination([top, bottom, matchingOuter, matchingShoes, matchingBag])) {
        continue;
      }

      // Calculate Finish Completeness Score (The 'F' in CSF)
      let finishScore = 50;
      if (matchingShoes) finishScore += 25;
      if (matchingBag) finishScore += 15;
      if (matchingAccessory || matchingOuter) finishScore += 10;

      // Overall formula score (Weighted: Color 40%, Shape 35%, Finish 25%)
      const overallScore = Math.round(
        colorEval.score * 0.4 + shapeEval.score * 0.35 + finishScore * 0.25
      );

      if (overallScore >= 65) {
        formulas.push({
          id: `formula-${top.id}-${bottom.id}-${matchingOuter?.id || 'none'}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: `${top.primaryColor} ${top.subcategory} + ${bottom.primaryColor} ${bottom.subcategory}`,
          occasion: occasion || (top.occasions[0] || 'Weekends'),
          top,
          bottom,
          outerwear: matchingOuter,
          shoes: matchingShoes,
          bag: matchingBag,
          accessory: matchingAccessory,
          colorStory: {
            primaryColor: top.primaryColor,
            pairingColor: bottom.primaryColor,
            isRuleMatched: colorEval.isMatch,
            ruleDescription: colorEval.reason,
            score: colorEval.score,
          },
          shapeHarmony: {
            silhouetteDescription: shapeEval.description,
            isBalanced: shapeEval.isBalanced,
            score: shapeEval.score,
          },
          finishCompleteness: {
            hasShoes: !!matchingShoes,
            hasBag: !!matchingBag,
            hasFinishingDetails: !!(matchingAccessory || matchingOuter),
            score: finishScore,
          },
          overallScore,
        });
      }
    }
  }

  // 2. One-Piece Outfits (Dresses / Jumpsuits)
  for (const dress of onePieces) {
    if (anchorItem && anchorItem.id !== dress.id) continue;
    if (!fitsOccasion(dress)) continue;
    if (focusColor && !matchesFocus(dress)) continue;

    const matchingOuter = outerwears.find(o => 
      fitsOccasion(o) && evaluateColorPairing(o.primaryColor, dress.primaryColor, o.patternColors, dress.patternColors).isMatch
    );

    const matchingShoes = shoes.find(s => fitsOccasion(s));
    const matchingBag = bags.find(b => fitsOccasion(b));
    const matchingAccessory = accessories.find(a => fitsOccasion(a));

    if (!hasValidPatternCombination([dress, matchingOuter, matchingShoes, matchingBag])) {
      continue;
    }

    const colorEval = matchingOuter 
      ? evaluateColorPairing(dress.primaryColor, matchingOuter.primaryColor, dress.patternColors, matchingOuter.patternColors)
      : { isMatch: true, score: 90, reason: `Statement ${dress.primaryColor} base grounded with monochrome or neutral finishing pieces.` };

    const shapeEval = evaluateShapeHarmony(dress.shape, undefined, matchingOuter?.shape);

    let finishScore = 55;
    if (matchingShoes) finishScore += 25;
    if (matchingBag) finishScore += 10;
    if (matchingAccessory || matchingOuter) finishScore += 10;

    const overallScore = Math.round(
      colorEval.score * 0.4 + shapeEval.score * 0.35 + finishScore * 0.25
    );

    formulas.push({
      id: `formula-dress-${dress.id}-${matchingOuter?.id || 'none'}-${Date.now()}`,
      name: `${dress.primaryColor} ${dress.subcategory} Ensemble`,
      occasion: occasion || (dress.occasions[0] || 'Dinner'),
      onePiece: dress,
      outerwear: matchingOuter,
      shoes: matchingShoes,
      bag: matchingBag,
      accessory: matchingAccessory,
      colorStory: {
        primaryColor: dress.primaryColor,
        pairingColor: matchingOuter?.primaryColor || dress.primaryColor,
        isRuleMatched: colorEval.isMatch,
        ruleDescription: colorEval.reason,
        score: colorEval.score,
      },
      shapeHarmony: {
        silhouetteDescription: shapeEval.description,
        isBalanced: shapeEval.isBalanced,
        score: shapeEval.score,
      },
      finishCompleteness: {
        hasShoes: !!matchingShoes,
        hasBag: !!matchingBag,
        hasFinishingDetails: !!(matchingAccessory || matchingOuter),
        score: finishScore,
      },
      overallScore,
    });
  }

  // Sort by overall highest score and return top results
  return formulas.sort((a, b) => b.overallScore - a.overallScore).slice(0, limit);
}

/**
 * Evaluates an arbitrary manual user-composed outfit on the Visual Canvas
 */
export function evaluateManualOutfit(items: {
  top?: WardrobeItem;
  bottom?: WardrobeItem;
  onePiece?: WardrobeItem;
  outerwear?: WardrobeItem;
  shoes?: WardrobeItem;
  bag?: WardrobeItem;
  accessory?: WardrobeItem;
}): OutfitFormula {
  const { top, bottom, onePiece, outerwear, shoes, bag, accessory } = items;

  const primaryItem = top || onePiece || outerwear;
  const secondaryItem = bottom || outerwear || shoes;

  const primaryColor = (primaryItem?.primaryColor || 'Camel') as FormulaColor;
  const pairingColor = (secondaryItem?.primaryColor || 'Navy') as FormulaColor;

  let colorEval = evaluateColorPairing(
    primaryColor,
    pairingColor,
    primaryItem?.patternColors,
    secondaryItem?.patternColors
  );

  // Validate outfit-wide pattern compatibility across all selected pieces
  if (!hasValidPatternCombination([top, bottom, onePiece, outerwear, shoes, bag, accessory])) {
    colorEval = {
      isMatch: false,
      score: 0,
      reason: 'Pattern Clash: Outfits cannot mix multiple patterned pieces unless they feature the exact same pattern colorway.'
    };
  }
  const shapeEval = evaluateShapeHarmony(
    top?.shape || onePiece?.shape,
    bottom?.shape,
    outerwear?.shape
  );

  let finishScore = 40;
  if (shoes) finishScore += 30;
  if (bag) finishScore += 15;
  if (accessory || outerwear) finishScore += 15;

  const overallScore = Math.round(
    colorEval.score * 0.4 + shapeEval.score * 0.35 + finishScore * 0.25
  );

  return {
    id: `custom-outfit-${Date.now()}`,
    name: top && bottom 
      ? `${top.name} + ${bottom.name}` 
      : onePiece 
      ? onePiece.name 
      : 'Custom Outfit Look',
    occasion: top?.occasions[0] || bottom?.occasions[0] || 'Work',
    top,
    bottom,
    onePiece,
    outerwear,
    shoes,
    bag,
    accessory,
    colorStory: {
      primaryColor,
      pairingColor,
      isRuleMatched: colorEval.isMatch,
      ruleDescription: colorEval.reason,
      score: colorEval.score,
    },
    shapeHarmony: {
      silhouetteDescription: shapeEval.description,
      isBalanced: shapeEval.isBalanced,
      score: shapeEval.score,
    },
    finishCompleteness: {
      hasShoes: !!shoes,
      hasBag: !!bag,
      hasFinishingDetails: !!(accessory || outerwear),
      score: finishScore,
    },
    overallScore,
  };
}
