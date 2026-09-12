"use client";

import React, { useState } from 'react';
import { WardrobeItem, FormulaColor } from '@/lib/types';
import { EVERYDAY_COLOR_CHEAT_SHEET, COLOR_CONFIG, UNIVERSAL_NEUTRALS } from '@/lib/style-formula-rules';
import { BookOpen, Sparkles, Layers, ShieldCheck, Palette, ArrowRight } from 'lucide-react';

interface ReferenceViewProps {
  items: WardrobeItem[];
  onSelectColorFilter: (color: FormulaColor) => void;
}

export const ReferenceView: React.FC<ReferenceViewProps> = ({
  items,
  onSelectColorFilter,
}) => {
  const [selectedMainColor, setSelectedMainColor] = useState<string>('Red');

  const mainColors = Object.keys(EVERYDAY_COLOR_CHEAT_SHEET);
  const activeRule = EVERYDAY_COLOR_CHEAT_SHEET[selectedMainColor];
  const activeColorInfo = COLOR_CONFIG[selectedMainColor as FormulaColor];

  // Count items user owns in this color
  const userItemsInColor = items.filter((i) => i.primaryColor === selectedMainColor);

  return (
    <div className="space-y-4 px-4 py-3 pb-24">
      {/* Editorial Guide Header */}
      <div className="p-5 rounded-3xl bg-white border border-editorial-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-editorial-100 text-editorial-800">
            Style Formula Reference
          </span>
        </div>
        <h2 className="text-lg font-serif font-bold text-editorial-900 leading-tight">
          The Everyday Color Pairing Cheat Sheet
        </h2>
        <p className="text-xs text-editorial-600 leading-relaxed">
          Choose your main color, then use one of these easy pairings to build a polished everyday outfit.
        </p>
      </div>

      {/* Main Colors Selector Swatches */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {mainColors.map((colorName) => {
          const isSelected = selectedMainColor === colorName;
          const info = COLOR_CONFIG[colorName as FormulaColor];
          const ownedCount = items.filter((i) => i.primaryColor === colorName).length;

          return (
            <button
              key={colorName}
              onClick={() => setSelectedMainColor(colorName)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-editorial-900 text-editorial-50 border-editorial-900 shadow-md scale-105'
                  : 'bg-white text-editorial-700 border-editorial-200 hover:border-editorial-300'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: info?.hex }}
              />
              <span>{colorName}</span>
              {ownedCount > 0 && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-editorial-100 text-editorial-700'
                  }`}
                >
                  {ownedCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Color Pairing Details Card */}
      {activeRule && (
        <div className="p-5 rounded-3xl bg-white border border-editorial-200 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-editorial-100 pb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full border border-black/10 shadow-xs flex items-center justify-center font-bold text-xs"
                style={{
                  backgroundColor: activeColorInfo.hex,
                  color: activeColorInfo.textDark ? '#000' : '#fff',
                }}
              >
                {selectedMainColor.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-editorial-500">
                  Main Base Color
                </span>
                <h3 className="text-base font-serif font-bold text-editorial-900">
                  {selectedMainColor}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-editorial-500 font-bold block">
                Vibe & Mood
              </span>
              <span className="text-xs font-serif font-bold text-editorial-900">
                {activeRule.mood}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-editorial-700 block mb-2">
              PAIR IT WITH (From Guide):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {activeRule.pairings.map((pairing) => {
                const pairCol = COLOR_CONFIG[pairing];
                const matchingOwned = items.filter((i) => i.primaryColor === pairing);

                return (
                  <div
                    key={pairing}
                    className="p-3 rounded-2xl bg-editorial-50 border border-editorial-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs shrink-0"
                        style={{ backgroundColor: pairCol?.hex }}
                      />
                      <span className="text-xs font-bold text-editorial-900">
                        {pairing}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        matchingOwned.length > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-editorial-200 text-editorial-600'
                      }`}
                    >
                      {matchingOwned.length} in closet
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-editorial-600 bg-editorial-50 p-3 rounded-2xl leading-relaxed italic border border-editorial-200/50">
            "{activeRule.description}"
          </p>

          <button
            onClick={() => onSelectColorFilter(selectedMainColor as FormulaColor)}
            className="w-full py-2.5 rounded-2xl bg-editorial-900 text-editorial-50 text-xs font-bold hover:bg-editorial-800 transition flex items-center justify-center gap-1.5 active:scale-98"
          >
            <span>View {userItemsInColor.length} Closet Items in {selectedMainColor}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* The Full System: C + S + F Educational Card (Page 2 & 3 of Guide) */}
      <div className="p-5 rounded-3xl bg-white border border-editorial-200 shadow-xs space-y-4">
        <div className="border-b border-editorial-100 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-500">
            The Core Method
          </span>
          <h3 className="text-base font-serif font-bold text-editorial-900">
            One Repeatable Method: Color + Shape + Finish
          </h3>
          <p className="text-xs text-editorial-600 mt-0.5">
            "The goal is not to own more clothes. It is to know what to do with the clothes you already have."
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* C */}
          <div className="p-3.5 rounded-2xl bg-editorial-50 border border-editorial-200/70 space-y-1">
            <span className="w-6 h-6 rounded-full bg-editorial-900 text-editorial-50 text-xs font-bold flex items-center justify-center mb-1">
              C
            </span>
            <h4 className="text-xs font-serif font-bold text-editorial-900">
              COLOR
            </h4>
            <p className="text-[11px] text-editorial-600 leading-snug">
              Choose a connected color story using dependable pairings, neutrals, and accents.
            </p>
          </div>

          {/* S */}
          <div className="p-3.5 rounded-2xl bg-editorial-50 border border-editorial-200/70 space-y-1">
            <span className="w-6 h-6 rounded-full bg-editorial-900 text-editorial-50 text-xs font-bold flex items-center justify-center mb-1">
              S
            </span>
            <h4 className="text-xs font-serif font-bold text-editorial-900">
              SHAPE
            </h4>
            <p className="text-[11px] text-editorial-600 leading-snug">
              Balance volume, length, structure, and visual weight so the silhouette feels intentional.
            </p>
          </div>

          {/* F */}
          <div className="p-3.5 rounded-2xl bg-editorial-50 border border-editorial-200/70 space-y-1">
            <span className="w-6 h-6 rounded-full bg-editorial-900 text-editorial-50 text-xs font-bold flex items-center justify-center mb-1">
              F
            </span>
            <h4 className="text-xs font-serif font-bold text-editorial-900">
              FINISH
            </h4>
            <p className="text-[11px] text-editorial-600 leading-snug">
              Use shoes, bags, jewelry, texture, and layers to make the look feel complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
