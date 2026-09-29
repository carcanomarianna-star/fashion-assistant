import { WardrobeItem, OutfitFormula, Occasion, FormulaColor } from './types';
import { evaluateColorPairing, evaluateShapeHarmony, evaluateTextureHarmony, COLOR_CONFIG } from './style-formula-rules';

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
  const outerwears = wardrobe.filter(
    i => i.category === 'Outerwear' || i.subcategory === 'Blazer' || i.subcategory === 'Structured Blazer'
  );
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

  const isOuterwearAnchor = (item?: WardrobeItem) => {
    if (!item) return false;
    return item.category === 'Outerwear' || item.subcategory === 'Blazer' || item.subcategory === 'Structured Blazer';
  };

  // 1. Two-Piece Outfits (Top + Bottom)
  for (const top of tops) {
    if (anchorItem && anchorItem.category === 'Tops' && !isOuterwearAnchor(anchorItem) && anchorItem.id !== top.id) continue;
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

      // Candidate outerwears for this top+bottom pair
      const validOuterwears = anchorItem && isOuterwearAnchor(anchorItem)
        ? [anchorItem]
        : outerwears.filter(o => o.id !== top.id && fitsOccasion(o) && evaluateColorPairing(o.primaryColor, top.primaryColor, o.patternColors, top.patternColors).isMatch);

      const outerwearOptions: (WardrobeItem | undefined)[] = anchorItem && isOuterwearAnchor(anchorItem)
        ? [anchorItem]
        : [undefined, ...validOuterwears];

      for (const matchingOuter of outerwearOptions) {
        // Pick matching shoes dynamically based on highest color harmony with top/bottom or anchor
        const candidateShoes = (anchorItem && anchorItem.category === 'Shoes')
          ? [anchorItem]
          : shoes.filter(s => fitsOccasion(s));

        const scoredShoes = candidateShoes
          .map(s => {
            const evalBottom = evaluateColorPairing(s.primaryColor, bottom.primaryColor, s.patternColors, bottom.patternColors);
            const evalTop = evaluateColorPairing(s.primaryColor, top.primaryColor, s.patternColors, top.patternColors);
            const score = Math.max(evalBottom.score, evalTop.score);
            return { shoe: s, score };
          })
          .filter(s => s.shoe.id === anchorItem?.id || s.score >= 60)
          .sort((a, b) => b.score - a.score);

        const matchingShoes = scoredShoes.find(s => hasValidPatternCombination([top, bottom, matchingOuter, s.shoe]))?.shoe;

        // Pick matching bag dynamically based on highest color harmony or anchor
        const candidateBags = (anchorItem && anchorItem.category === 'Bags')
          ? [anchorItem]
          : bags.filter(b => fitsOccasion(b));

        const scoredBags = candidateBags
          .map(b => {
            const evalTop = evaluateColorPairing(b.primaryColor, top.primaryColor, b.patternColors, top.patternColors);
            const evalBottom = evaluateColorPairing(b.primaryColor, bottom.primaryColor, b.patternColors, bottom.patternColors);
            const score = Math.max(evalTop.score, evalBottom.score);
            return { bag: b, score };
          })
          .filter(b => b.bag.id === anchorItem?.id || b.score >= 60)
          .sort((a, b) => b.score - a.score);

        const matchingBag = scoredBags.find(b => hasValidPatternCombination([top, bottom, matchingOuter, matchingShoes, b.bag]))?.bag;

        const matchingAccessory = accessories.find(a => fitsOccasion(a));

        // Validate pattern combination across all items in ensemble
        if (!hasValidPatternCombination([top, bottom, matchingOuter, matchingShoes, matchingBag])) {
          continue;
        }

        // Evaluate Texture Harmony (The 'F' in CSF: Reject competing heavy textures like Knit top + Corduroy bottom)
        const textureEval = evaluateTextureHarmony(top.finishTexture, bottom.finishTexture, matchingOuter?.finishTexture);
        if (!textureEval.isBalanced) {
          continue;
        }

        // Calculate Finish Completeness & Texture Score (The 'F' in CSF)
        let completenessScore = 40;
        if (matchingShoes) completenessScore += 30;
        if (matchingBag) completenessScore += 15;
        if (matchingAccessory || matchingOuter) completenessScore += 15;

        const finishScore = Math.round(completenessScore * 0.5 + textureEval.score * 0.5);

        // Overall formula score (Weighted: Color 40%, Shape 35%, Finish 25%)
        const overallScore = Math.round(
          colorEval.score * 0.4 + shapeEval.score * 0.35 + finishScore * 0.25
        );

        if (overallScore >= 65) {
          formulas.push({
            id: `formula-${top.id}-${bottom.id}-${matchingOuter?.id || 'none'}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: matchingOuter 
              ? `${matchingOuter.primaryColor} ${matchingOuter.subcategory} + ${top.primaryColor} ${top.subcategory} + ${bottom.primaryColor} ${bottom.subcategory}`
              : `${top.primaryColor} ${top.subcategory} + ${bottom.primaryColor} ${bottom.subcategory}`,
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
              textureDescription: textureEval.description,
              score: finishScore,
            },
            overallScore,
          });
        }
      }
    }
  }

  // 2. One-Piece Outfits (Dresses / Jumpsuits)
  for (const dress of onePieces) {
    if (anchorItem && anchorItem.id !== dress.id) continue;
    if (!fitsOccasion(dress)) continue;
    if (focusColor && !matchesFocus(dress)) continue;

    const validOuterwears = anchorItem && isOuterwearAnchor(anchorItem)
      ? [anchorItem]
      : outerwears.filter(o => o.id !== dress.id && fitsOccasion(o) && evaluateColorPairing(o.primaryColor, dress.primaryColor, o.patternColors, dress.patternColors).isMatch);

    const outerwearOptions: (WardrobeItem | undefined)[] = anchorItem && isOuterwearAnchor(anchorItem)
      ? [anchorItem]
      : [undefined, ...validOuterwears];

    for (const matchingOuter of outerwearOptions) {
      const candidateShoes = (anchorItem && anchorItem.category === 'Shoes')
        ? [anchorItem]
        : shoes.filter(s => fitsOccasion(s));

      const scoredShoes = candidateShoes
        .map(s => ({ shoe: s, score: evaluateColorPairing(s.primaryColor, dress.primaryColor, s.patternColors, dress.patternColors).score }))
        .filter(s => s.shoe.id === anchorItem?.id || s.score >= 60)
        .sort((a, b) => b.score - a.score);

      const matchingShoes = scoredShoes.find(s => hasValidPatternCombination([dress, matchingOuter, s.shoe]))?.shoe;

      const candidateBags = (anchorItem && anchorItem.category === 'Bags')
        ? [anchorItem]
        : bags.filter(b => fitsOccasion(b));

      const scoredBags = candidateBags
        .map(b => ({ bag: b, score: evaluateColorPairing(b.primaryColor, dress.primaryColor, b.patternColors, dress.patternColors).score }))
        .filter(b => b.bag.id === anchorItem?.id || b.score >= 60)
        .sort((a, b) => b.score - a.score);

      const matchingBag = scoredBags.find(b => hasValidPatternCombination([dress, matchingOuter, matchingShoes, b.bag]))?.bag;

      const matchingAccessory = accessories.find(a => fitsOccasion(a));

      if (!hasValidPatternCombination([dress, matchingOuter, matchingShoes, matchingBag])) {
        continue;
      }

      const textureEval = evaluateTextureHarmony(dress.finishTexture, matchingOuter?.finishTexture);
      if (!textureEval.isBalanced) {
        continue;
      }

      const colorEval = matchingOuter 
        ? evaluateColorPairing(dress.primaryColor, matchingOuter.primaryColor, dress.patternColors, matchingOuter.patternColors)
        : { isMatch: true, score: 90, reason: `Statement ${dress.primaryColor} base grounded with monochrome or neutral finishing pieces.` };

      const shapeEval = evaluateShapeHarmony(dress.shape, undefined, matchingOuter?.shape);

      let completenessScore = 45;
      if (matchingShoes) completenessScore += 25;
      if (matchingBag) completenessScore += 15;
      if (matchingAccessory || matchingOuter) completenessScore += 15;

      const finishScore = Math.round(completenessScore * 0.5 + textureEval.score * 0.5);

      const overallScore = Math.round(
        colorEval.score * 0.4 + shapeEval.score * 0.35 + finishScore * 0.25
      );

      formulas.push({
        id: `formula-dress-${dress.id}-${matchingOuter?.id || 'none'}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: matchingOuter 
          ? `${matchingOuter.primaryColor} ${matchingOuter.subcategory} + ${dress.primaryColor} ${dress.subcategory}`
          : `${dress.primaryColor} ${dress.subcategory} Ensemble`,
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
          textureDescription: textureEval.description,
          score: finishScore,
        },
        overallScore,
      });
    }
  }

  // 3. Deduplicate and group formulas by base outfit core (top.id + bottom.id or onePiece.id)
  // to prevent repetitive outputs showing identical top+bottom pairs with minor outerwear swaps.
  const baseOutfitMap = new Map<string, OutfitFormula[]>();

  for (const formula of formulas) {
    const baseKey = formula.onePiece 
      ? `dress-${formula.onePiece.id}`
      : `twopiece-${formula.top?.id}-${formula.bottom?.id}`;

    if (!baseOutfitMap.has(baseKey)) {
      baseOutfitMap.set(baseKey, []);
    }
    baseOutfitMap.get(baseKey)!.push(formula);
  }

  // Pick top 1 best scoring formula per base combo (or top 2 if outerwear is specifically anchored)
  const maxPerBaseKey = (anchorItem && isOuterwearAnchor(anchorItem)) ? 2 : 1;

  const candidateFormulas: OutfitFormula[] = [];
  for (const [, groupFormulas] of baseOutfitMap.entries()) {
    groupFormulas.sort((a, b) => b.overallScore - a.overallScore);
    candidateFormulas.push(...groupFormulas.slice(0, maxPerBaseKey));
  }

  // Sort candidates by overall score descending
  candidateFormulas.sort((a, b) => b.overallScore - a.overallScore);

  // 4. Item Diversity Rotation: Prioritize formulas that rotate key clothing items (tops, bottoms, dresses)
  // so the Top 3 choices present distinct, non-repetitive wardrobe pieces.
  const finalFormulas: OutfitFormula[] = [];
  const usedTopIds = new Set<string>();
  const usedBottomIds = new Set<string>();
  const usedOnePieceIds = new Set<string>();

  // Pass 1: Pick formulas that introduce new core pieces
  for (const formula of candidateFormulas) {
    const topId = formula.top?.id;
    const bottomId = formula.bottom?.id;
    const dressId = formula.onePiece?.id;

    if (dressId) {
      if (!usedOnePieceIds.has(dressId)) {
        finalFormulas.push(formula);
        usedOnePieceIds.add(dressId);
      }
    } else if (topId && bottomId) {
      if (!usedTopIds.has(topId) || !usedBottomIds.has(bottomId)) {
        finalFormulas.push(formula);
        usedTopIds.add(topId);
        usedBottomIds.add(bottomId);
      }
    }

    if (finalFormulas.length >= limit) break;
  }

  // Pass 2: Fill remaining limit slots with remaining high-scoring candidate formulas
  if (finalFormulas.length < limit) {
    for (const formula of candidateFormulas) {
      if (!finalFormulas.some(f => f.id === formula.id)) {
        finalFormulas.push(formula);
      }
      if (finalFormulas.length >= limit) break;
    }
  }

  return finalFormulas;
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

  // Evaluate Texture Harmony across top/onePiece, bottom, outerwear
  const textureEval = evaluateTextureHarmony(
    top?.finishTexture || onePiece?.finishTexture,
    bottom?.finishTexture,
    outerwear?.finishTexture
  );

  let completenessScore = 40;
  if (shoes) completenessScore += 30;
  if (bag) completenessScore += 15;
  if (accessory || outerwear) completenessScore += 15;

  const finishScore = Math.round(completenessScore * 0.5 + textureEval.score * 0.5);

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
      textureDescription: textureEval.description,
      score: finishScore,
    },
    overallScore,
  };
}
