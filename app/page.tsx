"use client";

import React, { useState, useEffect } from 'react';
import { WardrobeItem, OutfitFormula, FormulaColor } from '@/lib/types';
import { db, ensureInitialWardrobe, resetToDemoWardrobe } from '@/lib/db';
import { Header } from '@/components/navigation/Header';
import { BottomNav, TabType } from '@/components/navigation/BottomNav';
import { ClosetView } from '@/components/closet/ClosetView';
import { AssistantView } from '@/components/assistant/AssistantView';
import { CanvasView } from '@/components/canvas/CanvasView';
import { GapAnalyzerView } from '@/components/gaps/GapAnalyzerView';
import { ReferenceView } from '@/components/reference/ReferenceView';
import { OutfitChecklistModal } from '@/components/assistant/OutfitChecklistModal';
import { BackupModal } from '@/components/backup/BackupModal';
import { analyzeWardrobeGaps } from '@/lib/gap-analyzer';

import { SEED_WARDROBE_ITEMS } from '@/lib/seed-data';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('closet');
  const [items, setItems] = useState<WardrobeItem[]>(SEED_WARDROBE_ITEMS);
  const [savedOutfits, setSavedOutfits] = useState<OutfitFormula[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cross-view state
  const [anchorItem, setAnchorItem] = useState<WardrobeItem | null>(null);
  const [canvasOutfit, setCanvasOutfit] = useState<OutfitFormula | null>(null);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Load initial items from IndexedDB
  const refreshData = async () => {
    try {
      if (typeof window !== 'undefined') {
        const loadedItems = await ensureInitialWardrobe();
        if (loadedItems && loadedItems.length > 0) {
          setItems(loadedItems);
        }
        const loadedSaved = await db.savedOutfits.toArray();
        setSavedOutfits(loadedSaved);
      }
    } catch (err) {
      console.error('Database initialization error:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Add Item Handler
  const handleAddItem = async (newItemData: Omit<WardrobeItem, 'id' | 'createdAt' | 'timesWorn'>) => {
    const fullItem: WardrobeItem = {
      ...newItemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      timesWorn: 0,
    };

    await db.wardrobeItems.add(fullItem);
    setItems((prev) => [fullItem, ...prev]);
  };

  // Delete Item Handler
  const handleDeleteItem = async (id: string) => {
    await db.wardrobeItems.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Toggle Favorite
  const handleToggleFavorite = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const updated = { ...item, favorite: !item.favorite };
    await db.wardrobeItems.update(id, { favorite: updated.favorite });
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };

  // Log Wear
  const handleLogWear = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const updated = {
      ...item,
      timesWorn: (item.timesWorn || 0) + 1,
      lastWorn: new Date().toISOString(),
    };
    await db.wardrobeItems.update(id, {
      timesWorn: updated.timesWorn,
      lastWorn: updated.lastWorn,
    });
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };

  // Save Outfit to Lookbook
  const handleSaveOutfit = async (outfit: OutfitFormula) => {
    const isAlreadySaved = savedOutfits.some((s) => s.id === outfit.id);
    if (isAlreadySaved) {
      await db.savedOutfits.delete(outfit.id);
      setSavedOutfits((prev) => prev.filter((s) => s.id !== outfit.id));
    } else {
      const outfitToSave: OutfitFormula = {
        ...outfit,
        isSaved: true,
        createdAt: new Date().toISOString(),
      };
      await db.savedOutfits.put(outfitToSave);
      setSavedOutfits((prev) => [outfitToSave, ...prev]);
    }
  };

  // Reset to Demo Sample Wardrobe
  const handleResetDemo = async () => {
    if (confirm('Reset wardrobe back to the curated sample capsule collection?')) {
      await resetToDemoWardrobe();
      const loaded = await db.wardrobeItems.toArray();
      setItems(loaded);
      setSavedOutfits([]);
    }
  };

  // Build Outfits Around a specific piece
  const handleBuildOutfitAround = (item: WardrobeItem) => {
    setAnchorItem(item);
    setActiveTab('assistant');
  };

  // Open Canvas with Outfit
  const handleOpenCanvasWithOutfit = (outfit: OutfitFormula) => {
    setCanvasOutfit(outfit);
    setActiveTab('canvas');
  };

  // Filter closet from Reference view
  const handleSelectColorFilter = (color: FormulaColor) => {
    setActiveTab('closet');
  };

  // Gaps count
  const gaps = analyzeWardrobeGaps(items);

  return (
    <div className="min-h-screen flex flex-col bg-editorial-50">
      {/* Sticky Top Header */}
      <Header
        activeTab={activeTab}
        itemCount={items.length}
        onResetDemo={handleResetDemo}
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main View Switcher */}
      <div className="flex-1">
        {activeTab === 'closet' && (
          <ClosetView
            items={items}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onToggleFavorite={handleToggleFavorite}
            onLogWear={handleLogWear}
            onBuildOutfitAround={handleBuildOutfitAround}
            onOpenBackup={() => setIsBackupOpen(true)}
          />
        )}

        {activeTab === 'assistant' && (
          <AssistantView
            items={items}
            savedOutfits={savedOutfits}
            onSaveOutfit={handleSaveOutfit}
            anchorItem={anchorItem}
            onClearAnchor={() => setAnchorItem(null)}
            onOpenCanvasWithOutfit={handleOpenCanvasWithOutfit}
          />
        )}

        {activeTab === 'canvas' && (
          <CanvasView
            items={items}
            currentOutfit={canvasOutfit}
            onSaveOutfit={handleSaveOutfit}
            onSetCurrentOutfit={setCanvasOutfit}
          />
        )}

        {activeTab === 'gaps' && (
          <GapAnalyzerView
            items={items}
            onOpenUploadWithPreset={(preset) => {
              setActiveTab('closet');
            }}
          />
        )}

        {activeTab === 'reference' && (
          <ReferenceView
            items={items}
            onSelectColorFilter={handleSelectColorFilter}
          />
        )}
      </div>

      {/* 3-Step Daily Check Modal */}
      <OutfitChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
      />

      {/* Wardrobe Repository Backup / Download Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        totalItems={items.length}
        totalOutfits={savedOutfits.length}
        onRefreshData={refreshData}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        gapsCount={gaps.length}
      />
    </div>
  );
}
