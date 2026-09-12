"use client";

import React, { useState, useRef } from 'react';
import { exportWardrobeRepository, importWardrobeRepository } from '@/lib/export-import';
import { Download, Upload, Database, Check, AlertCircle, X, Sparkles, HardDrive, ShieldCheck } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalItems: number;
  totalOutfits: number;
  onRefreshData: () => Promise<void>;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  totalItems,
  totalOutfits,
  onRefreshData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setErrorMessage(null);
      const result = await exportWardrobeRepository();
      setImportSuccessMessage(`Repository downloaded successfully (${(result.sizeBytes / 1024).toFixed(1)} KB)!`);
      setTimeout(() => setImportSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to export repository');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setErrorMessage(null);
      const res = await importWardrobeRepository(file, importMode);
      await onRefreshData();
      setImportSuccessMessage(`Successfully imported ${res.importedItems} pieces and ${res.importedOutfits} saved looks!`);
      setTimeout(() => {
        setImportSuccessMessage(null);
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid backup file');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-editorial-50 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-editorial-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-editorial-200 bg-white/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-editorial-100 text-editorial-900">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-editorial-500">
                Data & Storage
              </span>
              <h2 className="text-base font-serif font-bold text-editorial-900">
                Wardrobe Repository
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-editorial-500 hover:text-editorial-900 hover:bg-editorial-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Notification Banners */}
          {importSuccessMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importSuccessMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-formula-red text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current Status Overview */}
          <div className="p-3.5 rounded-2xl bg-white border border-editorial-200 shadow-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-editorial-500 tracking-wider block">
              Current Local Database
            </span>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-editorial-50 border border-editorial-100">
                <span className="text-lg font-serif font-bold text-editorial-900 block">
                  {totalItems}
                </span>
                <span className="text-[10px] font-medium text-editorial-600">
                  Garments & Photos
                </span>
              </div>
              <div className="p-2 rounded-xl bg-editorial-50 border border-editorial-100">
                <span className="text-lg font-serif font-bold text-editorial-900 block">
                  {totalOutfits}
                </span>
                <span className="text-[10px] font-medium text-editorial-600">
                  Saved Formulas
                </span>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-editorial-700 block">
              1. Download Complete Backup
            </span>
            <p className="text-xs text-editorial-600 leading-snug">
              Save everything (photos, guide color tags, shape silhouettes, textures, wear history, and lookbook formulas) into a single portable JSON file.
            </p>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-3 rounded-2xl bg-editorial-900 text-editorial-50 text-xs font-bold shadow-md hover:bg-editorial-800 transition active:scale-98 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-editorial-100" />
              <span>{isExporting ? 'Packaging Repository...' : 'Download Repository (.json with images)'}</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="pt-2 border-t border-editorial-200/80 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-editorial-700 block">
              2. Restore or Import Wardrobe
            </span>
            <p className="text-xs text-editorial-600 leading-snug">
              Upload a previously downloaded wardrobe file to restore or transfer between devices.
            </p>

            <div className="flex items-center gap-2 mb-2">
              <label className="text-[11px] font-semibold text-editorial-600">
                Import Mode:
              </label>
              <button
                onClick={() => setImportMode('merge')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                  importMode === 'merge'
                    ? 'bg-editorial-900 text-white border-editorial-900'
                    : 'bg-white text-editorial-700 border-editorial-200'
                }`}
              >
                Merge with Existing
              </button>
              <button
                onClick={() => setImportMode('replace')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                  importMode === 'replace'
                    ? 'bg-formula-red text-white border-formula-red'
                    : 'bg-white text-editorial-700 border-editorial-200'
                }`}
              >
                Replace All
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileImport}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="w-full py-2.5 rounded-2xl bg-white border border-editorial-300 text-editorial-900 text-xs font-bold hover:bg-editorial-100 transition active:scale-98 flex items-center justify-center gap-2 shadow-xs"
            >
              <Upload className="w-4 h-4 text-editorial-700" />
              <span>{isImporting ? 'Importing Data...' : 'Select Backup File to Restore'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
