import Dexie, { Table } from 'dexie';
import { WardrobeItem, OutfitFormula } from './types';
import { SEED_WARDROBE_ITEMS } from './seed-data';

export class FashionDatabase extends Dexie {
  wardrobeItems!: Table<WardrobeItem, string>;
  savedOutfits!: Table<OutfitFormula, string>;

  constructor() {
    super('StyleFormulaDB');
    this.version(1).stores({
      wardrobeItems: 'id, category, subcategory, primaryColor, shape, finishTexture, favorite, timesWorn, createdAt',
      savedOutfits: 'id, name, occasion, overallScore, createdAt'
    });
  }
}

export const db = new FashionDatabase();

/**
 * Initialize database - returns current stored items in IndexedDB
 */
export async function ensureInitialWardrobe(): Promise<WardrobeItem[]> {
  try {
    return await db.wardrobeItems.toArray();
  } catch (error) {
    console.error('Failed to access wardrobe DB:', error);
    return [];
  }
}

/**
 * Load sample seed items into database
 */
export async function resetToDemoWardrobe(): Promise<void> {
  await db.wardrobeItems.clear();
  await db.savedOutfits.clear();
  await db.wardrobeItems.bulkAdd(SEED_WARDROBE_ITEMS);
}

/**
 * Completely clear wardrobe items from database
 */
export async function clearAllWardrobeItems(): Promise<void> {
  await db.wardrobeItems.clear();
  await db.savedOutfits.clear();
}
