import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { TAPO_INITIAL_PRODUCTS } from './src/data/tapoProducts.ts';
import { DEFAULT_STORE_SETTINGS, INITIAL_CATEGORIES } from './src/data/storeConfig.ts';
import { Product, StoreSettings, Category } from './src/types/index.ts';
import { parseCsv, normalizeSheetRows, generateSpreadsheetTemplateCsv } from './src/utils/sheets.ts';
import { enrichCategoriesWithCounts } from './src/utils/catalog.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

app.use(express.json());

// Allow cross-origin read-only API requests when embedded inside WordPress via HFCM
app.use('/api', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

const LOCAL_TAPO_CSV_PATH = path.resolve(
  __dirname,
  'public',
  'assets',
  'src',
  'products.csv'
);

function loadLocalTapoInventory(): Product[] {
  try {
    if (fs.existsSync(LOCAL_TAPO_CSV_PATH)) {
      const csvText = fs.readFileSync(LOCAL_TAPO_CSV_PATH, 'utf-8');
      const parsed = normalizeSheetRows(parseCsv(csvText));
      if (parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Catalog] Could not read local Tapo CSV from disk, using bundled Tapo inventory:', err);
  }
  return TAPO_INITIAL_PRODUCTS.filter((p) => p.published);
}

// --- Catalog Cache State ---
interface CatalogCache {
  products: Product[];
  lastFetchedAt: number;
  source: 'tapo_csv' | 'google_sheets_csv' | 'google_sheets_api';
  status: 'ok' | 'error' | 'fallback_to_csv';
  errorMessage?: string;
  cacheTtlMs: number;
}

const TTL_SECONDS = parseInt(process.env.CATALOG_CACHE_TTL_SECONDS || '300', 10);
const cache: CatalogCache = {
  products: loadLocalTapoInventory(),
  lastFetchedAt: Date.now(),
  source: 'tapo_csv',
  status: 'ok',
  cacheTtlMs: TTL_SECONDS * 1000,
};

/**
 * Fetch latest products from Google Sheets (published CSV or API) with caching.
 * Defaults to the local TP-Link Tapo inventory CSV when Google Sheets is not configured.
 */
async function getOrUpdateCatalog(forceRefresh: boolean = false): Promise<CatalogCache> {
  const now = Date.now();
  const isExpired = now - cache.lastFetchedAt > cache.cacheTtlMs;

  if (!forceRefresh && !isExpired && cache.products.length > 0) {
    return cache;
  }

  const sheetCsvUrl = process.env.GOOGLE_SHEET_CSV_URL;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (sheetCsvUrl) {
    try {
      console.log(`[Google Sheets] Fetching published CSV from: ${sheetCsvUrl}`);
      const res = await fetch(sheetCsvUrl, { headers: { Accept: 'text/csv' } });
      if (!res.ok) {
        throw new Error(`Google Sheets responded with HTTP status ${res.status}`);
      }
      const csvText = await res.text();
      const records = parseCsv(csvText);
      const normalized = normalizeSheetRows(records);

      if (normalized.length > 0) {
        cache.products = normalized;
        cache.lastFetchedAt = Date.now();
        cache.source = 'google_sheets_csv';
        cache.status = 'ok';
        cache.errorMessage = undefined;
        console.log(`[Google Sheets] Successfully loaded ${normalized.length} published products from CSV feed.`);
        return cache;
      } else {
        throw new Error('Google Sheet returned 0 valid published product rows');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Google Sheets Error] CSV fetch failed: ${msg}. Retaining local Tapo CSV inventory.`);
      cache.status = 'fallback_to_csv';
      cache.errorMessage = msg;
    }
  } else if (sheetId && apiKey) {
    try {
      const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Products!A1:Z500?key=${apiKey}`;
      console.log(`[Google Sheets API] Fetching from spreadsheet ${sheetId}`);
      const res = await fetch(apiUrl);
      if (!res.ok) {
        throw new Error(`Google Sheets API responded with status ${res.status}`);
      }
      const data = await res.json();
      const values: string[][] = data.values || [];
      if (values.length > 1) {
        const headers = values[0].map((h: string) => h.toLowerCase().trim());
        const records: Record<string, string>[] = [];
        for (let i = 1; i < values.length; i++) {
          const row = values[i];
          const rec: Record<string, string> = {};
          for (let c = 0; c < headers.length; c++) {
            rec[headers[c]] = row[c] || '';
          }
          records.push(rec);
        }
        const normalized = normalizeSheetRows(records);
        if (normalized.length > 0) {
          cache.products = normalized;
          cache.lastFetchedAt = Date.now();
          cache.source = 'google_sheets_api';
          cache.status = 'ok';
          cache.errorMessage = undefined;
          return cache;
        }
      }
      throw new Error('No rows found in Products tab');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Google Sheets API Error] ${msg}. Using local Tapo CSV inventory.`);
      cache.status = 'fallback_to_csv';
      cache.errorMessage = msg;
    }
  }

  // Primary local inventory: Tapo CSV
  if (cache.products.length === 0 || cache.source === 'tapo_csv' || forceRefresh) {
    cache.products = loadLocalTapoInventory();
    cache.lastFetchedAt = Date.now();
    cache.source = 'tapo_csv';
    cache.status = 'ok';
  }

  return cache;
}

// Compute categories with live product counts (matches category or subcategory slug)
function getEnrichedCategories(products: Product[]): Category[] {
  return enrichCategoriesWithCounts(INITIAL_CATEGORIES, products);
}

// --- API Routes ---

// GET /api/products
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const currentCache = await getOrUpdateCatalog(req.query.force === '1');
    const products = currentCache.products;

    const brandsSet = new Set<string>();
    const departmentsSet = new Set<string>();
    const resolutionsSet = new Set<string>();
    const featuresSet = new Set<string>();
    const connectorTypesSet = new Set<string>();
    const wattagesSet = new Set<number>();
    const cableLengthsSet = new Set<string>();
    const compatibilityBrandsSet = new Set<string>();

    for (const p of products) {
      if (p.brand) brandsSet.add(p.brand);
      if (p.category) departmentsSet.add(p.category);
      if (p.resolution) resolutionsSet.add(p.resolution);
      if (p.features) {
        for (const f of p.features) featuresSet.add(f);
      }
      if (p.connector_type) connectorTypesSet.add(p.connector_type);
      if (p.power_watts) wattagesSet.add(p.power_watts);
      if (p.cable_length) cableLengthsSet.add(p.cable_length);
      if (p.compatibility) {
        for (const comp of p.compatibility) {
          compatibilityBrandsSet.add(comp);
        }
      }
    }

    const resolutionOrder = ['4K / 8MP', '3K / 5MP', '2K QHD / 4MP', '2K / 3MP', '1080P / 2MP'];
    const sortedResolutions = Array.from(resolutionsSet).sort((a, b) => {
      const idxA = resolutionOrder.indexOf(a);
      const idxB = resolutionOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    const categories = getEnrichedCategories(products);

    res.json({
      products,
      total: products.length,
      categories,
      brands: Array.from(brandsSet).sort(),
      availableFilters: {
        departments: Array.from(departmentsSet),
        resolutions: sortedResolutions,
        features: Array.from(featuresSet).sort(),
        connectorTypes: Array.from(connectorTypesSet).sort(),
        wattages: Array.from(wattagesSet).sort((a, b) => a - b),
        cableLengths: Array.from(cableLengthsSet).sort(),
        compatibilityBrands: Array.from(compatibilityBrandsSet).sort(),
      },
      isDemoData: false,
      source: currentCache.source,
      status: currentCache.status,
      lastUpdated: new Date(currentCache.lastFetchedAt).toISOString(),
      cacheTtlSeconds: TTL_SECONDS,
      errorMessage: currentCache.errorMessage,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: 'Failed to retrieve catalog', details: msg });
  }
});

// GET /api/products/:slug
app.get('/api/products/:slug', async (req: Request, res: Response) => {
  try {
    const currentCache = await getOrUpdateCatalog();
    const product = currentCache.products.find(
      (p) => p.slug.toLowerCase() === req.params.slug.toLowerCase() && p.published
    );

    if (!product) {
      res.status(404).json({ error: 'Product not found or not published' });
      return;
    }

    res.json(product);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: 'Failed to retrieve product details', details: msg });
  }
});

// GET /api/categories
app.get('/api/categories', async (_req: Request, res: Response) => {
  const currentCache = await getOrUpdateCatalog();
  const categories = getEnrichedCategories(currentCache.products);
  res.json(categories);
});

// GET /api/settings
app.get('/api/settings', async (_req: Request, res: Response) => {
  const currentCache = await getOrUpdateCatalog();
  const settings: StoreSettings = {
    ...DEFAULT_STORE_SETTINGS,
    isDemoData: false,
    lastUpdated: new Date(currentCache.lastFetchedAt).toISOString(),
    sheetSourceType: currentCache.source,
    sheetId: process.env.GOOGLE_SHEET_ID ? 'Configured (Masked)' : undefined,
  };
  res.json(settings);
});

// POST /api/sync (Force cache revalidation)
app.post('/api/sync', async (_req: Request, res: Response) => {
  try {
    const currentCache = await getOrUpdateCatalog(true);
    res.json({
      success: true,
      source: currentCache.source,
      status: currentCache.status,
      count: currentCache.products.length,
      lastUpdated: new Date(currentCache.lastFetchedAt).toISOString(),
      errorMessage: currentCache.errorMessage,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// GET /api/sheets-template.csv
app.get('/api/sheets-template.csv', (_req: Request, res: Response) => {
  const csv = generateSpreadsheetTemplateCsv();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="tapo_product_catalog_template.csv"');
  res.send(csv);
});

// Dynamic XML Sitemap
app.get('/sitemap.xml', async (_req: Request, res: Response) => {
  const currentCache = await getOrUpdateCatalog();
  const products = currentCache.products;
  const categories = INITIAL_CATEGORIES;

  const staticUrls = [
    { loc: `${APP_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${APP_URL}/products`, priority: '0.9', changefreq: 'daily' },
    { loc: `${APP_URL}/visit-us`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${APP_URL}/about`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${APP_URL}/contact`, priority: '0.7', changefreq: 'monthly' },
  ];

  const categoryUrls = categories.map((cat) => ({
    loc: `${APP_URL}/category/${cat.slug}`,
    priority: '0.8',
    changefreq: 'daily',
  }));

  const productUrls = products.map((p) => ({
    loc: `${APP_URL}/products/${p.slug}`,
    priority: '0.7',
    changefreq: 'weekly',
  }));

  const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

// robots.txt
app.get('/robots.txt', (_req: Request, res: Response) => {
  const robots = `User-agent: *
Allow: /
Allow: /products
Allow: /category/
Allow: /visit-us
Allow: /about
Allow: /contact
Disallow: /api/

Sitemap: ${APP_URL}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  res.send(robots);
});

// --- Frontend Mounting (Vite in dev, Dist in prod) ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`I Systems Zone Catalog Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
