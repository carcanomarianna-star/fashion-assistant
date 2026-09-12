"use client";

import React from 'react';
import { Shirt, Sparkles, LayoutGrid, AlertCircle, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'closet' | 'assistant' | 'canvas' | 'gaps' | 'reference';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  gapsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  gapsCount,
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'closet', label: 'Closet', icon: Shirt },
    { id: 'assistant', label: 'Assistant', icon: Sparkles },
    { id: 'canvas', label: 'Flat-Lay', icon: LayoutGrid },
    { id: 'gaps', label: 'Gaps', icon: AlertCircle, badge: gapsCount },
    { id: 'reference', label: 'Formulas', icon: Palette },
  ];

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-[60] max-w-md md:max-w-4xl mx-auto glass-nav border border-editorial-200/90 rounded-3xl px-2 py-2 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 py-1.5 rounded-2xl transition-all duration-200",
                isActive
                  ? "text-editorial-900 font-semibold"
                  : "text-editorial-500 hover:text-editorial-700"
              )}
            >
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-editorial-900 rounded-full animate-fade-in" />
              )}
              <div className="relative">
                <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive && "scale-110 stroke-[2.25]")} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-formula-red text-white text-[9px] font-bold rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={cn("text-[10px] mt-1 tracking-tight", isActive ? "font-bold text-editorial-900" : "font-medium")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
