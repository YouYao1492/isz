import React from 'react';
import { CatalogFilterState } from '../../types/index.ts';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { Filter, RotateCcw, Camera, ShieldCheck, Layers } from 'lucide-react';

interface FilterSidebarProps {
  filters: CatalogFilterState;
  onFilterChange: (newFilters: CatalogFilterState) => void;
  onResetFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const { categories, availableFilters, settings } = useCatalog();

  const handleCategorySelect = (catSlug: string) => {
    onFilterChange({
      ...filters,
      category: catSlug,
      subcategory: 'all',
    });
  };

  const handleDepartmentSelect = (dept: string) => {
    onFilterChange({
      ...filters,
      department: dept,
      category: 'all',
    });
  };

  return (
    <aside className="w-full space-y-6 text-sm text-[#111318]">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2 font-bold text-base text-[#111318]">
          <Filter className="w-4 h-4 text-red-600" />
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-800 font-semibold transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear all</span>
        </button>
      </div>

      {/* Department Toggle (CCTV & Security vs Smart Home) */}
      {availableFilters.departments && availableFilters.departments.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#525866] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-red-600" />
            <span>Department</span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleDepartmentSelect('all')}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                !filters.department || filters.department === 'all'
                  ? 'bg-red-600 text-white border-red-600 font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            {availableFilters.departments.map((dept) => {
              const active = filters.department.toLowerCase() === dept.toLowerCase();
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => handleDepartmentSelect(dept)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    active
                      ? 'bg-red-600 text-white border-red-600 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Category List */}
      <div className="space-y-2 pt-3 border-t border-[#E2E8F0]">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#525866]">
          Category Series
        </h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => handleCategorySelect('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-between items-center ${
              filters.category === 'all' || !filters.category
                ? 'bg-[#111318] text-white font-semibold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>All Series</span>
          </button>
          {categories.map((cat) => {
            const isSelected =
              filters.category === cat.slug ||
              filters.category.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-between items-center ${
                  isSelected
                    ? 'bg-[#111318] text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{cat.name}</span>
                {cat.productCount !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded tabular-nums ${
                      isSelected ? 'bg-red-600 text-white' : 'text-slate-500 bg-slate-100'
                    }`}
                  >
                    {cat.productCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Camera Resolution Filter */}
      {availableFilters.resolutions && availableFilters.resolutions.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Video Resolution</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, resolution: 'all' })}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                !filters.resolution || filters.resolution === 'all'
                  ? 'bg-red-600 text-white border-red-600 font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Any
            </button>
            {availableFilters.resolutions.map((res) => {
              const active = filters.resolution === res;
              return (
                <button
                  key={res}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, resolution: res })}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    active
                      ? 'bg-red-600 text-white border-red-600 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {res}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CCTV & Smart Capabilities */}
      {availableFilters.features && availableFilters.features.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Key Capabilities</span>
          </div>
          <select
            value={filters.feature || 'all'}
            onChange={(e) =>
              onFilterChange({ ...filters, feature: e.target.value })
            }
            aria-label="Filter by camera capability"
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-500"
          >
            <option value="all">All Capabilities</option>
            {availableFilters.features.map((feat) => (
              <option key={feat} value={feat}>
                {feat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#525866]">
          Unit Price Range ({settings.currencySymbol})
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="filter-min-price" className="text-[11px] text-slate-500">
              Min ({settings.currencySymbol})
            </label>
            <input
              id="filter-min-price"
              type="number"
              min="0"
              placeholder="0"
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  minPrice: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label htmlFor="filter-max-price" className="text-[11px] text-slate-500">
              Max ({settings.currencySymbol})
            </label>
            <input
              id="filter-max-price"
              type="number"
              min="0"
              placeholder="800"
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  maxPrice: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { label: `Under ${settings.currencySymbol}150`, min: null, max: 150 },
            { label: `${settings.currencySymbol}150 - ${settings.currencySymbol}250`, min: 150, max: 250 },
            { label: `${settings.currencySymbol}250 - ${settings.currencySymbol}450`, min: 250, max: 450 },
            { label: `${settings.currencySymbol}450+`, min: 450, max: null },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  minPrice: preset.min,
                  maxPrice: preset.max,
                })
              }
              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
