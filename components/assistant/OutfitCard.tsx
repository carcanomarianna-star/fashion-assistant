"use client";

import React from 'react';
import { OutfitFormula } from '@/lib/types';
import { COLOR_CONFIG } from '@/lib/style-formula-rules';
import { Sparkles, CheckCircle2, Bookmark, Heart, Calendar } from 'lucide-react';

interface OutfitCardProps {
  outfit: OutfitFormula;
  onSaveOutfit?: (outfit: OutfitFormula) => void;
  isSaved?: boolean;
  onSelect?: (outfit: OutfitFormula) => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({
  outfit,
  onSaveOutfit,
  isSaved = false,
  onSelect,
}) => {
  const items = [
    outfit.outerwear,
    outfit.top,
    outfit.onePiece,
    outfit.bottom,
    outfit.shoes,
    outfit.bag,
    outfit.accessory,
  ].filter(Boolean);

  const primaryColInfo = COLOR_CONFIG[outfit.colorStory.primaryColor];
  const pairingColInfo = COLOR_CONFIG[outfit.colorStory.pairingColor];

  return (
    <div
      onClick={() => onSelect?.(outfit)}
      className="glass-card rounded-3xl p-4 border border-editorial-200 shadow-sm hover:shadow-md transition-all duration-300 space-y-3.5 cursor-pointer"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-editorial-900 text-editorial-50 text-[10px] font-bold uppercase tracking-wider">
            {outfit.occasion}
          </span>
          <span className="text-xs font-serif font-bold text-editorial-900">
            {outfit.overallScore}% Formula Match
          </span>
        </div>

        {onSaveOutfit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSaveOutfit(outfit);
            }}
            className={`p-2 rounded-full transition active:scale-90 ${
              isSaved
                ? 'bg-formula-red text-white'
                : 'bg-editorial-100 text-editorial-600 hover:bg-editorial-200'
            }`}
            title={isSaved ? 'Saved to Lookbook' : 'Save to Lookbook'}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Visual Flat-Lay Canvas Collage */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 bg-editorial-100/50 rounded-2xl border border-editorial-200/50">
        {outfit.top && (
          <div className="flex flex-col items-center bg-white rounded-xl p-1.5 border border-editorial-200/60">
            <div className="w-14 h-14 relative flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outfit.top.imageUrl} alt={outfit.top.name} className="max-h-full max-w-full object-contain" />
            </div>
            <span className="text-[9px] font-bold text-editorial-700 mt-1 truncate max-w-full">
              {outfit.top.subcategory}
            </span>
          </div>
        )}

        {outfit.onePiece && (
          <div className="flex flex-col items-center bg-white rounded-xl p-1.5 border border-editorial-200/60">
            <div className="w-14 h-14 relative flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outfit.onePiece.imageUrl} alt={outfit.onePiece.name} className="max-h-full max-w-full object-contain" />
            </div>
            <span className="text-[9px] font-bold text-editorial-700 mt-1 truncate max-w-full">
              {outfit.onePiece.subcategory}
            </span>
          </div>
        )}

        {outfit.bottom && (
          <div className="flex flex-col items-center bg-white rounded-xl p-1.5 border border-editorial-200/60">
            <div className="w-14 h-14 relative flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outfit.bottom.imageUrl} alt={outfit.bottom.name} className="max-h-full max-w-full object-contain" />
            </div>
            <span className="text-[9px] font-bold text-editorial-700 mt-1 truncate max-w-full">
              {outfit.bottom.subcategory}
            </span>
          </div>
        )}

        {outfit.outerwear && (
          <div className="flex flex-col items-center bg-white rounded-xl p-1.5 border border-editorial-200/60">
            <div className="w-14 h-14 relative flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outfit.outerwear.imageUrl} alt={outfit.outerwear.name} className="max-h-full max-w-full object-contain" />
            </div>
            <span className="text-[9px] font-bold text-editorial-700 mt-1 truncate max-w-full">
              {outfit.outerwear.subcategory}
            </span>
          </div>
        )}

        {outfit.shoes && (
          <div className="flex flex-col items-center bg-white rounded-xl p-1.5 border border-editorial-200/60">
            <div className="w-14 h-14 relative flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outfit.shoes.imageUrl} alt={outfit.shoes.name} className="max-h-full max-w-full object-contain" />
            </div>
            <span className="text-[9px] font-bold text-editorial-700 mt-1 truncate max-w-full">
              {outfit.shoes.subcategory}
            </span>
          </div>
        )}

        {outfit.bag && (
          <div className="flex flex-col items-center bg-white rounded-xl p-1.5 border border-editorial-200/60">
            <div className="w-14 h-14 relative flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outfit.bag.imageUrl} alt={outfit.bag.name} className="max-h-full max-w-full object-contain" />
            </div>
            <span className="text-[9px] font-bold text-editorial-700 mt-1 truncate max-w-full">
              {outfit.bag.subcategory}
            </span>
          </div>
        )}
      </div>

      {/* C + S + F Breakdown Section */}
      <div className="space-y-2 pt-1">
        {/* Color (C) */}
        <div className="flex items-start gap-2 p-2 rounded-xl bg-white/80 border border-editorial-100 text-xs">
          <span className="font-bold text-[10px] text-editorial-900 bg-editorial-200 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">
            C • Color
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: primaryColInfo?.hex }} />
              <span className="font-semibold text-editorial-800">{outfit.colorStory.primaryColor}</span>
              <span className="text-editorial-400 font-serif">+</span>
              <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: pairingColInfo?.hex }} />
              <span className="font-semibold text-editorial-800">{outfit.colorStory.pairingColor}</span>
            </div>
            <p className="text-[11px] text-editorial-600 mt-0.5 font-medium leading-snug">
              {outfit.colorStory.ruleDescription}
            </p>
          </div>
        </div>

        {/* Shape (S) */}
        <div className="flex items-start gap-2 p-2 rounded-xl bg-white/80 border border-editorial-100 text-xs">
          <span className="font-bold text-[10px] text-editorial-900 bg-editorial-200 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">
            S • Shape
          </span>
          <p className="text-[11px] text-editorial-600 font-medium leading-snug">
            {outfit.shapeHarmony.silhouetteDescription}
          </p>
        </div>

        {/* Finish (F) */}
        <div className="flex items-center justify-between px-2 text-[10px] text-editorial-500 font-semibold">
          <span>Finish: {outfit.shoes ? outfit.shoes.subcategory : 'Shoes'} • {outfit.bag ? outfit.bag.subcategory : 'Bag'}</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            {outfit.finishCompleteness.score}% Complete
          </span>
        </div>
      </div>
    </div>
  );
};
