"use client";

import React, { useState } from 'react';
import { WardrobeItem, OutfitFormula, MainCategory } from '@/lib/types';
import { evaluateManualOutfit } from '@/lib/outfit-engine';
import { COLOR_CONFIG } from '@/lib/style-formula-rules';
import { Plus, Sparkles, Bookmark, RotateCcw, Shuffle, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface CanvasViewProps {
  items: WardrobeItem[];
  currentOutfit: OutfitFormula | null;
  onSaveOutfit: (outfit: OutfitFormula) => void;
  onSetCurrentOutfit: (outfit: OutfitFormula) => void;
}

export const CanvasView: React.FC<CanvasViewProps> = ({
  items,
  currentOutfit,
  onSaveOutfit,
  onSetCurrentOutfit,
}) => {
  // Active selection modal
  const [activeSlotCategory, setActiveSlotCategory] = useState<MainCategory | null>(null);

  // Selected components
  const [top, setTop] = useState<WardrobeItem | undefined>(currentOutfit?.top);
  const [bottom, setBottom] = useState<WardrobeItem | undefined>(currentOutfit?.bottom);
  const [onePiece, setOnePiece] = useState<WardrobeItem | undefined>(currentOutfit?.onePiece);
  const [outerwear, setOuterwear] = useState<WardrobeItem | undefined>(currentOutfit?.outerwear);
  const [shoes, setShoes] = useState<WardrobeItem | undefined>(currentOutfit?.shoes);
  const [bag, setBag] = useState<WardrobeItem | undefined>(currentOutfit?.bag);
  const [accessory, setAccessory] = useState<WardrobeItem | undefined>(currentOutfit?.accessory);

  // Synchronize when currentOutfit changes
  React.useEffect(() => {
    if (currentOutfit) {
      setTop(currentOutfit.top);
      setBottom(currentOutfit.bottom);
      setOnePiece(currentOutfit.onePiece);
      setOuterwear(currentOutfit.outerwear);
      setShoes(currentOutfit.shoes);
      setBag(currentOutfit.bag);
      setAccessory(currentOutfit.accessory);
    }
  }, [currentOutfit]);

  // Live evaluation of composed outfit
  const evaluation = React.useMemo(() => {
    return evaluateManualOutfit({
      top,
      bottom,
      onePiece,
      outerwear,
      shoes,
      bag,
      accessory,
    });
  }, [top, bottom, onePiece, outerwear, shoes, bag, accessory]);

  const handleSelectItem = (item: WardrobeItem) => {
    if (item.category === 'Tops') {
      setTop(item);
      setOnePiece(undefined);
    } else if (item.category === 'Bottoms') {
      setBottom(item);
      setOnePiece(undefined);
    } else if (item.category === 'One-Piece') {
      setOnePiece(item);
      setTop(undefined);
      setBottom(undefined);
    } else if (item.category === 'Outerwear') {
      setOuterwear(item);
    } else if (item.category === 'Shoes') {
      setShoes(item);
    } else if (item.category === 'Bags') {
      setBag(item);
    } else if (item.category === 'Accessories') {
      setAccessory(item);
    }
    setActiveSlotCategory(null);
  };

  const handleClearSlot = (cat: MainCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    if (cat === 'Tops') setTop(undefined);
    if (cat === 'Bottoms') setBottom(undefined);
    if (cat === 'One-Piece') setOnePiece(undefined);
    if (cat === 'Outerwear') setOuterwear(undefined);
    if (cat === 'Shoes') setShoes(undefined);
    if (cat === 'Bags') setBag(undefined);
    if (cat === 'Accessories') setAccessory(undefined);
  };

  const handleShuffle = () => {
    const randomTop = items.filter(i => i.category === 'Tops')[Math.floor(Math.random() * items.filter(i => i.category === 'Tops').length)];
    const randomBottom = items.filter(i => i.category === 'Bottoms')[Math.floor(Math.random() * items.filter(i => i.category === 'Bottoms').length)];
    const randomOuter = items.filter(i => i.category === 'Outerwear')[0];
    const randomShoes = items.filter(i => i.category === 'Shoes')[0];
    const randomBag = items.filter(i => i.category === 'Bags')[0];

    if (randomTop) setTop(randomTop);
    if (randomBottom) setBottom(randomBottom);
    setOnePiece(undefined);
    if (randomOuter) setOuterwear(randomOuter);
    if (randomShoes) setShoes(randomShoes);
    if (randomBag) setBag(randomBag);
  };

  const handleReset = () => {
    setTop(undefined);
    setBottom(undefined);
    setOnePiece(undefined);
    setOuterwear(undefined);
    setShoes(undefined);
    setBag(undefined);
    setAccessory(undefined);
  };

  const primaryCol = COLOR_CONFIG[evaluation.colorStory.primaryColor];
  const pairingCol = COLOR_CONFIG[evaluation.colorStory.pairingColor];

  return (
    <div className="space-y-4 px-4 py-3 pb-24">
      {/* Studio Header & Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-editorial-500">
            Interactive Moodboard
          </span>
          <h2 className="text-base font-serif font-bold text-editorial-900">
            Visual Flat-Lay Canvas
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShuffle}
            className="p-2 rounded-xl bg-editorial-100 hover:bg-editorial-200 text-editorial-800 transition active:scale-95"
            title="Random Match"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-editorial-100 hover:bg-editorial-200 text-editorial-800 transition active:scale-95"
            title="Clear Canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSaveOutfit(evaluation)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-editorial-900 text-editorial-50 text-xs font-bold hover:bg-editorial-800 transition active:scale-95 shadow-sm"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save Outfit</span>
          </button>
        </div>
      </div>

      {/* Main Flat-Lay Visual Grid */}
      <div className="p-4 rounded-3xl bg-editorial-100/60 border border-editorial-200/80 space-y-3">
        {/* Upper Body Row (Outerwear + Top / OnePiece) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Top / Dress Slot */}
          <div
            onClick={() => setActiveSlotCategory('Tops')}
            className="relative aspect-square rounded-2xl bg-white border-2 border-dashed border-editorial-200 hover:border-editorial-400 flex flex-col items-center justify-center p-3 cursor-pointer group transition shadow-xs overflow-hidden"
          >
            <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-editorial-400">
              Top / Base
            </span>
            {top || onePiece ? (
              <>
                <button
                  onClick={(e) => handleClearSlot(top ? 'Tops' : 'One-Piece', e)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-editorial-100 text-editorial-500 hover:text-editorial-900 transition"
                >
                  <X className="w-3 h-3" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={(top || onePiece)?.imageUrl}
                  alt={(top || onePiece)?.name}
                  className="w-full h-full object-contain p-2"
                />
                <span className="text-[10px] font-semibold text-editorial-900 truncate max-w-full text-center">
                  {(top || onePiece)?.name}
                </span>
              </>
            ) : (
              <div className="text-center">
                <Plus className="w-6 h-6 mx-auto text-editorial-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-semibold text-editorial-500 mt-1 block">
                  Select Top
                </span>
              </div>
            )}
          </div>

          {/* Outerwear / Third Piece Slot */}
          <div
            onClick={() => setActiveSlotCategory('Outerwear')}
            className="relative aspect-square rounded-2xl bg-white border-2 border-dashed border-editorial-200 hover:border-editorial-400 flex flex-col items-center justify-center p-3 cursor-pointer group transition shadow-xs overflow-hidden"
          >
            <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-editorial-400">
              Third Piece (Outer)
            </span>
            {outerwear ? (
              <>
                <button
                  onClick={(e) => handleClearSlot('Outerwear', e)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-editorial-100 text-editorial-500 hover:text-editorial-900 transition"
                >
                  <X className="w-3 h-3" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={outerwear.imageUrl}
                  alt={outerwear.name}
                  className="w-full h-full object-contain p-2"
                />
                <span className="text-[10px] font-semibold text-editorial-900 truncate max-w-full text-center">
                  {outerwear.name}
                </span>
              </>
            ) : (
              <div className="text-center">
                <Plus className="w-6 h-6 mx-auto text-editorial-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-semibold text-editorial-500 mt-1 block">
                  Add Blazer/Layer
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Lower Body Row (Bottom + Shoes) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Bottom Slot */}
          <div
            onClick={() => setActiveSlotCategory('Bottoms')}
            className="relative aspect-square rounded-2xl bg-white border-2 border-dashed border-editorial-200 hover:border-editorial-400 flex flex-col items-center justify-center p-3 cursor-pointer group transition shadow-xs overflow-hidden"
          >
            <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-editorial-400">
              Bottom
            </span>
            {bottom ? (
              <>
                <button
                  onClick={(e) => handleClearSlot('Bottoms', e)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-editorial-100 text-editorial-500 hover:text-editorial-900 transition"
                >
                  <X className="w-3 h-3" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bottom.imageUrl}
                  alt={bottom.name}
                  className="w-full h-full object-contain p-2"
                />
                <span className="text-[10px] font-semibold text-editorial-900 truncate max-w-full text-center">
                  {bottom.name}
                </span>
              </>
            ) : (
              <div className="text-center">
                <Plus className="w-6 h-6 mx-auto text-editorial-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-semibold text-editorial-500 mt-1 block">
                  Select Bottom
                </span>
              </div>
            )}
          </div>

          {/* Shoes Slot */}
          <div
            onClick={() => setActiveSlotCategory('Shoes')}
            className="relative aspect-square rounded-2xl bg-white border-2 border-dashed border-editorial-200 hover:border-editorial-400 flex flex-col items-center justify-center p-3 cursor-pointer group transition shadow-xs overflow-hidden"
          >
            <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-editorial-400">
              Footwear (F)
            </span>
            {shoes ? (
              <>
                <button
                  onClick={(e) => handleClearSlot('Shoes', e)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-editorial-100 text-editorial-500 hover:text-editorial-900 transition"
                >
                  <X className="w-3 h-3" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shoes.imageUrl}
                  alt={shoes.name}
                  className="w-full h-full object-contain p-2"
                />
                <span className="text-[10px] font-semibold text-editorial-900 truncate max-w-full text-center">
                  {shoes.name}
                </span>
              </>
            ) : (
              <div className="text-center">
                <Plus className="w-6 h-6 mx-auto text-editorial-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-semibold text-editorial-500 mt-1 block">
                  Select Shoes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Finishing Row (Bag + Accessory) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Bag Slot */}
          <div
            onClick={() => setActiveSlotCategory('Bags')}
            className="relative h-28 rounded-2xl bg-white border-2 border-dashed border-editorial-200 hover:border-editorial-400 flex flex-col items-center justify-center p-2 cursor-pointer group transition shadow-xs overflow-hidden"
          >
            <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-editorial-400">
              Bag (F)
            </span>
            {bag ? (
              <>
                <button
                  onClick={(e) => handleClearSlot('Bags', e)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-editorial-100 text-editorial-500 hover:text-editorial-900 transition"
                >
                  <X className="w-3 h-3" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bag.imageUrl}
                  alt={bag.name}
                  className="w-full h-full object-contain p-1"
                />
                <span className="text-[10px] font-semibold text-editorial-900 truncate max-w-full">
                  {bag.subcategory}
                </span>
              </>
            ) : (
              <div className="text-center">
                <Plus className="w-4 h-4 mx-auto text-editorial-400 group-hover:scale-110 transition" />
                <span className="text-[9px] font-semibold text-editorial-500 mt-0.5 block">
                  Add Bag
                </span>
              </div>
            )}
          </div>

          {/* Accessory Slot */}
          <div
            onClick={() => setActiveSlotCategory('Accessories')}
            className="relative h-28 rounded-2xl bg-white border-2 border-dashed border-editorial-200 hover:border-editorial-400 flex flex-col items-center justify-center p-2 cursor-pointer group transition shadow-xs overflow-hidden"
          >
            <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-editorial-400">
              Accessory
            </span>
            {accessory ? (
              <>
                <button
                  onClick={(e) => handleClearSlot('Accessories', e)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-editorial-100 text-editorial-500 hover:text-editorial-900 transition"
                >
                  <X className="w-3 h-3" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={accessory.imageUrl}
                  alt={accessory.name}
                  className="w-full h-full object-contain p-1"
                />
                <span className="text-[10px] font-semibold text-editorial-900 truncate max-w-full">
                  {accessory.subcategory}
                </span>
              </>
            ) : (
              <div className="text-center">
                <Plus className="w-4 h-4 mx-auto text-editorial-400 group-hover:scale-110 transition" />
                <span className="text-[9px] font-semibold text-editorial-500 mt-0.5 block">
                  Add Jewelry/Belt
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Formula Harmony Analysis Bar */}
      <div className="p-4 rounded-3xl bg-white border border-editorial-200 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif font-bold text-editorial-900">
              Live Formula Compatibility
            </span>
            <span className="text-[10px] font-semibold text-editorial-700 bg-editorial-100 px-2 py-0.5 rounded-full">
              C + S + F
            </span>
          </div>
          <span className="text-sm font-serif font-bold text-editorial-900">
            {evaluation.overallScore}% Harmony
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-editorial-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              evaluation.overallScore >= 80
                ? 'bg-emerald-600'
                : evaluation.overallScore >= 65
                ? 'bg-amber-600'
                : 'bg-formula-red'
            }`}
            style={{ width: `${evaluation.overallScore}%` }}
          />
        </div>

        {/* C + S + F Explanations */}
        <div className="space-y-2 text-xs pt-1">
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-bold text-editorial-800 bg-editorial-100 px-1.5 py-0.5 rounded uppercase">
              C
            </span>
            <p className="text-editorial-700 font-medium">
              {evaluation.colorStory.ruleDescription}
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-[10px] font-bold text-editorial-800 bg-editorial-100 px-1.5 py-0.5 rounded uppercase">
              S
            </span>
            <p className="text-editorial-700 font-medium">
              {evaluation.shapeHarmony.silhouetteDescription}
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-[10px] font-bold text-editorial-800 bg-editorial-100 px-1.5 py-0.5 rounded uppercase">
              F
            </span>
            <p className="text-editorial-700 font-medium">
              Finish completeness: {evaluation.finishCompleteness.score}% (Shoes {shoes ? '✓' : '—'}, Bag {bag ? '✓' : '—'}, Layer/Accessory {outerwear || accessory ? '✓' : '—'})
            </p>
          </div>
        </div>
      </div>

      {/* Garment Selector Drawer / Modal */}
      {activeSlotCategory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-editorial-50 rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-editorial-200 max-h-[75vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-editorial-200 bg-white/80">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-editorial-500">
                  Select Garment
                </span>
                <h3 className="text-base font-serif font-bold text-editorial-900">
                  Choose {activeSlotCategory}
                </h3>
              </div>
              <button
                onClick={() => setActiveSlotCategory(null)}
                className="p-2 rounded-full hover:bg-editorial-100 text-editorial-500 hover:text-editorial-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 grid grid-cols-3 gap-2.5 overflow-y-auto">
              {items
                .filter(
                  (i) =>
                    i.category === activeSlotCategory ||
                    (activeSlotCategory === 'Tops' && i.category === 'One-Piece')
                )
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className="p-2.5 rounded-2xl bg-white border border-editorial-200 hover:border-editorial-900 cursor-pointer transition shadow-xs flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 relative flex items-center justify-center mb-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-editorial-900 line-clamp-1">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-editorial-500">
                      {item.primaryColor} • {item.shape}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
