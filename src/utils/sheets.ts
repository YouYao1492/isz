import { Product, AvailabilityStatus } from '../types/index.ts';

const FEATURED_TAPO_MODELS = new Set([
  'tapo c520ws',
  'tapo c665g kit',
  'tapo c575d',
  'tapo c645d kit',
  'tapo c425',
  'tapo c260',
  'tapo d235',
  'tapo h500',
]);

/**
 * Converts Google Drive sharing/viewer URLs into direct image URLs usable in <img> tags.
 */
export function normalizeImageUrl(rawUrl: string): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return '';

  // Match https://drive.google.com/file/d/<ID>/view...
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileMatch && fileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}=w800`;
  }

  // Match https://drive.google.com/open?id=<ID> or uc?id=<ID> or thumbnail?id=<ID>
  if (/drive\.google\.com/i.test(trimmed)) {
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
    if (idMatch && idMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}=w800`;
    }
  }

  return trimmed;
}

/**
 * Extracts structured CCTV resolution label from Key Specifications text.
 */
export function extractResolution(specsText: string): string | undefined {
  const text = specsText.toLowerCase();
  if (text.includes('4k') || text.includes('8mp')) return '4K / 8MP';
  if (text.includes('3k') || text.includes('5mp')) return '3K / 5MP';
  if (text.includes('2k') || text.includes('4mp') || text.includes('qhd')) {
    return text.includes('4mp') ? '2K QHD / 4MP' : '2K / 3MP';
  }
  if (text.includes('1296p') || text.includes('3mp')) return '2K / 3MP';
  if (text.includes('1080p') || text.includes('2mp')) return '1080P / 2MP';
  return undefined;
}

/**
 * Extracts key CCTV & smart home feature tags from specs, model, and subcategory.
 */
export function extractFeatures(
  specsText: string,
  subcategory?: string,
  category?: string
): string[] {
  const combined = `${specsText} ${subcategory || ''} ${category || ''}`.toLowerCase();
  const features: string[] = [];

  if (combined.includes('pan/tilt') || combined.includes('pan-tilt')) features.push('Pan/Tilt');
  if (combined.includes('solar')) features.push('Solar Powered');
  if (combined.includes('4g') || combined.includes('lte')) features.push('4G LTE');
  if (combined.includes('dual lens') || combined.includes('dual 4k')) features.push('Dual Lens');
  if (combined.includes('color') || combined.includes('starlight')) features.push('Color Night Vision');
  if (combined.includes('wire-free') || combined.includes('battery')) features.push('Wire-Free / Battery');
  if (combined.includes('floodlight')) features.push('Floodlight');
  if (combined.includes('ethernet')) features.push('Ethernet Port');
  if (combined.includes('face recognition')) features.push('Face Recognition');
  if (combined.includes('hdd slot')) features.push('HDD Storage');
  if (combined.includes('doorbell')) features.push('Video Doorbell');
  if (combined.includes('wi-fi') || combined.includes('wifi')) features.push('Wi-Fi');

  return features;
}

/**
 * Robust CSV parser that handles quotes, multiline fields, and escaped commas.
 */
export function parseCsv(csvText: string): Record<string, string>[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      if (currentRow.some((f) => f.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) {
    return [];
  }

  const rawHeaders = rows[0].map((h) => h.toLowerCase().trim().replace(/^"|"$/g, ''));
  const parsedRecords: Record<string, string>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const record: Record<string, string> = {};
    for (let c = 0; c < rawHeaders.length; c++) {
      const header = rawHeaders[c];
      if (header) {
        record[header] = (row[c] || '').replace(/^"|"$/g, '').trim();
      }
    }
    parsedRecords.push(record);
  }

  return parsedRecords;
}

/**
 * Validates and converts a raw record into a typed Product object.
 * Supports both the Tapo Inventory CSV columns:
 *   Category, Sub-Category, Brand, Model / Product Description, Key Specifications, Unit Price
 * and standard Google Sheets columns:
 *   sku, slug, name, category, subcategory, brand, price, ...
 */
export function validateAndNormalizeProductRow(
  raw: Record<string, string>,
  index: number
): Product | null {
  const modelDesc =
    raw['model / product description'] ||
    raw.model_description ||
    raw.model ||
    '';
  const name = raw.name || raw.product_name || raw.title || modelDesc;
  const category = raw.category;
  const subcategory = raw.subcategory || raw['sub-category'] || undefined;
  const brand = raw.brand;
  const rawPrice = raw.price || raw.unit_price || raw['unit price'];
  const imageUrl = normalizeImageUrl(raw.image_url || raw.image || raw.photo || '');
  const keySpecsRaw = raw['key specifications'] || raw.key_specifications || '';

  // Auto-generate SKU when importing simple inventory sheets without an explicit sku column
  const generatedSku = modelDesc
    ? modelDesc
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    : '';
  const sku = raw.sku || raw.product_sku || raw.id || generatedSku;

  if (!sku || !name || !category || !brand || !rawPrice) {
    console.warn(
      `[Sheets Warning] Row ${index + 2} skipped due to missing required fields (sku=${sku}, name=${name}, category=${category}, brand=${brand}, price=${rawPrice})`
    );
    return null;
  }

  const price = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
  if (isNaN(price) || price < 0) {
    console.warn(`[Sheets Warning] Row ${index + 2} (${sku}) skipped: invalid price "${rawPrice}"`);
    return null;
  }

  const rawPublished = (raw.published || 'true').toLowerCase().trim();
  const published =
    rawPublished === 'true' ||
    rawPublished === '1' ||
    rawPublished === 'yes' ||
    rawPublished === 'y' ||
    rawPublished === 'published';

  const slug =
    raw.slug && raw.slug.length > 0
      ? raw.slug.toLowerCase().trim()
      : name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

  let availability: AvailabilityStatus = 'Confirm availability';
  const rawAvail = (raw.availability || '').toLowerCase();
  if (rawAvail.includes('in stock') || rawAvail === 'available' || rawAvail === 'instock') {
    availability = 'In stock';
  } else if (rawAvail.includes('low')) {
    availability = 'Low stock';
  } else if (rawAvail.includes('out') || rawAvail === 'sold out') {
    availability = 'Out of stock';
  } else if (rawAvail.includes('not specified') || rawAvail === 'unknown') {
    availability = 'Not specified';
  }

  let additionalImages: string[] | undefined;
  if (raw.additional_images) {
    additionalImages = raw.additional_images
      .split(/[,|]/)
      .map((s) => normalizeImageUrl(s.trim()))
      .filter((s) => s.startsWith('http'));
  }

  let compatibility: string[] | undefined;
  if (raw.compatibility) {
    compatibility = raw.compatibility
      .split(/[,|]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  // Build specifications from explicit `specifications` column or from CSV metadata
  let specifications: Record<string, string> | undefined;
  if (raw.specifications) {
    try {
      if (raw.specifications.startsWith('{')) {
        specifications = JSON.parse(raw.specifications);
      } else {
        const specsMap: Record<string, string> = {};
        const pairs = raw.specifications.split(';');
        for (const pair of pairs) {
          const colonIdx = pair.indexOf(':');
          if (colonIdx > 0) {
            const k = pair.substring(0, colonIdx).trim();
            const v = pair.substring(colonIdx + 1).trim();
            if (k && v) specsMap[k] = v;
          }
        }
        if (Object.keys(specsMap).length > 0) {
          specifications = specsMap;
        }
      }
    } catch (e) {
      console.warn(`[Sheets Warning] Could not parse specifications for ${sku}:`, e);
    }
  }

  const resolution = raw.resolution || extractResolution(`${keySpecsRaw} ${raw.description || ''}`);
  const features = extractFeatures(`${keySpecsRaw} ${raw.description || ''}`, subcategory, category);

  if (!specifications) {
    const derivedSpecs: Record<string, string> = {
      Department: category,
    };
    if (subcategory) derivedSpecs['Sub-Category'] = subcategory;
    derivedSpecs['Brand'] = brand;
    if (modelDesc || raw.model) derivedSpecs['Model'] = raw.model || modelDesc;
    if (keySpecsRaw) derivedSpecs['Key Specifications'] = keySpecsRaw;
    if (resolution) derivedSpecs['Resolution'] = resolution;
    if (features.length > 0) derivedSpecs['Capabilities'] = features.join(', ');
    specifications = derivedSpecs;
  }

  const powerWatts = raw.power_watts ? parseFloat(raw.power_watts.replace(/[^0-9.]/g, '')) : undefined;
  const sortOrder = raw.sort_order ? parseInt(raw.sort_order, 10) : index + 1;
  const isFeaturedFromCol =
    raw.featured === 'true' ||
    raw.featured === '1' ||
    raw.featured === 'yes' ||
    raw.featured === 'TRUE';
  const featured =
    raw.featured !== undefined && raw.featured !== ''
      ? isFeaturedFromCol
      : FEATURED_TAPO_MODELS.has(name.toLowerCase().trim());

  const description =
    raw.description ||
    (keySpecsRaw
      ? `${brand} ${name} — ${keySpecsRaw}.${subcategory ? ` Category: ${category} (${subcategory}).` : ''}`
      : `${brand} ${name} (${category}).`);

  return {
    sku,
    slug,
    name,
    category,
    subcategory,
    brand,
    price,
    currency: raw.currency || 'MYR',
    image_url: imageUrl,
    additional_images: additionalImages,
    description,
    published,
    model: raw.model || modelDesc || undefined,
    resolution,
    features,
    specifications,
    compatibility,
    connector_type: raw.connector_type || undefined,
    power_watts: isNaN(powerWatts as number) ? undefined : powerWatts,
    cable_length: raw.cable_length || undefined,
    availability,
    warranty: raw.warranty || undefined,
    featured,
    created_at: raw.created_at || undefined,
    updated_at: raw.updated_at || undefined,
    sort_order: isNaN(sortOrder as number) ? index + 1 : sortOrder,
  };
}

/**
 * Filter and normalize a list of raw records.
 * Ensures unpublished products do NOT leak into public responses.
 */
export function normalizeSheetRows(records: Record<string, string>[]): Product[] {
  const products: Product[] = [];
  const seenSkus = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    const parsed = validateAndNormalizeProductRow(records[i], i);
    if (parsed) {
      if (seenSkus.has(parsed.sku)) {
        console.warn(`[Sheets Warning] Duplicate SKU detected (${parsed.sku}) at row ${i + 2}. Skipping duplicate.`);
        continue;
      }
      seenSkus.add(parsed.sku);
      if (parsed.published) {
        products.push(parsed);
      }
    }
  }

  return products;
}

/**
 * Generates a Google Sheets CSV Template matching the active Tapo CCTV & Smart Home schema.
 */
export function generateSpreadsheetTemplateCsv(): string {
  const headers = [
    'Category',
    'Sub-Category',
    'Brand',
    'Model / Product Description',
    'Key Specifications',
    'Unit Price',
    'availability',
    'image_url',
    'published',
    'featured',
  ];

  const sampleRows = [
    [
      'CCTV & Security',
      'Outdoor Cameras',
      'TP-Link',
      'Tapo C520WS',
      '2K QHD 4MP Outdoor Pan/Tilt',
      '189',
      'Confirm availability',
      '',
      'true',
      'true',
    ],
    [
      'CCTV & Security',
      'Solar / Battery',
      'TP-Link',
      'Tapo C665G Kit',
      'Wi-Fi / 4G Solar Powered',
      '759',
      'Confirm availability',
      '',
      'true',
      'true',
    ],
    [
      'CCTV & Security',
      'Doorbells',
      'TP-Link',
      'Tapo D235',
      '2K 5MP Video Doorbell Camera',
      '369',
      'Confirm availability',
      '',
      'true',
      'true',
    ],
  ];

  const escapeCsv = (val: string) => {
    if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes(';')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const headerLine = headers.join(',');
  const rowLines = sampleRows.map((row) => row.map(escapeCsv).join(','));

  return [headerLine, ...rowLines].join('\n');
}
