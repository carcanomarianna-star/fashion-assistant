/**
 * Style Formula Core Types
 * Based on the Elevated Outfit Formula System: Color + Shape + Finish
 */

export type MainCategory = 
  | 'Tops' 
  | 'Bottoms' 
  | 'One-Piece' 
  | 'Outerwear' 
  | 'Shoes' 
  | 'Bags' 
  | 'Accessories';

export type SubCategory =
  // Tops
  | 'T-Shirt' | 'Blouse' | 'Knit / Sweater' | 'Button-Down Shirt' | 'Tank / Camisole' | 'Crop Top' | 'Blazer'
  // Bottoms
  | 'Tailored Trousers' | 'Jeans' | 'Wide-Leg Pants' | 'Midi / Maxi Skirt' | 'Mini Skirt' | 'Shorts'
  // One-Piece
  | 'Midi Dress' | 'Maxi Dress' | 'Mini Dress' | 'Jumpsuit'
  // Outerwear
  | 'Structured Blazer' | 'Trench Coat' | 'Cardigan' | 'Denim Jacket' | 'Leather Jacket' | 'Wool Coat'
  // Shoes
  | 'Loafers' | 'Sneakers' | 'Heels / Pumps' | 'Ankle Boots' | 'Tall Boots' | 'Sandals / Slides' | 'Flats'
  // Bags
  | 'Structured Tote' | 'Crossbody Bag' | 'Shoulder Bag' | 'Clutch' | 'Basket / Woven Bag'
  // Accessories
  | 'Leather Belt' | 'Statement Necklace' | 'Silk Scarf' | 'Earrings' | 'Sunglasses' | 'Watch / Bracelet' | 'Hat';

export type FormulaColor =
  // Main Guide Colors
  | 'Red'
  | 'Orange'
  | 'Yellow'
  | 'Green'
  | 'Blue'
  | 'Purple'
  | 'Pink'
  | 'Brown'
  // Complementary Guide Tones
  | 'Camel'
  | 'Navy'
  | 'Cream'
  | 'Emerald'
  | 'Cobalt'
  | 'Denim'
  | 'Tan'
  | 'Olive'
  | 'Lilac'
  | 'Gray'
  | 'Black'
  | 'White'
  | 'Burgundy'
  // Additional Tones & Patterns
  | 'Charcoal Gray'
  | 'Cerulean'
  | 'Pattern';

export type ShapeSilhouette =
  | 'Fitted'
  | 'Relaxed'
  | 'Wide-Leg'
  | 'Structured'
  | 'Fluid / Flowy'
  | 'Cropped'
  | 'Long / Maxi'
  | 'Layered';

export type FinishTexture =
  | 'Knit'
  | 'Leather'
  | 'Denim'
  | 'Silk / Satin'
  | 'Linen'
  | 'Wool'
  | 'Cotton'
  | 'Suede'
  | 'Corduroy'
  | 'Metallic / Gold'
  | 'Metallic / Silver';

export type Occasion =
  | 'Work'
  | 'Weekends'
  | 'Dinner'
  | 'Travel'
  | 'Events';

export type Season =
  | 'All Season'
  | 'Spring / Autumn'
  | 'Summer'
  | 'Winter';

export interface WardrobeItem {
  id: string;
  name: string;
  category: MainCategory;
  subcategory: SubCategory;
  primaryColor: FormulaColor;
  secondaryColor?: FormulaColor;
  patternColors?: FormulaColor[];
  shape: ShapeSilhouette;
  finishTexture: FinishTexture;
  occasions: Occasion[];
  seasons: Season[];
  imageUrl: string; // Base64 or Blob URL stored in IndexedDB
  brand?: string;
  notes?: string;
  favorite?: boolean;
  timesWorn: number;
  lastWorn?: string;
  createdAt: string;
}

export interface OutfitFormula {
  id: string;
  name: string;
  occasion: Occasion;
  top?: WardrobeItem;
  bottom?: WardrobeItem;
  onePiece?: WardrobeItem;
  outerwear?: WardrobeItem;
  shoes?: WardrobeItem;
  bag?: WardrobeItem;
  accessory?: WardrobeItem;
  
  // Scoring & Evaluation
  colorStory: {
    primaryColor: FormulaColor;
    pairingColor: FormulaColor;
    isRuleMatched: boolean;
    ruleDescription: string;
    score: number; // 0 - 100
  };
  shapeHarmony: {
    silhouetteDescription: string;
    isBalanced: boolean;
    score: number; // 0 - 100
  };
  finishCompleteness: {
    hasShoes: boolean;
    hasBag: boolean;
    hasFinishingDetails: boolean;
    score: number; // 0 - 100
  };
  overallScore: number; // 0 - 100
  notes?: string;
  isSaved?: boolean;
  createdAt?: string;
}

export interface ColorPairingRule {
  mainColor: FormulaColor;
  pairings: FormulaColor[];
  description: string;
  mood: string;
}

export interface WardrobeGap {
  id: string;
  type: 'color_bridge' | 'shape_balance' | 'finishing_piece' | 'occasion_staple';
  title: string;
  description: string;
  impactScore: number; // Potential new outfits unlocked
  recommendedCategory: MainCategory;
  recommendedSubcategory: SubCategory;
  recommendedColor: FormulaColor;
  recommendedShape: ShapeSilhouette;
  recommendedFinish: FinishTexture;
  recommendedOccasion: Occasion;
  whyNeeded: string;
  unlockedOutfitExamples: string[];
}
