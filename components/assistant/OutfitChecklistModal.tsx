"use client";

import React, { useState } from 'react';
import { X, Check, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';

interface OutfitChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutfitChecklistModal: React.FC<OutfitChecklistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step1Color, setStep1Color] = useState(false);
  const [step2Shape, setStep2Shape] = useState(false);
  const [step3Finish, setStep3Finish] = useState(false);

  if (!isOpen) return null;

  const allChecked = step1Color && step2Shape && step3Finish;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-editorial-50 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-editorial-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-editorial-200 bg-white/70">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-editorial-500">
              Style Formula Quick Reference
            </span>
            <h2 className="text-lg font-serif font-bold text-editorial-900">
              Daily Outfit Check
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-editorial-500 hover:text-editorial-900 hover:bg-editorial-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-editorial-600">
            Before heading out, run through the 3-step formula from the guide to ensure your outfit feels intentional, balanced, and complete.
          </p>

          {/* Step 1: Color */}
          <div
            onClick={() => setStep1Color(!step1Color)}
            className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
              step1Color
                ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400'
                : 'bg-white border-editorial-200 hover:border-editorial-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition ${
                step1Color ? 'bg-emerald-600 text-white' : 'border-2 border-editorial-300'
              }`}
            >
              {step1Color && <Check className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold text-editorial-900">
                  1. Color Story (C)
                </span>
                <span className="text-[10px] uppercase font-bold text-editorial-500">
                  Cheat Sheet Match
                </span>
              </div>
              <p className="text-xs text-editorial-600 mt-1 leading-snug">
                Did you pick one main color and one pairing partner from the cheat sheet, grounded with neutrals?
              </p>
            </div>
          </div>

          {/* Step 2: Shape */}
          <div
            onClick={() => setStep2Shape(!step2Shape)}
            className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
              step2Shape
                ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400'
                : 'bg-white border-editorial-200 hover:border-editorial-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition ${
                step2Shape ? 'bg-emerald-600 text-white' : 'border-2 border-editorial-300'
              }`}
            >
              {step2Shape && <Check className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold text-editorial-900">
                  2. Balance Proportion (S)
                </span>
                <span className="text-[10px] uppercase font-bold text-editorial-500">
                  Volume & Length
                </span>
              </div>
              <p className="text-xs text-editorial-600 mt-1 leading-snug">
                Are your proportions balanced? (e.g., fitted top with wide pants, or relaxed knit with structured trousers).
              </p>
            </div>
          </div>

          {/* Step 3: Finish */}
          <div
            onClick={() => setStep3Finish(!step3Finish)}
            className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
              step3Finish
                ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400'
                : 'bg-white border-editorial-200 hover:border-editorial-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition ${
                step3Finish ? 'bg-emerald-600 text-white' : 'border-2 border-editorial-300'
              }`}
            >
              {step3Finish && <Check className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold text-editorial-900">
                  3. Know What Completes It (F)
                </span>
                <span className="text-[10px] uppercase font-bold text-editorial-500">
                  Shoes, Bag, Layer
                </span>
              </div>
              <p className="text-xs text-editorial-600 mt-1 leading-snug">
                Did you add connecting shoes, a bag, or a third piece (blazer, belt, jewelry) to tie the whole look together?
              </p>
            </div>
          </div>

          {/* Success Status */}
          {allChecked && (
            <div className="p-4 rounded-2xl bg-emerald-600 text-white text-center space-y-1 animate-fade-in shadow-md">
              <Sparkles className="w-6 h-6 mx-auto text-yellow-300 animate-pulse" />
              <h4 className="text-sm font-serif font-bold">
                Formula Complete! You are Ready.
              </h4>
              <p className="text-xs text-emerald-100">
                Your look fulfills Color + Shape + Finish principles.
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-editorial-900 text-editorial-50 text-xs font-bold shadow-md hover:bg-editorial-800 transition"
            >
              {allChecked ? 'Looks Great, Done!' : 'Close Checklist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
