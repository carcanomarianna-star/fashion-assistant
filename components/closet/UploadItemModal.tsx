"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  WardrobeItem, 
  MainCategory, 
  SubCategory, 
  FormulaColor, 
  ShapeSilhouette, 
  FinishTexture, 
  Occasion, 
  Season 
} from '@/lib/types';
import { COLOR_CONFIG } from '@/lib/style-formula-rules';
import { X, Camera, Upload, Check, Sparkles, Image as ImageIcon, Edit3 } from 'lucide-react';

interface UploadItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<WardrobeItem, 'id' | 'createdAt' | 'timesWorn'>) => void;
  initialItem?: WardrobeItem | null;
  onUpdate?: (item: WardrobeItem) => void;
}

const CATEGORIES: { label: MainCategory; subcategories: SubCategory[] }[] = [
  {
    label: 'Tops',
    subcategories: ['T-Shirt', 'Blouse', 'Knit / Sweater', 'Button-Down Shirt', 'Tank / Camisole', 'Crop Top', 'Blazer'],
  },
  {
    label: 'Bottoms',
    subcategories: ['Tailored Trousers', 'Jeans', 'Wide-Leg Pants', 'Midi / Maxi Skirt', 'Mini Skirt', 'Shorts'],
  },
  {
    label: 'One-Piece',
    subcategories: ['Midi Dress', 'Maxi Dress', 'Mini Dress', 'Jumpsuit'],
  },
  {
    label: 'Outerwear',
    subcategories: ['Structured Blazer', 'Trench Coat', 'Cardigan', 'Denim Jacket', 'Leather Jacket', 'Wool Coat'],
  },
  {
    label: 'Shoes',
    subcategories: ['Loafers', 'Sneakers', 'Heels / Pumps', 'Ankle Boots', 'Tall Boots', 'Sandals / Slides', 'Flats'],
  },
  {
    label: 'Bags',
    subcategories: ['Structured Tote', 'Crossbody Bag', 'Shoulder Bag', 'Clutch', 'Basket / Woven Bag'],
  },
  {
    label: 'Accessories',
    subcategories: ['Leather Belt', 'Statement Necklace', 'Silk Scarf', 'Earrings', 'Sunglasses', 'Watch / Bracelet', 'Hat'],
  },
];

const SHAPES: ShapeSilhouette[] = [
  'Fitted',
  'Relaxed',
  'Wide-Leg',
  'Structured',
  'Fluid / Flowy',
  'Cropped',
  'Long / Maxi',
  'Layered',
];

const FINISH_TEXTURES: FinishTexture[] = [
  'Knit',
  'Leather',
  'Denim',
  'Silk / Satin',
  'Linen',
  'Wool',
  'Cotton',
  'Suede',
  'Corduroy',
  'Metallic / Gold',
  'Metallic / Silver',
];

const OCCASIONS: Occasion[] = ['Work', 'Weekends', 'Dinner', 'Travel', 'Events'];

export const UploadItemModal: React.FC<UploadItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  onUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string>('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MainCategory>('Tops');
  const [subcategory, setSubcategory] = useState<SubCategory>('T-Shirt');
  const [primaryColor, setPrimaryColor] = useState<FormulaColor>('Red');
  const [patternColors, setPatternColors] = useState<FormulaColor[]>([]);
  const [shape, setShape] = useState<ShapeSilhouette>('Fitted');
  const [finishTexture, setFinishTexture] = useState<FinishTexture>('Cotton');
  const [selectedOccasions, setSelectedOccasions] = useState<Occasion[]>(['Work', 'Weekends']);
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');

  const isEditing = !!initialItem;

  useEffect(() => {
    if (initialItem) {
      setImagePreview(initialItem.imageUrl || '');
      setName(initialItem.name || '');
      setCategory(initialItem.category || 'Tops');
      setSubcategory(initialItem.subcategory || 'T-Shirt');
      setPrimaryColor(initialItem.primaryColor || 'Red');
      setPatternColors(initialItem.patternColors || []);
      setShape(initialItem.shape || 'Fitted');
      setFinishTexture(initialItem.finishTexture || 'Cotton');
      setSelectedOccasions(initialItem.occasions || ['Work', 'Weekends']);
      setBrand(initialItem.brand || '');
      setNotes(initialItem.notes || '');
    } else {
      setImagePreview('');
      setName('');
      setCategory('Tops');
      setSubcategory('T-Shirt');
      setPrimaryColor('Red');
      setPatternColors([]);
      setShape('Fitted');
      setFinishTexture('Cotton');
      setSelectedOccasions(['Work', 'Weekends']);
      setBrand('');
      setNotes('');
    }
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (newCat: MainCategory) => {
    setCategory(newCat);
    const catGroup = CATEGORIES.find((c) => c.label === newCat);
    if (catGroup && catGroup.subcategories.length > 0) {
      setSubcategory(catGroup.subcategories[0]);
    }
  };

  const toggleOccasion = (occ: Occasion) => {
    if (selectedOccasions.includes(occ)) {
      if (selectedOccasions.length > 1) {
        setSelectedOccasions(selectedOccasions.filter((o) => o !== occ));
      }
    } else {
      setSelectedOccasions([...selectedOccasions, occ]);
    }
  };

  const togglePatternColor = (col: FormulaColor) => {
    if (patternColors.includes(col)) {
      setPatternColors(patternColors.filter((c) => c !== col));
    } else {
      setPatternColors([...patternColors, col]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && initialItem && onUpdate) {
      onUpdate({
        ...initialItem,
        name: name.trim(),
        category,
        subcategory,
        primaryColor,
        patternColors: primaryColor === 'Pattern' ? patternColors : undefined,
        shape,
        finishTexture,
        occasions: selectedOccasions,
        imageUrl: imagePreview || initialItem.imageUrl || '',
        brand: brand.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      onSave({
        name: name.trim(),
        category,
        subcategory,
        primaryColor,
        patternColors: primaryColor === 'Pattern' ? patternColors : undefined,
        shape,
        finishTexture,
        occasions: selectedOccasions,
        seasons: ['All Season'],
        imageUrl: imagePreview || '',
        brand: brand.trim() || undefined,
        notes: notes.trim() || undefined,
        favorite: false,
      });
    }

    onClose();
  };

  const currentCategoryData = CATEGORIES.find((c) => c.label === category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-editorial-50 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-editorial-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-editorial-200/80 bg-white/70">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-editorial-500">
              {isEditing ? 'Modify Garment Details' : 'Add New Piece'}
            </span>
            <h2 className="text-lg font-serif font-bold text-editorial-900">
              {isEditing ? `Edit "${name || 'Item'}"` : 'Tag by Color, Shape & Finish'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-editorial-500 hover:text-editorial-900 hover:bg-editorial-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Image Upload / Capture Section */}
          <div>
            <label className="block text-xs font-bold text-editorial-700 uppercase tracking-wider mb-2">
              {isEditing ? 'Change Garment Photo' : 'Garment Photo'}
            </label>
            <div className="flex items-center gap-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-28 h-28 rounded-2xl border-2 border-dashed border-editorial-300 hover:border-editorial-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-white group transition"
              >
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="text-center p-2">
                    <ImageIcon className="w-6 h-6 mx-auto text-editorial-400 group-hover:scale-110 transition" />
                    <span className="text-[10px] font-medium text-editorial-500 mt-1 block">
                      Choose Photo
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-editorial-900 text-editorial-50 text-xs font-semibold hover:bg-editorial-800 transition active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Photo with Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-editorial-300 text-editorial-800 text-xs font-semibold hover:bg-editorial-100 transition active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isEditing ? 'Change Photo' : 'Upload from Gallery'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-editorial-700 uppercase tracking-wider mb-1.5">
              Garment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Red Cashmere Crewneck, Camel Wide Trousers..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-editorial-300 bg-white text-editorial-900 text-sm focus:outline-none focus:ring-2 focus:ring-editorial-900 font-medium"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-editorial-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => handleCategoryChange(cat.label)}
                  className={`py-2 px-1 text-[11px] font-semibold rounded-xl border text-center transition ${
                    category === cat.label
                      ? 'bg-editorial-900 text-editorial-50 border-editorial-900 shadow-sm'
                      : 'bg-white text-editorial-700 border-editorial-200 hover:border-editorial-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Subcategory */}
            {currentCategoryData && (
              <div className="mt-2.5">
                <label className="block text-[11px] font-semibold text-editorial-600 mb-1">
                  Sub-Type:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {currentCategoryData.subcategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSubcategory(sub)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition ${
                        subcategory === sub
                          ? 'bg-editorial-800 text-white border-editorial-800 font-semibold'
                          : 'bg-white text-editorial-600 border-editorial-200 hover:bg-editorial-100'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Color Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-editorial-700 uppercase tracking-wider">
                Color Palette
              </label>
              <span className="text-xs font-semibold text-editorial-800">
                Selected: <span className="underline">{primaryColor}</span>
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-40 overflow-y-auto p-1.5 bg-white rounded-2xl border border-editorial-200">
              {Object.keys(COLOR_CONFIG).map((colName) => {
                const color = colName as FormulaColor;
                const info = COLOR_CONFIG[color];
                const isSelected = primaryColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setPrimaryColor(color)}
                    className={`flex flex-col items-center p-1.5 rounded-xl transition ${
                      isSelected
                        ? 'bg-editorial-100 ring-2 ring-editorial-900 shadow-xs'
                        : 'hover:bg-editorial-50'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full border border-black/20 shadow-xs flex items-center justify-center"
                      style={{ backgroundColor: info.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            info.textDark ? 'text-black' : 'text-white'
                          }`}
                        />
                      )}
                    </span>
                    <span className="text-[9px] font-medium text-editorial-800 mt-1 truncate max-w-full text-center">
                      {color}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Question for Pattern Colors */}
          {primaryColor === 'Pattern' && (
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 animate-fade-in">
              <span className="text-xs font-bold text-purple-900 block">
                🎨 Pattern Color Selection: What colors are in this pattern?
              </span>
              <p className="text-[11px] text-purple-700 leading-snug">
                Select the key colors featured in the print/pattern so the Outfit Assistant can generate matching solid pairings:
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {Object.keys(COLOR_CONFIG)
                  .filter((c) => c !== 'Pattern')
                  .map((colName) => {
                    const col = colName as FormulaColor;
                    const info = COLOR_CONFIG[col];
                    const isSelected = patternColors.includes(col);
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => togglePatternColor(col)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                            : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20"
                          style={{ backgroundColor: info.hex }}
                        />
                        <span>{col}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Guide Formula: Shape (S) & Finish (F) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shape */}
            <div>
              <label className="block text-xs font-bold text-editorial-700 uppercase tracking-wider mb-1.5">
                Shape / Silhouette (S)
              </label>
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value as ShapeSilhouette)}
                className="w-full px-3 py-2 rounded-xl border border-editorial-300 bg-white text-editorial-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-editorial-900"
              >
                {SHAPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Finish Texture */}
            <div>
              <label className="block text-xs font-bold text-editorial-700 uppercase tracking-wider mb-1.5">
                Finish Texture (F)
              </label>
              <select
                value={finishTexture}
                onChange={(e) => setFinishTexture(e.target.value as FinishTexture)}
                className="w-full px-3 py-2 rounded-xl border border-editorial-300 bg-white text-editorial-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-editorial-900"
              >
                {FINISH_TEXTURES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Occasions Multi-Select */}
          <div>
            <label className="block text-xs font-bold text-editorial-700 uppercase tracking-wider mb-1.5">
              Occasions (Page 3 of Guide)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {OCCASIONS.map((occ) => {
                const isSelected = selectedOccasions.includes(occ);
                return (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => toggleOccasion(occ)}
                    className={`px-3 py-1.5 text-xs rounded-xl font-medium border transition ${
                      isSelected
                        ? 'bg-editorial-900 text-editorial-50 border-editorial-900 font-semibold'
                        : 'bg-white text-editorial-700 border-editorial-200 hover:bg-editorial-100'
                    }`}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-editorial-700 uppercase tracking-wider mb-1">
                Brand (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Zara, COS, Totême"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-editorial-300 bg-white text-editorial-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-editorial-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-editorial-700 uppercase tracking-wider mb-1">
                Styling Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Tuck into high-rise pants"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-editorial-300 bg-white text-editorial-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-editorial-900"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-editorial-900 text-editorial-50 text-sm font-bold shadow-md hover:bg-editorial-800 transition active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{isEditing ? 'Save Changes' : 'Add Piece to Wardrobe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
