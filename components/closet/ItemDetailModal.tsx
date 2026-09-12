"use client";

import React from 'react';
import { WardrobeItem } from '@/lib/types';
import { COLOR_CONFIG, EVERYDAY_COLOR_CHEAT_SHEET } from '@/lib/style-formula-rules';
import { X, Heart, Trash2, PlusCircle, CheckCircle2, Sparkles, Shirt, Edit3 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ItemDetailModalProps {
  item: WardrobeItem | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onLogWear: (id: string) => void;
  onDelete: (id: string) => void;
  onBuildOutfitAround: (item: WardrobeItem) => void;
  onEditItem?: (item: WardrobeItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onToggleFavorite,
  onLogWear,
  onDelete,
  onBuildOutfitAround,
  onEditItem,
}) => {
  if (!item) return null;

  const colorInfo = COLOR_CONFIG[item.primaryColor] || { hex: '#E5E7EB', textDark: true };
  const cheatSheetRule = EVERYDAY_COLOR_CHEAT_SHEET[item.primaryColor];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-editorial-50 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-editorial-200 my-8">
        {/* Top Header */}
        <div className="relative aspect-square w-full bg-gradient-to-b from-white/90 to-editorial-100/60 p-6 flex items-center justify-center">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-editorial-200 flex items-center justify-center text-editorial-500 font-serif text-3xl">
              {item.name.charAt(0)}
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md text-editorial-700 hover:text-editorial-900 transition shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {onEditItem && (
            <button
              onClick={() => {
                onClose();
                onEditItem(item);
              }}
              className="absolute top-4 right-14 p-2 rounded-full bg-white/80 backdrop-blur-md text-editorial-700 hover:text-editorial-900 transition shadow-sm"
              title="Edit Garment Details & Photo"
            >
              <Edit3 className="w-5 h-5 text-editorial-800" />
            </button>
          )}

          <button
            onClick={() => onToggleFavorite(item.id)}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/80 backdrop-blur-md text-editorial-700 hover:text-formula-red transition shadow-sm"
          >
            <Heart
              className={`w-5 h-5 ${
                item.favorite ? 'fill-formula-red text-formula-red' : 'text-editorial-400'
              }`}
            />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[55vh] overflow-y-auto bg-editorial-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-editorial-200 text-editorial-800">
                {item.category} • {item.subcategory}
              </span>
              {item.brand && (
                <span className="text-xs text-editorial-500 font-medium">
                  {item.brand}
                </span>
              )}
            </div>
            <h2 className="text-lg font-serif font-bold text-editorial-900 mt-1">
              {item.name}
            </h2>
          </div>

          {/* Color + Shape + Finish Formula Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-editorial-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-editorial-500">
                Style Formula Breakdown
              </span>
              <span className="text-[10px] font-semibold text-editorial-700 bg-editorial-100 px-2 py-0.5 rounded-md">
                C + S + F
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-editorial-50 border border-editorial-200/60">
                <span className="text-[9px] font-bold text-editorial-500 uppercase block">
                  Color (C)
                </span>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10"
                    style={{ backgroundColor: colorInfo.hex }}
                  />
                  <span className="text-xs font-semibold text-editorial-900">
                    {item.primaryColor}
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-editorial-50 border border-editorial-200/60">
                <span className="text-[9px] font-bold text-editorial-500 uppercase block">
                  Shape (S)
                </span>
                <span className="text-xs font-semibold text-editorial-900 mt-1 block">
                  {item.shape}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-editorial-50 border border-editorial-200/60">
                <span className="text-[9px] font-bold text-editorial-500 uppercase block">
                  Finish (F)
                </span>
                <span className="text-xs font-semibold text-editorial-900 mt-1 block">
                  {item.finishTexture}
                </span>
              </div>
            </div>

            {/* Official Cheat Sheet Pairings */}
            {cheatSheetRule && (
              <div className="pt-2 border-t border-editorial-100">
                <span className="text-[10px] font-bold text-editorial-600 block mb-1">
                  Guide Pairing Colors for {item.primaryColor}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cheatSheetRule.pairings.map((pairing) => {
                    const pairColor = COLOR_CONFIG[pairing];
                    return (
                      <span
                        key={pairing}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-editorial-100 text-editorial-800"
                      >
                        <span
                          className="w-2 h-2 rounded-full border border-black/10"
                          style={{ backgroundColor: pairColor?.hex || '#ccc' }}
                        />
                        {pairing}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Occasions */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-editorial-500 block mb-1.5">
              Occasions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.occasions.map((occ) => (
                <span
                  key={occ}
                  className="px-2.5 py-1 text-xs rounded-lg font-medium bg-white border border-editorial-200 text-editorial-800"
                >
                  {occ}
                </span>
              ))}
            </div>
          </div>

          {/* Wear Tracker */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-editorial-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-editorial-500 block">
                Wear Tracker
              </span>
              <span className="text-xs font-semibold text-editorial-800">
                Worn {item.timesWorn} times • {formatDate(item.lastWorn)}
              </span>
            </div>
            <button
              onClick={() => onLogWear(item.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-editorial-100 hover:bg-editorial-200 text-editorial-800 text-xs font-semibold transition active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Log Wear</span>
            </button>
          </div>

          {item.notes && (
            <div className="p-3 rounded-2xl bg-white/70 border border-editorial-200">
              <span className="text-[10px] uppercase font-bold text-editorial-500 block mb-0.5">
                Notes
              </span>
              <p className="text-xs text-editorial-700 italic">
                "{item.notes}"
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                onBuildOutfitAround(item);
              }}
              className="w-full py-3 rounded-2xl bg-editorial-900 text-editorial-50 text-xs font-bold shadow-md hover:bg-editorial-800 transition active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Generate Outfits Around This Piece</span>
            </button>

            <button
              onClick={() => {
                if (confirm(`Remove "${item.name}" from your wardrobe?`)) {
                  onDelete(item.id);
                  onClose();
                }
              }}
              className="w-full py-2.5 rounded-2xl text-formula-red hover:bg-red-50 text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete from Wardrobe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
