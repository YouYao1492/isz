import React, { useState, useRef, useEffect } from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Layers,
  Phone,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    settings,
    categories,
    currentPath,
    navigate,
    resolveAssetUrl,
  } = useCatalog();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [logoError, setLogoError] = useState(false);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setMobileMenuOpen(false);
    } else {
      navigate('/products');
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white text-[#111318] shadow-xs border-b border-slate-200">
      {/* Slim Obsidian Top Banner */}
      <div className="bg-[#111318] text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center gap-1.5 text-slate-200 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{settings.shortAddress || settings.address}</span>
            </span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <a
              href={`tel:${settings.phone}`}
              className="hidden sm:inline-flex items-center gap-1 text-slate-200 hover:text-white transition-colors shrink-0"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{settings.phoneDisplay}</span>
            </a>
            {settings.website && settings.websiteUrl && (
              <>
                <span className="hidden lg:inline-block text-slate-600">|</span>
                <a
                  href={settings.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:inline-flex items-center text-sky-300 hover:text-sky-200 transition-colors shrink-0"
                >
                  {settings.website}
                </a>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center text-slate-400 shrink-0">
            <span>Est. {settings.establishedYear || '2015'} &middot; Authorized TP-Link Partner</span>
          </div>
        </div>
      </div>

      {/* Main White Navbar matching iSystemsZone Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md p-0.5"
              aria-label={`${settings.shopName} Home`}
            >
              {!logoError ? (
                <div className="h-10 overflow-hidden bg-white flex items-center">
                  <img
                    src={resolveAssetUrl('assets/src/logo.png')}
                    alt={settings.shopName}
                    onError={() => setLogoError(true)}
                    className="h-9 sm:h-10 w-auto object-contain [clip-path:inset(1%_1.5%_1%_1%)]"
                  />
                </div>
              ) : (
                <span className="text-xl font-extrabold tracking-tight text-[#111318] whitespace-nowrap">
                  iSystems<span className="text-red-600">Z</span>
                  <span className="text-amber-500">o</span>
                  <span className="text-blue-600">n</span>
                  <span className="text-emerald-600">e</span>
                </span>
              )}
            </button>
          </div>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Tapo model, 4K, solar, 4G, doorbell..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] text-[#111318] placeholder-slate-400 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:bg-white transition-all"
                aria-label="Search catalog products"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                isActive('/') && currentPath === '/'
                  ? 'text-red-700 bg-red-50'
                  : 'text-slate-700 hover:text-[#111318] hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => navigate('/products')}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                isActive('/products')
                  ? 'text-red-700 bg-red-50'
                  : 'text-slate-700 hover:text-[#111318] hover:bg-slate-100'
              }`}
            >
              All Products
            </button>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesDropdownRef}>
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                aria-expanded={categoriesOpen}
                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#111318] hover:bg-slate-100 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <Layers className="w-4 h-4 text-slate-500" />
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-[#111318]">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    Tapo Product Categories
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          navigate(`/category/${cat.slug}`);
                          setCategoriesOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <span className="font-medium">{cat.name}</span>
                        {cat.productCount !== undefined && (
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 tabular-nums">
                            {cat.productCount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 pt-1 mt-1 px-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/products');
                        setCategoriesOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-red-700 hover:text-red-800 font-semibold"
                    >
                      Browse full catalog &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Visit Store Primary Action Button */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/visit-us')}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              <MapPin className="w-4 h-4" />
              <span>Visit Our Shop</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#111318] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Subtle 4-Color Logo Signature Accent Hairline (Red · Yellow · Blue · Green) */}
      <div className="h-[3px] w-full grid grid-cols-4">
        <div className="bg-red-600" />
        <div className="bg-amber-400" />
        <div className="bg-blue-600" />
        <div className="bg-emerald-600" />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search Tapo model or specs..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] text-[#111318] placeholder-slate-400 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-red-600"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </form>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/products');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              All Products
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/visit-us');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-base font-semibold text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Visit Our Physical Shop</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
              Browse by Category
            </div>
            <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    navigate(`/category/${cat.slug}`);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:text-red-700 hover:bg-red-50 rounded flex justify-between items-center"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-slate-500 tabular-nums">{cat.productCount}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                navigate('/about');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-1 text-sm text-slate-600 hover:text-[#111318]"
            >
              About {settings.logoText}
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/contact');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-1 text-sm text-slate-600 hover:text-[#111318]"
            >
              Contact &amp; Enquiries
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
