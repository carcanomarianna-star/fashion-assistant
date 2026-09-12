import { db } from './db';
import { WardrobeItem, OutfitFormula } from './types';

export interface WardrobeRepositoryBackup {
  version: string;
  exportedAt: string;
  app: string;
  stats: {
    totalItems: number;
    totalOutfits: number;
  };
  wardrobeItems: WardrobeItem[];
  savedOutfits: OutfitFormula[];
}

/**
 * Export the complete wardrobe repository including all photos, tags, wear history, and saved looks
 */
export async function exportWardrobeRepository(): Promise<{ filename: string; sizeBytes: number }> {
  const items = await db.wardrobeItems.toArray();
  const outfits = await db.savedOutfits.toArray();

  const backupData: WardrobeRepositoryBackup = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    app: 'Style Formula Wardrobe Assistant',
    stats: {
      totalItems: items.length,
      totalOutfits: outfits.length,
    },
    wardrobeItems: items,
    savedOutfits: outfits,
  };

  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateSlug = new Date().toISOString().split('T')[0];
  const filename = `style-formula-wardrobe-${dateSlug}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    filename,
    sizeBytes: blob.size,
  };
}

/**
 * Import a previously exported wardrobe repository file into IndexedDB
 */
export async function importWardrobeRepository(
  file: File,
  mode: 'merge' | 'replace' = 'merge'
): Promise<{ importedItems: number; importedOutfits: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const data: WardrobeRepositoryBackup = JSON.parse(text);

        if (!data.wardrobeItems || !Array.isArray(data.wardrobeItems)) {
          throw new Error('Invalid wardrobe backup file format.');
        }

        if (mode === 'replace') {
          await db.wardrobeItems.clear();
          await db.savedOutfits.clear();
        }

        if (data.wardrobeItems.length > 0) {
          await db.wardrobeItems.bulkPut(data.wardrobeItems);
        }

        if (data.savedOutfits && Array.isArray(data.savedOutfits) && data.savedOutfits.length > 0) {
          await db.savedOutfits.bulkPut(data.savedOutfits);
        }

        resolve({
          importedItems: data.wardrobeItems.length,
          importedOutfits: data.savedOutfits?.length || 0,
        });
      } catch (err) {
        console.error('Import failed:', err);
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read backup file.'));
    reader.readAsText(file);
  });
}
