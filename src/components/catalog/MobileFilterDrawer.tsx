import React from 'react';
import { CatalogFilterState } from '../../types/index.ts';
import { FilterSidebar } from './FilterSidebar.tsx';
import { X, Check } from 'lucide-react';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CatalogFilterState;
  onFilterChange: (newFilters: CatalogFilterState) => void;
  onResetFilters: () => void;
  resultCount: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  resultCount,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Filter products"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-5 py-4 bg-[#111318] text-white flex items-center justify-between border-b border-slate-800">
            <h2 className="text-base font-bold">Catalog Filters</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5">
            <FilterSidebar
              filters={filters}
              onFilterChange={onFilterChange}
              onResetFilters={onResetFilters}
            />
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
            <button
              onClick={onResetFilters}
              className="flex-1 bg-white border border-slate-300 text-slate-700 font-semibold text-xs py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-red-600 text-white font-semibold text-xs py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Show {resultCount} Items</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
