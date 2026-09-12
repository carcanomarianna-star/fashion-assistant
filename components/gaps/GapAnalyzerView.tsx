"use client";

import React, { useMemo } from 'react';
import { WardrobeItem, WardrobeGap, FormulaColor } from '@/lib/types';
import { analyzeWardrobeGaps } from '@/lib/gap-analyzer';
import { COLOR_CONFIG } from '@/lib/style-formula-rules';
import { Sparkles, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

interface GapAnalyzerViewProps {
  items: WardrobeItem[];
  onOpenUploadWithPreset: (preset: {
    name: string;
    category: WardrobeGap['recommendedCategory'];
    subcategory: WardrobeGap['recommendedSubcategory'];
    primaryColor: FormulaColor;
    shape: WardrobeGap['recommendedShape'];
    finishTexture: WardrobeGap['recommendedFinish'];
  }) => void;
}

export const GapAnalyzerView: React.FC<GapAnalyzerViewProps> = ({
  items,
  onOpenUploadWithPreset,
}) => {
  const gaps = useMemo(() => {
    return analyzeWardrobeGaps(items);
  }, [items]);

  // Calculate Wardrobe Health & Versatility Score
  const wardrobeScore = useMemo(() => {
    const totalItems = items.length;
    if (totalItems === 0) return 0;
    const colorVariety = new Set(items.map((i) => i.primaryColor)).size;
    const categoryVariety = new Set(items.map((i) => i.category)).size;
    const score = Math.min(100, Math.round(categoryVariety * 10 + colorVariety * 5 - gaps.length * 2));
    return Math.max(30, score);
  }, [items, gaps]);

  return (
    <div className="space-y-4 px-4 py-3 pb-24">
      {/* Wardrobe Health Overview Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-editorial-900 to-editorial-800 text-editorial-50 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-editorial-300">
              Style Formula Audit
            </span>
            <h2 className="text-xl font-serif font-bold text-white mt-0.5">
              Wardrobe Gap Analysis
            </h2>
          </div>
          <div className="text-right">
            <span className="text-2xl font-serif font-bold text-white">
              {wardrobeScore}%
            </span>
            <span className="block text-[9px] uppercase tracking-wider text-editorial-300 font-bold">
              Versatility
            </span>
          </div>
        </div>

        <p className="text-xs text-editorial-200 mt-2.5 leading-relaxed">
          {gaps.length > 0
            ? `Identified ${gaps.length} strategic wardrobe gaps. Adding these pieces will maximize repeatable outfit formulas without overbuying.`
            : 'Your wardrobe has excellent color pairings and balanced proportions across the Style Formula system!'}
        </p>

        {/* Quick Stat Badges */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[9px] uppercase tracking-wider text-editorial-300 font-bold block">
              Cataloged
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {items.length} Items
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[9px] uppercase tracking-wider text-editorial-300 font-bold block">
              High Impact
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {gaps.filter((g) => g.impactScore >= 8).length} Pieces
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[9px] uppercase tracking-wider text-editorial-300 font-bold block">
              Formula Unlocks
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              +{gaps.reduce((acc, g) => acc + g.impactScore, 0)} Looks
            </span>
          </div>
        </div>
      </div>

      {/* Gaps List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-serif font-bold text-editorial-900">
            Recommended Additions (Ranked by Impact)
          </h3>
          <span className="text-[10px] font-bold text-editorial-500 uppercase tracking-wider">
            {gaps.length} Recommendations
          </span>
        </div>

        {gaps.length > 0 ? (
          gaps.map((gap, index) => {
            const colInfo = COLOR_CONFIG[gap.recommendedColor];
            return (
              <div
                key={gap.id}
                className="p-4 rounded-3xl bg-white border border-editorial-200 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-editorial-100 text-editorial-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                      #{index + 1}
                    </span>
                    <h4 className="text-xs font-serif font-bold text-editorial-900">
                      {gap.title}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold tracking-tight shrink-0 border border-emerald-200">
                    +{gap.impactScore} Outfits
                  </span>
                </div>

                <p className="text-xs text-editorial-600 leading-snug">
                  {gap.description}
                </p>

                {/* Target Specs */}
                <div className="p-2.5 rounded-2xl bg-editorial-50 border border-editorial-200/70 space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-editorial-500 tracking-wider block">
                    Ideal Formula Specs:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-editorial-200 text-[10px] font-medium text-editorial-800">
                      <span
                        className="w-2 h-2 rounded-full border border-black/10"
                        style={{ backgroundColor: colInfo?.hex }}
                      />
                      {gap.recommendedColor}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-editorial-200 text-[10px] font-medium text-editorial-800">
                      {gap.recommendedCategory}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-editorial-200 text-[10px] font-medium text-editorial-800">
                      {gap.recommendedShape}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-editorial-200 text-[10px] font-medium text-editorial-800">
                      {gap.recommendedFinish}
                    </span>
                  </div>

                  <p className="text-[11px] text-editorial-700 italic pt-1">
                    "{gap.whyNeeded}"
                  </p>
                </div>

                {/* Action: Add to Wardrobe */}
                <button
                  onClick={() =>
                    onOpenUploadWithPreset({
                      name: `${gap.recommendedColor} ${gap.recommendedSubcategory}`,
                      category: gap.recommendedCategory,
                      subcategory: gap.recommendedSubcategory,
                      primaryColor: gap.recommendedColor,
                      shape: gap.recommendedShape,
                      finishTexture: gap.recommendedFinish,
                    })
                  }
                  className="w-full py-2.5 rounded-2xl bg-editorial-100 hover:bg-editorial-200 text-editorial-900 text-xs font-bold transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>I bought this / Add to Closet</span>
                  <ArrowRight className="w-3 h-3 text-editorial-500" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 px-4 bg-white/70 rounded-3xl border border-dashed border-editorial-300">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600 mb-2" />
            <h3 className="text-base font-serif font-bold text-editorial-800">
              Wardrobe Balance Achieved
            </h3>
            <p className="text-xs text-editorial-500 max-w-xs mx-auto mt-1">
              You have comprehensive coverage across colors, shapes, and finishing layers from the guide!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
