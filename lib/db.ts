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
 * Initialize database with seed items if completely empty
 */
export async function ensureInitialWardrobe(): Promise<WardrobeItem[]> {
  try {
    const count = await db.wardrobeItems.count();
    if (count === 0) {
      await db.wardrobeItems.bulkAdd(SEED_WARDROBE_ITEMS);
      return SEED_WARDROBE_ITEMS;
    }
    return await db.wardrobeItems.toArray();
  } catch (error) {
    console.error('Failed to initialize wardrobe DB:', error);
    return SEED_WARDROBE_ITEMS;
  }
}

/**
 * Reset database back to default seed wardrobe
 */
export async function resetToDemoWardrobe(): Promise<void> {
  await db.wardrobeItems.clear();
  await db.savedOutfits.clear();
  await db.wardrobeItems.bulkAdd(SEED_WARDROBE_ITEMS);
}
