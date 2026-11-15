import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  filterProducts,
  sortProducts,
  formatPrice,
  createProductInquiryUrl,
  generateProductJsonLd,
  generateLocalBusinessJsonLd,
  enrichCategoriesWithCounts,
} from './catalog.ts';
import {
  parseCsv,
  validateAndNormalizeProductRow,
  normalizeSheetRows,
  normalizeImageUrl,
  generateSpreadsheetTemplateCsv,
} from './sheets.ts';
import {
  resolveRoutingMode,
  parseHashLocation,
  formatHashHref,
  computeAssetUrl,
  readEmbedConfig,
} from './embedConfig.ts';
import { TAPO_INITIAL_PRODUCTS } from '../data/tapoProducts.ts';
import { DEFAULT_STORE_SETTINGS, INITIAL_CATEGORIES } from '../data/storeConfig.ts';
import { Product, StoreSettings } from '../types/index.ts';

const testSettings: StoreSettings = DEFAULT_STORE_SETTINGS;

test('TAPO_INITIAL_PRODUCTS matches the 42 items from attached CSV without mock data', () => {
  const csvPath = path.resolve(process.cwd(), 'public/assets/src/products.csv');
  const csvText = fs.readFileSync(csvPath, 'utf-8');
  const parsedCsvProducts = normalizeSheetRows(parseCsv(csvText));

  assert.equal(parsedCsvProducts.length, 42);
  assert.equal(TAPO_INITIAL_PRODUCTS.length, 42);
  assert.equal(TAPO_INITIAL_PRODUCTS.every((p) => p.brand === 'TP-Link'), true);
  assert.equal(
    TAPO_INITIAL_PRODUCTS.every((p) =>
      p.image_url.startsWith('https://lh3.googleusercontent.com/d/')
    ),
    true
  );
  assert.deepEqual(
    TAPO_INITIAL_PRODUCTS.map((p) => p.image_url),
    parsedCsvProducts.map((p) => p.image_url)
  );

  const cctvCount = TAPO_INITIAL_PRODUCTS.filter((p) => p.category === 'CCTV & Security').length;
  const smartHomeCount = TAPO_INITIAL_PRODUCTS.filter((p) => p.category === 'Smart Home').length;
  assert.equal(cctvCount, 28);
  assert.equal(smartHomeCount, 14);
});

test('filterProducts matches Tapo department, subcategory slugs, resolution, and capabilities', () => {
  const outdoor = filterProducts(TAPO_INITIAL_PRODUCTS, { category: 'outdoor-cameras' });
  assert.equal(outdoor.length, 12);

  const solarBattery = filterProducts(TAPO_INITIAL_PRODUCTS, { category: 'solar-battery' });
  assert.equal(solarBattery.length, 7);

  const cctvDept = filterProducts(TAPO_INITIAL_PRODUCTS, { department: 'CCTV & Security' });
  assert.equal(cctvDept.length, 28);

  const fourK = filterProducts(TAPO_INITIAL_PRODUCTS, { resolution: '4K / 8MP' });
  assert.equal(fourK.length, 2); // Tapo C575D and Tapo C260

  const lte = filterProducts(TAPO_INITIAL_PRODUCTS, { feature: '4G LTE' });
  assert.equal(lte.length, 3); // C665G Kit, C615G Kit, C501GW
});

test('filterProducts excludes unpublished products and matches model search', () => {
  const withDraft: Product[] = [
    ...TAPO_INITIAL_PRODUCTS,
    {
      sku: 'TAPO-DRAFT',
      slug: 'tapo-draft',
      name: 'Tapo Draft Camera',
      category: 'CCTV & Security',
      subcategory: 'Outdoor Cameras',
      brand: 'TP-Link',
      price: 199,
      currency: 'USD',
      image_url: '',
      description: 'Draft row',
      published: false,
      availability: 'Confirm availability',
    },
  ];

  const allPublished = filterProducts(withDraft, {});
  assert.equal(allPublished.some((p) => p.sku === 'TAPO-DRAFT'), false);

  const c520 = filterProducts(TAPO_INITIAL_PRODUCTS, { searchQuery: 'C520WS' });
  assert.equal(c520.length, 1);
  assert.equal(c520[0].price, 189);
});

test('sortProducts sorts Tapo products deterministically by price and name', () => {
  const priceAsc = sortProducts(TAPO_INITIAL_PRODUCTS, 'price-asc');
  assert.equal(priceAsc[0].price, 39);
  assert.equal(priceAsc[priceAsc.length - 1].price, 759);

  const priceDesc = sortProducts(TAPO_INITIAL_PRODUCTS, 'price-desc');
  assert.equal(priceDesc[0].name, 'Tapo C665G Kit');

  const nameAsc = sortProducts(TAPO_INITIAL_PRODUCTS, 'name-asc');
  assert.equal(nameAsc[0].name, 'Tapo A200');
});

test('createProductInquiryUrl generates prefilled WhatsApp inquiry with I Systems Zone phone and Tapo SKU', () => {
  const c520 = TAPO_INITIAL_PRODUCTS.find((p) => p.name === 'Tapo C520WS')!;
  const url = createProductInquiryUrl(c520, testSettings);
  assert.ok(url.startsWith('https://wa.me/60122975243?text='));
  const text = new URL(url).searchParams.get('text') || '';
  assert.ok(text.includes('Tapo C520WS'));
  assert.ok(text.includes('SKU TAPO-C520WS'));
});

test('formatPrice formats amounts cleanly', () => {
  assert.equal(formatPrice(189), '$189.00');
  assert.equal(formatPrice(759, 'MYR', 'RM '), 'RM 759.00');
});

test('generateProductJsonLd and generateLocalBusinessJsonLd reflect I Systems Zone store details', () => {
  const c520 = TAPO_INITIAL_PRODUCTS.find((p) => p.name === 'Tapo C520WS')!;
  const jsonLd = generateProductJsonLd(c520, testSettings, 'https://isystemszone.com.my');
  assert.equal(jsonLd['@type'], 'Product');
  assert.equal(jsonLd['sku'], 'TAPO-C520WS');
  assert.deepEqual(jsonLd['image'], [
    'https://lh3.googleusercontent.com/d/1Bwg_xhK7Se4xRcD866Hr5n2aBNoGwN10=w800',
  ]);
  assert.equal(jsonLd['aggregateRating'], undefined);

  const biz = generateLocalBusinessJsonLd(testSettings, 'https://isystemszone.com.my');
  assert.equal(biz['name'], 'I Systems Zone');
  assert.equal(biz['telephone'], '+60122975243');
  assert.equal(biz['url'], 'https://isystemszone.com.my');
  const addr = biz['address'] as Record<string, string>;
  assert.ok(addr['streetAddress'].includes('GM Klang Wholesale City'));
});

test('normalizeImageUrl converts Google Drive links to direct image URLs', () => {
  assert.equal(
    normalizeImageUrl('https://drive.google.com/file/d/1eT261_RbRXLkTbmm-svQsvjxJBBvfqgS/view?usp=sharing'),
    'https://lh3.googleusercontent.com/d/1eT261_RbRXLkTbmm-svQsvjxJBBvfqgS=w800'
  );
  assert.equal(
    normalizeImageUrl('https://drive.google.com/file/d/1mGDdE3EJM8WBhzV6j0rRHw0HhGhHVayi/view?usp=drive_link'),
    'https://lh3.googleusercontent.com/d/1mGDdE3EJM8WBhzV6j0rRHw0HhGhHVayi=w800'
  );
  assert.equal(
    normalizeImageUrl('https://drive.google.com/open?id=1abcXYZ_123'),
    'https://lh3.googleusercontent.com/d/1abcXYZ_123=w800'
  );
  assert.equal(
    normalizeImageUrl('https://example.com/tapo-c520ws.png'),
    'https://example.com/tapo-c520ws.png'
  );
  assert.equal(normalizeImageUrl(''), '');
});

test('validateAndNormalizeProductRow handles Tapo CSV columns and omits unpublished rows', () => {
  const records: Record<string, string>[] = [
    {
      category: 'CCTV & Security',
      'sub-category': 'Outdoor Cameras',
      brand: 'TP-Link',
      'model / product description': 'Tapo C520WS',
      'key specifications': '2K QHD 4MP Outdoor Pan/Tilt',
      'unit price': '189',
      published: 'TRUE',
    },
    {
      category: 'CCTV & Security',
      'sub-category': 'Outdoor Cameras',
      brand: 'TP-Link',
      'model / product description': 'Tapo Hidden Model',
      'key specifications': 'Unpublished',
      'unit price': '299',
      published: 'FALSE',
    },
    {
      category: 'CCTV & Security',
      brand: 'TP-Link',
      'model / product description': '',
      'unit price': '100',
    },
  ];

  const products = normalizeSheetRows(records);
  assert.equal(products.length, 1);
  assert.equal(products[0].sku, 'TAPO-C520WS');
  assert.equal(products[0].resolution, '2K QHD / 4MP');
  assert.ok(products[0].features?.includes('Pan/Tilt'));
  assert.equal(products[0].image_url, '');

  const parsedSingle = validateAndNormalizeProductRow(records[0], 0);
  assert.ok(parsedSingle);
});

test('generateSpreadsheetTemplateCsv outputs valid Tapo CSV template', () => {
  const template = generateSpreadsheetTemplateCsv();
  assert.ok(template.includes('Category,Sub-Category,Brand,Model / Product Description'));
  assert.ok(template.includes('Tapo C520WS'));
  const parsed = parseCsv(template);
  assert.ok(parsed.length >= 3);
});

test('enrichCategoriesWithCounts computes published counts per category/subcategory', () => {
  const enriched = enrichCategoriesWithCounts(INITIAL_CATEGORIES, TAPO_INITIAL_PRODUCTS);
  const outdoor = enriched.find((c) => c.slug === 'outdoor-cameras');
  const solar = enriched.find((c) => c.slug === 'solar-battery');
  assert.equal(outdoor?.productCount, 12);
  assert.equal(solar?.productCount, 7);
});

test('embedConfig resolves hash routing for WordPress HFCM mounts and subpath asset URLs', () => {
  assert.equal(resolveRoutingMode({ routing: 'auto' }, 'root', '/products'), 'path');
  assert.equal(resolveRoutingMode({ routing: 'auto' }, 'isz-catalog-root', '/tapo-catalog/'), 'hash');
  assert.equal(resolveRoutingMode({ routing: 'auto' }, 'root', '/shop/cctv-catalog/'), 'hash');
  assert.equal(resolveRoutingMode({ routing: 'hash' }, 'root', '/'), 'hash');

  assert.deepEqual(parseHashLocation('', '/'), { pathname: '/', search: '' });
  assert.deepEqual(
    parseHashLocation('#/products/tapo-c520ws?search=4mp', '/'),
    { pathname: '/products/tapo-c520ws', search: '?search=4mp' }
  );
  assert.equal(formatHashHref('/category/outdoor-cameras'), '#/category/outdoor-cameras');

  assert.equal(
    computeAssetUrl('assets/src/logo.png', '', 'https://isystemszone.com.my/wp-content/uploads/isz-catalog/isz-catalog.js'),
    'https://isystemszone.com.my/wp-content/uploads/isz-catalog/assets/src/logo.png'
  );
  assert.equal(
    computeAssetUrl('assets/src/logo.png', 'https://cdn.example.com/catalog/'),
    'https://cdn.example.com/catalog/assets/src/logo.png'
  );
  assert.equal(
    computeAssetUrl('assets/src/logo.png', '', 'http://localhost:3000/src/utils/embedConfig.ts'),
    '/assets/src/logo.png'
  );

  const mockMount = {
    dataset: {
      routing: 'hash',
      csvUrl: 'https://isystemszone.com.my/wp-content/uploads/isz-catalog/assets/src/products.csv',
      hideHeader: 'true',
      hideFooter: 'false',
    },
  } as unknown as HTMLElement;
  const parsed = readEmbedConfig(mockMount, undefined);
  assert.equal(parsed.routing, 'hash');
  assert.equal(parsed.hideHeader, true);
  assert.equal(parsed.hideFooter, false);
  assert.equal(
    parsed.csvUrl,
    'https://isystemszone.com.my/wp-content/uploads/isz-catalog/assets/src/products.csv'
  );
});

