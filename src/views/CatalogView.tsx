import React, { useState, useMemo, useEffect } from 'react';
import { useCatalog } from '../context/CatalogContext.tsx';
import { ProductCard } from '../components/common/ProductCard.tsx';
import { SkeletonCard } from '../components/common/SkeletonCard.tsx';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import { Pagination } from '../components/common/Pagination.tsx';
import { FilterSidebar } from '../components/catalog/FilterSidebar.tsx';
import { MobileFilterDrawer } from '../components/catalog/MobileFilterDrawer.tsx';
import { ActiveFilterPills } from '../components/catalog/ActiveFilterPills.tsx';
import { CatalogFilterState, SortOption } from '../types/index.ts';
import { filterProducts, sortProducts, slugifyValue } from '../utils/catalog.ts';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  RotateCcw,
  X,
} from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export const CatalogView: React.FC = () => {
  const { products, loading, searchParams, routeParams, navigate, categories, settings } = useCatalog();

  const routeCategorySlug = routeParams.slug || '';
  const initialCategory = routeCategorySlug || searchParams.get('category') || 'all';
  const initialDepartment = searchParams.get('department') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = (searchParams.get('sort') as SortOption) || 'recommended';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [filters, setFilters] = useState<CatalogFilterState>({
    searchQuery: initialSearch,
    department: initialDepartment,
    category: initialCategory,
    subcategory: 'all',
    brands: [],
    minPrice: null,
    maxPrice: null,
    availability: [],
    resolution: 'all',
    feature: 'all',
    connectorType: 'all',
    minWattage: null,
    maxWattage: null,
    cableLength: 'all',
    compatibilityBrand: 'all',
  });

  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const q = searchParams.get('search') || '';
    const cat = routeParams.slug || searchParams.get('category') || 'all';
    const dept = searchParams.get('department') || 'all';
    const s = (searchParams.get('sort') as SortOption) || 'recommended';
    const p = parseInt(searchParams.get('page') || '1', 10);

    setFilters((prev) => ({
      ...prev,
      searchQuery: q,
      category: cat,
      department: dept,
    }));
    setSortBy(s);
    setCurrentPage(p);
  }, [searchParams, routeParams.slug]);

  useEffect(() => {
    const activeCat = categories.find(
      (c) => c.slug === filters.category || slugifyValue(c.name) === slugifyValue(filters.category)
    );
    const catName = activeCat
      ? activeCat.name
      : filters.department !== 'all'
      ? filters.department
      : 'Tapo CCTV & Smart Home Catalog';
    document.title = `${catName} | ${settings.shopName}`;
  }, [filters.category, filters.department, categories, settings.shopName]);

  const filteredProducts = useMemo(() => {
    const result = filterProducts(products, filters);
    return sortProducts(result, sortBy);
  }, [products, filters, sortBy]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleFilterChange = (newFilters: CatalogFilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);

    const params = new URLSearchParams();
    if (newFilters.searchQuery) params.set('search', newFilters.searchQuery);
    if (newFilters.department && newFilters.department !== 'all') {
      params.set('department', newFilters.department);
    }
    if (newFilters.category && newFilters.category !== 'all') {
      params.set('category', newFilters.category);
    }
    if (sortBy !== 'recommended') params.set('sort', sortBy);
    navigate(`/products${params.toString() ? '?' + params.toString() : ''}`, true);
  };

  const handleResetFilters = () => {
    const reset: CatalogFilterState = {
      searchQuery: '',
      department: 'all',
      category: 'all',
      subcategory: 'all',
      brands: [],
      minPrice: null,
      maxPrice: null,
      availability: [],
      resolution: 'all',
      feature: 'all',
      connectorType: 'all',
      minWattage: null,
      maxWattage: null,
      cableLength: 'all',
      compatibilityBrand: 'all',
    };
    setFilters(reset);
    setCurrentPage(1);
    navigate('/products', true);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const activeCategoryTitle = useMemo(() => {
    if (filters.category && filters.category !== 'all') {
      const matched = categories.find(
        (c) => c.slug === filters.category || slugifyValue(c.name) === slugifyValue(filters.category)
      );
      if (matched) return matched.name;
      if (slugifyValue(filters.category) === 'cctv-security') return 'CCTV & Security';
      if (slugifyValue(filters.category) === 'smart-home') return 'Smart Home';
      return 'Filtered Catalog';
    }
    if (filters.department && filters.department !== 'all') {
      return filters.department;
    }
    return 'All Tapo Products';
  }, [filters.category, filters.department, categories]);

  return (
    <div className="bg-[#FFFFFF] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Products', path: '/products' }]} />

        {/* Page Header */}
        <div className="py-4 border-b border-[#E2E8F0] mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
                {activeCategoryTitle}
              </h1>
              <p className="text-sm text-[#525866] mt-1 max-w-2xl">
                Browse our complete TP-Link Tapo CCTV surveillance lineup—outdoor pan/tilt cameras, 4G solar camera kits, video doorbells, and compatible smart hubs &amp; sensors.
              </p>
            </div>

            <div className="w-full md:w-80">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Tapo model, 4K, solar, 4G..."
                  value={filters.searchQuery}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, searchQuery: e.target.value })
                  }
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#F8FAFC] border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                  aria-label="Filter catalog results"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                {filters.searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange({ ...filters, searchQuery: '' })}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Category Shortcuts on Mobile / Tablet */}
        <div className="flex lg:hidden overflow-x-auto pb-3 gap-2 no-scrollbar mb-4">
          <button
            type="button"
            onClick={() => handleFilterChange({ ...filters, category: 'all' })}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              filters.category === 'all'
                ? 'bg-[#111318] text-white font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleFilterChange({ ...filters, category: cat.slug })}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                filters.category === cat.slug
                  ? 'bg-[#111318] text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Main 2-Column Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  aria-label="Open filter panel"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                <p className="text-xs sm:text-sm text-[#525866] tabular-nums">
                  Showing <span className="font-bold text-[#111318]">{totalItems}</span>{' '}
                  {totalItems === 1 ? 'product' : 'products'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-red-500"
                    aria-label="Sort products"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                </div>

                <div className="hidden sm:flex items-center border border-slate-200 rounded-lg p-0.5 bg-[#F8FAFC]">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded ${
                      viewMode === 'grid'
                        ? 'bg-white shadow-xs text-red-600'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Grid view"
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1 rounded ${
                      viewMode === 'list'
                        ? 'bg-white shadow-xs text-red-600'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="List view"
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <ActiveFilterPills
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.sku} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-500">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#111318]">No products found</h3>
                <p className="text-xs sm:text-sm text-[#525866] max-w-md mx-auto">
                  We couldn&apos;t find any Tapo products matching your current filters. Try clearing your resolution, capability, or price filters.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Clear all filters</span>
                  </button>
                </div>
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </div>
      </div>

      <MobileFilterDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        resultCount={totalItems}
      />
    </div>
  );
};
