"use client";

import React, { useState, useMemo } from 'react';
import { WardrobeItem, OutfitFormula, Occasion, FormulaColor } from '@/lib/types';
import { generateOutfitFormulas } from '@/lib/outfit-engine';
import { OutfitCard } from './OutfitCard';
import { COLOR_CONFIG } from '@/lib/style-formula-rules';
import { Sparkles, Bookmark, Filter, Wand2, X, AlertCircle } from 'lucide-react';

interface AssistantViewProps {
  items: WardrobeItem[];
  savedOutfits: OutfitFormula[];
  onSaveOutfit: (outfit: OutfitFormula) => void;
  anchorItem: WardrobeItem | null;
  onClearAnchor: () => void;
  onOpenCanvasWithOutfit: (outfit: OutfitFormula) => void;
}

const OCCASIONS: Occasion[] = ['Work', 'Weekends', 'Dinner', 'Travel', 'Events'];

export const AssistantView: React.FC<AssistantViewProps> = ({
  items,
  savedOutfits,
  onSaveOutfit,
  anchorItem,
  onClearAnchor,
  onOpenCanvasWithOutfit,
}) => {
  const [activeTab, setActiveTab] = useState<'generated' | 'saved'>('generated');
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | 'All'>('All');
  const [selectedFocusColor, setSelectedFocusColor] = useState<FormulaColor | 'All'>('All');

  // Generate outfit formulas
  const generatedFormulas = useMemo(() => {
    return generateOutfitFormulas(items, {
      occasion: selectedOccasion === 'All' ? undefined : selectedOccasion,
      focusColor: selectedFocusColor === 'All' ? undefined : selectedFocusColor,
      anchorItem: anchorItem || undefined,
      limit: 25,
    });
  }, [items, selectedOccasion, selectedFocusColor, anchorItem]);

  return (
    <div className="space-y-4 px-4 py-3 pb-20">
      {/* Anchor Item Banner (if triggered from closet) */}
      {anchorItem && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-editorial-900 text-editorial-50 shadow-md animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={anchorItem.imageUrl} alt={anchorItem.name} className="max-h-full max-w-full object-contain" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-editorial-300">
                Building Outfits Around
              </span>
              <h4 className="text-xs font-serif font-bold text-white line-clamp-1">
                {anchorItem.name} ({anchorItem.primaryColor})
              </h4>
            </div>
          </div>
          <button
            onClick={onClearAnchor}
            className="p-1.5 rounded-full hover:bg-white/20 text-editorial-300 hover:text-white transition"
            title="Clear Anchor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs: Generated vs Saved Lookbook */}
      <div className="flex items-center justify-between">
        <div className="flex p-1 rounded-2xl bg-editorial-200/70 p-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('generated')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'generated'
                ? 'bg-white text-editorial-900 shadow-sm'
                : 'text-editorial-600 hover:text-editorial-900'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-editorial-900" />
            <span>Formula Generator ({generatedFormulas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'saved'
                ? 'bg-white text-editorial-900 shadow-sm'
                : 'text-editorial-600 hover:text-editorial-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-editorial-900" />
            <span>Saved Lookbook ({savedOutfits.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'generated' ? (
        <>
          {/* Controls: Occasions & Focus Color */}
          <div className="p-3.5 rounded-2xl bg-white border border-editorial-200 shadow-xs space-y-3">
            {/* Occasions */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-editorial-500 block mb-1.5">
                Select Occasion (Guide Library):
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedOccasion('All')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedOccasion === 'All'
                      ? 'bg-editorial-900 text-white shadow-xs'
                      : 'bg-editorial-100 text-editorial-700 hover:bg-editorial-200'
                  }`}
                >
                  All Occasions
                </button>
                {OCCASIONS.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      selectedOccasion === occ
                        ? 'bg-editorial-900 text-white shadow-xs'
                        : 'bg-editorial-100 text-editorial-700 hover:bg-editorial-200'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Color */}
            <div className="pt-2 border-t border-editorial-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-editorial-500 block mb-1.5">
                Filter by Core Color:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedFocusColor('All')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedFocusColor === 'All'
                      ? 'bg-editorial-900 text-white'
                      : 'bg-editorial-100 text-editorial-700 hover:bg-editorial-200'
                  }`}
                >
                  All Colors
                </button>
                {(['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Brown', 'Camel', 'Navy'] as FormulaColor[]).map((col) => {
                  const info = COLOR_CONFIG[col];
                  const isSelected = selectedFocusColor === col;
                  return (
                    <button
                      key={col}
                      onClick={() => setSelectedFocusColor(isSelected ? 'All' : col)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap border transition ${
                        isSelected
                          ? 'border-editorial-900 bg-editorial-50 font-semibold shadow-xs'
                          : 'border-editorial-200 bg-white hover:bg-editorial-50'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: info.hex }} />
                      <span>{col}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Formulas Feed */}
          {generatedFormulas.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-editorial-600 font-medium px-1">
                <span>Ranked by C + S + F Harmony</span>
                <span>{generatedFormulas.length} Formulas Available</span>
              </div>

              {generatedFormulas.map((outfit) => {
                const isSaved = savedOutfits.some((s) => s.id === outfit.id);
                return (
                  <OutfitCard
                    key={outfit.id}
                    outfit={outfit}
                    onSaveOutfit={onSaveOutfit}
                    isSaved={isSaved}
                    onSelect={(selected) => onOpenCanvasWithOutfit(selected)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white/70 rounded-3xl border border-dashed border-editorial-300">
              <AlertCircle className="w-10 h-10 mx-auto text-editorial-400 mb-2" />
              <h3 className="text-base font-serif font-bold text-editorial-800">
                No matching combinations found
              </h3>
              <p className="text-xs text-editorial-500 max-w-xs mx-auto mt-1 mb-4">
                You might need additional pairing colors (e.g. Camel, Navy, or Denim) or more versatile tops/bottoms.
              </p>
              <button
                onClick={() => {
                  setSelectedOccasion('All');
                  setSelectedFocusColor('All');
                  onClearAnchor();
                }}
                className="px-4 py-2 rounded-xl bg-editorial-900 text-editorial-50 text-xs font-semibold hover:bg-editorial-800 transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      ) : (
        /* Saved Lookbook View */
        <div className="space-y-3">
          {savedOutfits.length > 0 ? (
            savedOutfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                onSaveOutfit={onSaveOutfit}
                isSaved={true}
                onSelect={(selected) => onOpenCanvasWithOutfit(selected)}
              />
            ))
          ) : (
            <div className="text-center py-16 px-4 bg-white/70 rounded-3xl border border-dashed border-editorial-300">
              <Bookmark className="w-10 h-10 mx-auto text-editorial-400 mb-2" />
              <h3 className="text-base font-serif font-bold text-editorial-800">
                Your Lookbook is Empty
              </h3>
              <p className="text-xs text-editorial-500 max-w-xs mx-auto mt-1">
                Browse generated formulas and tap the bookmark icon to save your favorite go-to outfits!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
