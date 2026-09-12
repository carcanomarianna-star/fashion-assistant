"use client";

import React from 'react';
import { Sparkles, RefreshCw, Shirt, BookOpen, Layers, Database } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  itemCount: number;
  onResetDemo: () => void;
  onOpenChecklist?: () => void;
  onOpenBackup?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  itemCount,
  onResetDemo,
  onOpenChecklist,
  onOpenBackup,
}) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'closet':
        return { title: 'My Wardrobe', subtitle: `${itemCount} pieces cataloged` };
      case 'assistant':
        return { title: 'Outfit Formulas', subtitle: 'Color + Shape + Finish Engine' };
      case 'canvas':
        return { title: 'Visual Flat-Lay Studio', subtitle: 'Mix, match & test proportions' };
      case 'gaps':
        return { title: 'Wardrobe Gap Analysis', subtitle: 'What is missing in your closet' };
      case 'reference':
        return { title: 'Style Formula Matrix', subtitle: 'Color pairings & proportion guide' };
      default:
        return { title: 'Style Formula', subtitle: 'Digital wardrobe assistant' };
    }
  };

  const { title, subtitle } = getTitle();

  return (
    <header className="sticky top-0 z-30 px-4 py-3.5 glass-panel border-b border-editorial-200/80">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-editorial-200 text-editorial-800">
              C + S + F Method
            </span>
          </div>
          <h1 className="text-xl font-serif font-bold text-editorial-900 tracking-tight mt-0.5">
            {title}
          </h1>
          <p className="text-xs text-editorial-600 font-medium">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenChecklist && (
            <button
              onClick={onOpenChecklist}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-editorial-900 text-editorial-50 text-[11px] font-semibold shadow-sm hover:bg-editorial-800 transition active:scale-95"
              title="Daily Outfit Check"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden sm:inline">3-Step Check</span>
            </button>
          )}

          {onOpenBackup && (
            <button
              onClick={onOpenBackup}
              className="p-2 rounded-full text-editorial-700 bg-white/80 hover:bg-editorial-100 border border-editorial-200/80 transition active:scale-95 shadow-xs"
              title="Download / Backup Repository (Images & Tags)"
            >
              <Database className="w-4 h-4 text-editorial-800" />
            </button>
          )}

          <button
            onClick={onResetDemo}
            className="p-2 rounded-full text-editorial-600 hover:text-editorial-900 hover:bg-editorial-100 transition active:scale-95"
            title="Reset Sample Wardrobe"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
