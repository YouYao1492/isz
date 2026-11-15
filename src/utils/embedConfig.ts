export type RoutingMode = 'path' | 'hash';

export interface CatalogEmbedConfig {
  routing?: 'auto' | 'path' | 'hash';
  apiBaseUrl?: string;
  csvUrl?: string;
  assetsBaseUrl?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
  initialRoute?: string;
}

declare global {
  interface Window {
    ISZ_CATALOG_CONFIG?: CatalogEmbedConfig;
  }
}

const STANDALONE_ROUTES = ['/products', '/category', '/visit-us', '/about', '/contact'];

export function normalizeEndpointBase(base?: string): string {
  if (!base) return '';
  return base.trim().replace(/\/+$/, '');
}

function parseBoolAttr(val: string | undefined): boolean | undefined {
  if (val === undefined) return undefined;
  const normalized = val.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  return undefined;
}

export function readEmbedConfig(
  mountElement: HTMLElement | null,
  win: Window | undefined = typeof window !== 'undefined' ? window : undefined
): CatalogEmbedConfig {
  const globalCfg: CatalogEmbedConfig = win?.ISZ_CATALOG_CONFIG || {};
  const dataset = mountElement?.dataset || {};

  const routingAttr = dataset.routing as CatalogEmbedConfig['routing'] | undefined;
  const hideHeaderAttr = parseBoolAttr(dataset.hideHeader);
  const hideFooterAttr = parseBoolAttr(dataset.hideFooter);

  return {
    routing: routingAttr || globalCfg.routing || 'auto',
    apiBaseUrl: normalizeEndpointBase(dataset.apiBase || globalCfg.apiBaseUrl),
    csvUrl: (dataset.csvUrl || globalCfg.csvUrl || '').trim() || undefined,
    assetsBaseUrl: normalizeEndpointBase(dataset.assetsBase || globalCfg.assetsBaseUrl),
    hideHeader: hideHeaderAttr ?? globalCfg.hideHeader ?? false,
    hideFooter: hideFooterAttr ?? globalCfg.hideFooter ?? false,
    initialRoute: (dataset.initialRoute || globalCfg.initialRoute || '').trim() || undefined,
  };
}

export function isStandaloneAppRoute(pathname: string): boolean {
  const clean = (pathname || '/').trim() || '/';
  if (clean === '/') return true;
  return STANDALONE_ROUTES.some(
    (prefix) => clean === prefix || clean.startsWith(`${prefix}/`)
  );
}

export function resolveRoutingMode(
  config: CatalogEmbedConfig,
  mountId: string,
  currentPathname: string
): RoutingMode {
  if (config.routing === 'hash') return 'hash';
  if (config.routing === 'path') return 'path';
  if (mountId !== 'root') return 'hash';
  if (!isStandaloneAppRoute(currentPathname)) return 'hash';
  return 'path';
}

export function parseHashLocation(
  hash: string,
  initialRoute: string = '/'
): { pathname: string; search: string } {
  const fallbackRoute = initialRoute.startsWith('/') ? initialRoute : `/${initialRoute}`;
  const raw = (hash || '').replace(/^#/, '').trim();
  if (!raw || raw === '/') {
    const [fp, fs] = fallbackRoute.split('?');
    return { pathname: fp || '/', search: fs ? `?${fs}` : '' };
  }

  const normalized = raw.startsWith('/') ? raw : `/${raw}`;
  const qIdx = normalized.indexOf('?');
  if (qIdx === -1) {
    return { pathname: normalized, search: '' };
  }
  return {
    pathname: normalized.slice(0, qIdx) || '/',
    search: normalized.slice(qIdx),
  };
}

export function formatHashHref(to: string): string {
  const clean = to.startsWith('/') ? to : `/${to}`;
  return `#${clean}`;
}

export function computeAssetUrl(
  relativePath: string,
  explicitBaseUrl?: string,
  moduleUrl: string = import.meta.url
): string {
  const cleanPath = relativePath.replace(/^\/+/, '');
  const base = normalizeEndpointBase(explicitBaseUrl);
  if (base) {
    return `${base}/${cleanPath}`;
  }

  if (moduleUrl) {
    try {
      const parsed = new URL(moduleUrl);
      const dir = parsed.pathname.slice(0, parsed.pathname.lastIndexOf('/') + 1);
      // Only treat as subpath bundle when hosted inside a subfolder (e.g. /wp-content/uploads/isz-catalog/)
      // rather than Vite dev (/src/...) or root Vite bundle (/assets/).
      if (
        dir !== '/' &&
        !dir.startsWith('/src/') &&
        dir !== '/assets/'
      ) {
        return `${parsed.origin}${dir}${cleanPath}`;
      }
    } catch {
      // Fall back to root-relative path
    }
  }

  return `/${cleanPath}`;
}
