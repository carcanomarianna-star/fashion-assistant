"use client";

import React, { useState, useMemo } from 'react';
import { WardrobeItem, MainCategory, SubCategory, FormulaColor, ShapeSilhouette, Occasion } from '@/lib/types';
import { ItemCard } from './ItemCard';
import { UploadItemModal } from './UploadItemModal';
import { ItemDetailModal } from './ItemDetailModal';
import { Plus, Search, Filter, SlidersHorizontal, Sparkles, Shirt, Database, X } from 'lucide-react';
import { COLOR_CONFIG } from '@/lib/style-formula-rules';

interface ClosetViewProps {
  items: WardrobeItem[];
  onAddItem: (item: Omit<WardrobeItem, 'id' | 'createdAt' | 'timesWorn'>) => void;
  onUpdateItem: (item: WardrobeItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onLogWear: (id: string) => void;
  onBuildOutfitAround: (item: WardrobeItem) => void;
  onOpenBackup?: () => void;
}

const CATEGORIES: ('All' | MainCategory)[] = [
  'All',
  'Tops',
  'Bottoms',
  'One-Piece',
  'Outerwear',
  'Shoes',
  'Bags',
  'Accessories',
];

export const ClosetView: React.FC<ClosetViewProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleFavorite,
  onLogWear,
  onBuildOutfitAround,
  onOpenBackup,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | MainCategory>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<FormulaColor | 'All'>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | 'All'>('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Available subcategories dynamically collected from catalog or category
  const availableSubcategories = useMemo(() => {
    let sourceItems = items;
    if (selectedCategory !== 'All') {
      sourceItems = items.filter((i) => i.category === selectedCategory);
    }
    const set = new Set<SubCategory>();
    sourceItems.forEach((i) => set.add(i.subcategory));
    return Array.from(set);
  }, [items, selectedCategory]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (selectedSubcategory !== 'All' && item.subcategory !== selectedSubcategory) return false;
      if (selectedColor !== 'All' && item.primaryColor !== selectedColor && item.secondaryColor !== selectedColor) return false;
      if (selectedOccasion !== 'All' && !item.occasions.includes(selectedOccasion)) return false;
      if (showOnlyFavorites && !item.favorite) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSubcat = item.subcategory.toLowerCase().includes(query);
        const matchesBrand = item.brand?.toLowerCase().includes(query);
        const matchesColor = item.primaryColor.toLowerCase().includes(query);
        if (!matchesName && !matchesSubcat && !matchesBrand && !matchesColor) return false;
      }
      return true;
    });
  }, [items, selectedCategory, selectedSubcategory, selectedColor, selectedOccasion, showOnlyFavorites, searchQuery]);

  return (
    <div className="space-y-4 px-4 py-3 pb-28">
      {/* Top Search & Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-editorial-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items, colors, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl border border-editorial-200 bg-white/80 backdrop-blur-sm text-xs font-medium text-editorial-900 placeholder:text-editorial-400 focus:outline-none focus:ring-2 focus:ring-editorial-900 shadow-xs"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-2xl border transition ${
            showFilters || selectedColor !== 'All' || selectedOccasion !== 'All' || selectedSubcategory !== 'All' || showOnlyFavorites
              ? 'bg-editorial-900 text-editorial-50 border-editorial-900 shadow-xs'
              : 'bg-white/80 text-editorial-700 border-editorial-200 hover:bg-editorial-100'
          }`}
          title="Filter by Color, Subtype & Occasion"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {onOpenBackup && (
          <button
            onClick={onOpenBackup}
            className="p-2.5 rounded-2xl border border-editorial-200 bg-white/80 text-editorial-700 hover:bg-editorial-100 transition shadow-xs"
            title="Download / Backup Repository (Images & Tags)"
          >
            <Database className="w-4 h-4 text-editorial-800" />
          </button>
        )}

        <button
          onClick={() => {
            setEditingItem(null);
            setIsUploadOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-editorial-900 text-editorial-50 text-xs font-bold hover:bg-editorial-800 transition active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Item</span>
        </button>
      </div>

      {/* Expandable Advanced Filters */}
      {showFilters && (
        <div className="p-3.5 rounded-2xl bg-white border border-editorial-200 shadow-sm space-y-3 animate-fade-in">
          {/* Subtype Filter */}
          {availableSubcategories.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-editorial-600 uppercase tracking-wider block">
                  Filter by Garment Subtype:
                </span>
                {selectedSubcategory !== 'All' && (
                  <button
                    onClick={() => setSelectedSubcategory('All')}
                    className="text-[10px] text-editorial-500 hover:underline flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" /> Clear Subtype
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedSubcategory('All')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedSubcategory === 'All'
                      ? 'bg-editorial-900 text-white'
                      : 'bg-editorial-100 text-editorial-700 hover:bg-editorial-200'
                  }`}
                >
                  All Subtypes
                </button>
                {availableSubcategories.map((sub) => {
                  const isSelected = selectedSubcategory === sub;
                  return (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(isSelected ? 'All' : sub)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap border transition ${
                        isSelected
                          ? 'border-editorial-900 bg-editorial-900 text-white font-semibold shadow-xs'
                          : 'border-editorial-200 bg-editorial-50 text-editorial-800 hover:bg-editorial-100'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Filter */}
          <div className="pt-2 border-t border-editorial-100">
            <span className="text-[10px] font-bold text-editorial-600 uppercase tracking-wider block mb-1.5">
              Filter by Guide Color:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedColor('All')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedColor === 'All'
                    ? 'bg-editorial-900 text-white'
                    : 'bg-editorial-100 text-editorial-700 hover:bg-editorial-200'
                }`}
              >
                All Colors
              </button>
              {Object.keys(COLOR_CONFIG).map((col) => {
                const color = col as FormulaColor;
                const info = COLOR_CONFIG[color];
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(isSelected ? 'All' : color)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap border transition ${
                      isSelected
                        ? 'border-editorial-900 bg-editorial-50 shadow-xs'
                        : 'border-editorial-200 bg-white hover:bg-editorial-50'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: info.hex }}
                    />
                    <span>{color}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occasion Filter */}
          <div className="flex items-center justify-between pt-2 border-t border-editorial-100">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-editorial-600 uppercase tracking-wider mr-1">
                Occasion:
              </span>
              {(['All', 'Work', 'Weekends', 'Dinner', 'Travel', 'Events'] as const).map((occ) => (
                <button
                  key={occ}
                  onClick={() => setSelectedOccasion(occ)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
                    selectedOccasion === occ
                      ? 'bg-editorial-900 text-white font-semibold'
                      : 'bg-editorial-100 text-editorial-700 hover:bg-editorial-200'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                showOnlyFavorites
                  ? 'bg-formula-red text-white'
                  : 'text-editorial-600 hover:bg-editorial-100'
              }`}
            >
              ★ Favorites
            </button>
          </div>
        </div>
      )}

      {/* Category Scroll Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = cat === 'All' 
            ? items.length 
            : items.filter((i) => i.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubcategory('All');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isSelected
                  ? 'bg-editorial-900 text-editorial-50 shadow-sm'
                  : 'bg-white/80 text-editorial-600 hover:bg-white hover:text-editorial-900 border border-editorial-200/70'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-editorial-100 text-editorial-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={(clicked) => setSelectedItem(clicked)}
              onToggleFavorite={(id, e) => {
                e.stopPropagation();
                onToggleFavorite(id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white/60 rounded-3xl border border-dashed border-editorial-300">
          <Shirt className="w-12 h-12 mx-auto text-editorial-300 mb-3" />
          <h3 className="text-base font-serif font-bold text-editorial-800">
            No items match your filter
          </h3>
          <p className="text-xs text-editorial-500 max-w-xs mx-auto mt-1 mb-4">
            Try resetting your search query or upload a new garment to expand your closet.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedSubcategory('All');
              setSelectedColor('All');
              setSelectedOccasion('All');
              setSearchQuery('');
              setShowOnlyFavorites(false);
            }}
            className="px-4 py-2 rounded-xl bg-editorial-200 text-editorial-800 text-xs font-semibold hover:bg-editorial-300 transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Upload & Edit Item Modal */}
      <UploadItemModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setEditingItem(null);
        }}
        onSave={onAddItem}
        initialItem={editingItem}
        onUpdate={onUpdateItem}
      />

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onToggleFavorite={onToggleFavorite}
        onLogWear={onLogWear}
        onDelete={onDeleteItem}
        onBuildOutfitAround={onBuildOutfitAround}
        onEditItem={(itemToEdit) => {
          setEditingItem(itemToEdit);
          setIsUploadOpen(true);
        }}
      />
    </div>
  );
};
