"use client";

import React from 'react';
import { WardrobeItem } from '@/lib/types';
import { COLOR_CONFIG } from '@/lib/style-formula-rules';
import { Heart, Sparkles } from 'lucide-react';

interface ItemCardProps {
  item: WardrobeItem;
  onClick: (item: WardrobeItem) => void;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  isSelected?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onClick,
  onToggleFavorite,
  isSelected = false,
}) => {
  const colorInfo = COLOR_CONFIG[item.primaryColor] || { hex: '#E5E7EB', textDark: true };

  return (
    <div
      onClick={() => onClick(item)}
      className={`group relative flex flex-col rounded-2xl overflow-hidden glass-card transition-all duration-300 cursor-pointer border ${
        isSelected
          ? 'ring-2 ring-editorial-900 border-transparent shadow-lg scale-[1.02]'
          : 'border-editorial-200/70 hover:border-editorial-400 hover:shadow-md'
      }`}
    >
      {/* Garment Image Area */}
      <div className="relative aspect-square w-full bg-gradient-to-b from-editorial-50/60 to-editorial-100/40 p-3 flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-editorial-200 flex items-center justify-center text-editorial-500 font-serif text-xl">
            {item.name.charAt(0)}
          </div>
        )}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => onToggleFavorite(item.id, e)}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-md text-editorial-700 hover:text-formula-red transition shadow-sm active:scale-90"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                item.favorite ? 'fill-formula-red text-formula-red' : 'text-editorial-400'
              }`}
            />
          </button>
        )}

        {/* Color Badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-white/40">
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
            style={{ backgroundColor: colorInfo.hex }}
          />
          <span className="text-[10px] font-semibold text-editorial-800 tracking-tight">
            {item.primaryColor}
          </span>
        </div>
      </div>

      {/* Details Footer */}
      <div className="p-3 flex flex-col justify-between flex-1 bg-white/70">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-editorial-500">
            {item.category} • {item.subcategory}
          </span>
          <h3 className="text-xs font-semibold text-editorial-900 line-clamp-1 mt-0.5">
            {item.name}
          </h3>
        </div>

        {/* Guide Tags: Shape & Finish */}
        <div className="flex flex-wrap gap-1 mt-2">
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-editorial-100 text-editorial-700">
            {item.shape}
          </span>
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-editorial-100 text-editorial-700">
            {item.finishTexture}
          </span>
        </div>
      </div>
    </div>
  );
};
