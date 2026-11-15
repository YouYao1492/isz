import React from 'react';
import { CatalogFilterState } from '../../types/index.ts';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { X } from 'lucide-react';

interface ActiveFilterPillsProps {
  filters: CatalogFilterState;
  onFilterChange: (newFilters: CatalogFilterState) => void;
  onResetFilters: () => void;
}

export const ActiveFilterPills: React.FC<ActiveFilterPillsProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const { categories, settings } = useCatalog();

  const pills: { label: string; onRemove: () => void }[] = [];

  if (filters.searchQuery) {
    pills.push({
      label: `"${filters.searchQuery}"`,
      onRemove: () => onFilterChange({ ...filters, searchQuery: '' }),
    });
  }

  if (filters.department && filters.department !== 'all') {
    pills.push({
      label: `Department: ${filters.department}`,
      onRemove: () => onFilterChange({ ...filters, department: 'all' }),
    });
  }

  if (filters.category && filters.category !== 'all') {
    const matched = categories.find(
      (c) => c.slug === filters.category || c.name.toLowerCase() === filters.category.toLowerCase()
    );
    pills.push({
      label: `Series: ${matched ? matched.name : filters.category}`,
      onRemove: () => onFilterChange({ ...filters, category: 'all' }),
    });
  }

  if (filters.resolution && filters.resolution !== 'all') {
    pills.push({
      label: `Resolution: ${filters.resolution}`,
      onRemove: () => onFilterChange({ ...filters, resolution: 'all' }),
    });
  }

  if (filters.feature && filters.feature !== 'all') {
    pills.push({
      label: `Capability: ${filters.feature}`,
      onRemove: () => onFilterChange({ ...filters, feature: 'all' }),
    });
  }

  filters.brands.forEach((brand) => {
    pills.push({
      label: `Brand: ${brand}`,
      onRemove: () =>
        onFilterChange({
          ...filters,
          brands: filters.brands.filter((b) => b !== brand),
        }),
    });
  });

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    let priceLabel = 'Price: ';
    if (filters.minPrice !== null && filters.maxPrice !== null) {
      priceLabel += `${settings.currencySymbol}${filters.minPrice} - ${settings.currencySymbol}${filters.maxPrice}`;
    } else if (filters.minPrice !== null) {
      priceLabel += `Over ${settings.currencySymbol}${filters.minPrice}`;
    } else if (filters.maxPrice !== null) {
      priceLabel += `Under ${settings.currencySymbol}${filters.maxPrice}`;
    }
    pills.push({
      label: priceLabel,
      onRemove: () => onFilterChange({ ...filters, minPrice: null, maxPrice: null }),
    });
  }

  filters.availability.forEach((avail) => {
    pills.push({
      label: `Status: ${avail}`,
      onRemove: () =>
        onFilterChange({
          ...filters,
          availability: filters.availability.filter((a) => a !== avail),
        }),
    });
  });

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs text-slate-500 font-medium">Active filters:</span>
      {pills.map((pill, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-800 border border-red-200 px-2.5 py-1 rounded-md font-medium"
        >
          <span>{pill.label}</span>
          <button
            type="button"
            onClick={pill.onRemove}
            className="hover:text-red-950 p-0.5 rounded hover:bg-red-100 transition-colors"
            aria-label={`Remove filter ${pill.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onResetFilters}
        className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 ml-1"
      >
        Clear all
      </button>
    </div>
  );
};
