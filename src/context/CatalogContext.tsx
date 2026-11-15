import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Product,
  Category,
  StoreSettings,
  CatalogResponse,
} from '../types/index.ts';
import { DEFAULT_STORE_SETTINGS, INITIAL_CATEGORIES } from '../data/storeConfig.ts';
import { TAPO_INITIAL_PRODUCTS } from '../data/tapoProducts.ts';
import { enrichCategoriesWithCounts } from '../utils/catalog.ts';
import { parseCsv, normalizeSheetRows } from '../utils/sheets.ts';
import {
  CatalogEmbedConfig,
  RoutingMode,
  resolveRoutingMode,
  parseHashLocation,
  formatHashHref,
  computeAssetUrl,
  normalizeEndpointBase,
} from '../utils/embedConfig.ts';

interface CatalogContextType {
  products: Product[];
  categories: Category[];
  brands: string[];
  availableFilters: CatalogResponse['availableFilters'];
  settings: StoreSettings;
  loading: boolean;
  error: string | null;
  isDemoData: boolean;
  source: string;
  lastUpdated: string;
  refreshCatalog: (force?: boolean) => Promise<void>;

  // Recently Viewed (stored locally, no tracking)
  recentlyViewedSkus: string[];
  addRecentlyViewed: (sku: string) => void;

  // Routing
  currentPath: string;
  routeParams: Record<string, string>;
  searchParams: URLSearchParams;
  navigate: (to: string, replace?: boolean) => void;
  routingMode: RoutingMode;

  // Embed / WordPress HFCM support
  embedConfig: CatalogEmbedConfig;
  resolveAssetUrl: (relativePath: string) => string;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

function parsePath(pathname: string): { path: string; params: Record<string, string> } {
  const cleanPath = pathname.split('?')[0] || '/';

  const productMatch = cleanPath.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    return { path: '/products/:slug', params: { slug: productMatch[1] } };
  }

  const categoryMatch = cleanPath.match(/^\/category\/([^/]+)$/);
  if (categoryMatch) {
    return { path: '/category/:slug', params: { slug: categoryMatch[1] } };
  }

  return { path: cleanPath, params: {} };
}

function buildFallbackFilters(products: Product[]): CatalogResponse['availableFilters'] {
  const departments = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const resolutions = Array.from(new Set(products.map((p) => p.resolution).filter(Boolean) as string[]));
  const features = Array.from(new Set(products.flatMap((p) => p.features || []))).sort();
  return {
    departments,
    resolutions,
    features,
    connectorTypes: [],
    wattages: [],
    cableLengths: [],
    compatibilityBrands: [],
  };
}

interface CatalogProviderProps {
  children: React.ReactNode;
  embedConfig?: CatalogEmbedConfig;
  mountId?: string;
}

export const CatalogProvider: React.FC<CatalogProviderProps> = ({
  children,
  embedConfig = {},
  mountId = 'root',
}) => {
  const routingMode = useMemo<RoutingMode>(
    () => resolveRoutingMode(embedConfig, mountId, window.location.pathname || '/'),
    [embedConfig, mountId]
  );

  const initialLocation = useMemo(() => {
    if (routingMode === 'hash') {
      return parseHashLocation(window.location.hash, embedConfig.initialRoute || '/');
    }
    return {
      pathname: window.location.pathname || '/',
      search: window.location.search || '',
    };
  }, [routingMode, embedConfig.initialRoute]);

  const initialProducts = useMemo(
    () => TAPO_INITIAL_PRODUCTS.filter((p) => p.published),
    []
  );

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(() =>
    enrichCategoriesWithCounts(INITIAL_CATEGORIES, initialProducts)
  );
  const [brands, setBrands] = useState<string[]>(['TP-Link']);
  const [availableFilters, setAvailableFilters] = useState<CatalogResponse['availableFilters']>(() =>
    buildFallbackFilters(initialProducts)
  );
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoData, setIsDemoData] = useState<boolean>(false);
  const [source, setSource] = useState<string>('tapo_csv');
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  const [currentPath, setCurrentPath] = useState<string>(initialLocation.pathname);
  const [routeParams, setRouteParams] = useState<Record<string, string>>(
    () => parsePath(initialLocation.pathname).params
  );
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    () => new URLSearchParams(initialLocation.search)
  );

  const [recentlyViewedSkus, setRecentlyViewedSkus] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('isz_recent_skus');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const navigate = useCallback(
    (to: string, replace: boolean = false) => {
      const url = new URL(to, window.location.origin);

      if (routingMode === 'hash') {
        const hashTarget = formatHashHref(`${url.pathname}${url.search}`);
        if (replace) {
          window.history.replaceState({}, '', hashTarget);
        } else {
          window.history.pushState({}, '', hashTarget);
        }
      } else {
        if (replace) {
          window.history.replaceState({}, '', to);
        } else {
          window.history.pushState({}, '', to);
        }
      }

      const { params } = parsePath(url.pathname);
      setCurrentPath(url.pathname);
      setRouteParams(params);
      setSearchParams(new URLSearchParams(url.search));

      const mountNode = document.getElementById(mountId);
      if (mountNode && mountId !== 'root') {
        mountNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [routingMode, mountId]
  );

  useEffect(() => {
    const syncLocation = () => {
      if (routingMode === 'hash') {
        const loc = parseHashLocation(window.location.hash, embedConfig.initialRoute || '/');
        const { params } = parsePath(loc.pathname);
        setCurrentPath(loc.pathname);
        setRouteParams(params);
        setSearchParams(new URLSearchParams(loc.search));
      } else {
        const { params } = parsePath(window.location.pathname);
        setCurrentPath(window.location.pathname);
        setRouteParams(params);
        setSearchParams(new URLSearchParams(window.location.search));
      }
    };

    window.addEventListener('popstate', syncLocation);
    window.addEventListener('hashchange', syncLocation);
    return () => {
      window.removeEventListener('popstate', syncLocation);
      window.removeEventListener('hashchange', syncLocation);
    };
  }, [routingMode, embedConfig.initialRoute]);

  const applyProductDataset = useCallback((items: Product[], sourceLabel: string) => {
    const publishedItems = items.filter((p) => p.published);
    const active = publishedItems.length > 0 ? publishedItems : initialProducts;
    setProducts(active);
    setCategories(enrichCategoriesWithCounts(INITIAL_CATEGORIES, active));
    setBrands(Array.from(new Set(active.map((p) => p.brand).filter(Boolean))).sort());
    setAvailableFilters(buildFallbackFilters(active));
    setIsDemoData(false);
    setSource(sourceLabel);
    setLastUpdated(new Date().toISOString());
    setError(null);
  }, [initialProducts]);

  const refreshCatalog = useCallback(
    async (force: boolean = false) => {
      setLoading(true);
      setError(null);
      try {
        // 1. Direct CSV URL configured for WordPress / Google Sheets embed
        if (embedConfig.csvUrl) {
          const res = await fetch(embedConfig.csvUrl);
          if (!res.ok) {
            throw new Error(`CSV feed returned status ${res.status}`);
          }
          const csvText = await res.text();
          const parsed = normalizeSheetRows(parseCsv(csvText));
          applyProductDataset(parsed, 'tapo_csv');
          return;
        }

        const apiBase = normalizeEndpointBase(embedConfig.apiBaseUrl);

        // 2. Embedded in WordPress without a remote Node API base -> use bundled CSV dataset directly (zero 404s)
        if (mountId !== 'root' && !apiBase) {
          applyProductDataset(initialProducts, 'tapo_csv');
          return;
        }

        // 3. Standalone Express API or configured remote API base
        const productsEndpoint = `${apiBase}/api/products${force ? '?force=1' : ''}`;
        const res = await fetch(productsEndpoint);
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        const data: CatalogResponse = await res.json();
        const items = data.products || [];
        setProducts(items);
        setCategories(data.categories || enrichCategoriesWithCounts(INITIAL_CATEGORIES, items));
        setBrands(data.brands || []);
        setAvailableFilters(
          data.availableFilters || buildFallbackFilters(items)
        );
        setIsDemoData(Boolean(data.isDemoData));
        setSource(data.source || 'tapo_csv');
        setLastUpdated(data.lastUpdated);

        const settingsRes = await fetch(`${apiBase}/api/settings`);
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn('[Catalog] Falling back to bundled Tapo inventory:', msg);
        applyProductDataset(initialProducts, 'tapo_csv');
      } finally {
        setLoading(false);
      }
    },
    [embedConfig.csvUrl, embedConfig.apiBaseUrl, mountId, initialProducts, applyProductDataset]
  );

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const addRecentlyViewed = useCallback((sku: string) => {
    setRecentlyViewedSkus((prev) => {
      const filtered = prev.filter((s) => s !== sku);
      const next = [sku, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('isz_recent_skus', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const resolveAssetUrl = useCallback(
    (relativePath: string) => computeAssetUrl(relativePath, embedConfig.assetsBaseUrl),
    [embedConfig.assetsBaseUrl]
  );

  return (
    <CatalogContext.Provider
      value={{
        products,
        categories,
        brands,
        availableFilters,
        settings,
        loading,
        error,
        isDemoData,
        source,
        lastUpdated,
        refreshCatalog,
        recentlyViewedSkus,
        addRecentlyViewed,
        currentPath,
        routeParams,
        searchParams,
        navigate,
        routingMode,
        embedConfig,
        resolveAssetUrl,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
