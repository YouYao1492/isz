import {
  Product,
  Category,
  CatalogFilterState,
  SortOption,
  StoreSettings,
} from '../types/index.ts';

export function slugifyValue(val: string): string {
  return val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function enrichCategoriesWithCounts(
  categories: Category[],
  products: Product[]
): Category[] {
  return categories.map((cat) => {
    const targetSlug = cat.slug.toLowerCase().trim();
    const count = products.filter((p) => {
      if (!p.published) return false;
      const catSlug = slugifyValue(p.category);
      const subSlug = p.subcategory ? slugifyValue(p.subcategory) : '';
      return catSlug === targetSlug || subSlug === targetSlug;
    }).length;
    return {
      ...cat,
      productCount: count,
    };
  });
}

/**
 * Filter products based on search term, department, category/subcategory, brands, price range, and CCTV specifications.
 * Ensures unpublished products are never included.
 */
export function filterProducts(
  products: Product[],
  filters: Partial<CatalogFilterState>
): Product[] {
  return products.filter((product) => {
    // Hard gate: Unpublished products never appear anywhere
    if (!product.published) {
      return false;
    }

    // Department filter (matches top-level Category such as "CCTV & Security" or "Smart Home")
    if (filters.department && filters.department !== 'all') {
      const targetDept = slugifyValue(filters.department);
      if (slugifyValue(product.category) !== targetDept) {
        return false;
      }
    }

    // Category filter (matches either product.category OR product.subcategory slug/name)
    if (filters.category && filters.category !== 'all') {
      const targetSlug = slugifyValue(filters.category);
      const catSlug = slugifyValue(product.category);
      const subSlug = product.subcategory ? slugifyValue(product.subcategory) : '';
      if (catSlug !== targetSlug && subSlug !== targetSlug) {
        return false;
      }
    }

    // Subcategory filter
    if (filters.subcategory && filters.subcategory !== 'all') {
      if (
        !product.subcategory ||
        slugifyValue(product.subcategory) !== slugifyValue(filters.subcategory)
      ) {
        return false;
      }
    }

    // Brands filter
    if (filters.brands && filters.brands.length > 0) {
      const matchBrand = filters.brands.some(
        (b) => b.toLowerCase() === product.brand.toLowerCase()
      );
      if (!matchBrand) {
        return false;
      }
    }

    // Price range
    if (filters.minPrice !== null && filters.minPrice !== undefined) {
      if (product.price < filters.minPrice) return false;
    }
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
      if (product.price > filters.maxPrice) return false;
    }

    // Availability filter
    if (filters.availability && filters.availability.length > 0) {
      if (!filters.availability.includes(product.availability)) {
        return false;
      }
    }

    // CCTV Resolution filter
    if (filters.resolution && filters.resolution !== 'all') {
      const targetRes = filters.resolution.toLowerCase();
      const prodRes = (product.resolution || '').toLowerCase();
      if (!prodRes.includes(targetRes)) {
        return false;
      }
    }

    // CCTV / Smart Home Capability Feature filter
    if (filters.feature && filters.feature !== 'all') {
      const targetFeature = filters.feature.toLowerCase();
      const hasFeature = (product.features || []).some((f) =>
        f.toLowerCase().includes(targetFeature)
      );
      if (!hasFeature) {
        return false;
      }
    }

    // Legacy optional technical filters (kept for custom Google Sheets feeds)
    if (filters.connectorType && filters.connectorType !== 'all') {
      const queryConnector = filters.connectorType.toLowerCase();
      const prodConnector = (product.connector_type || '').toLowerCase();
      if (!prodConnector.includes(queryConnector)) {
        return false;
      }
    }

    if (filters.minWattage !== null && filters.minWattage !== undefined) {
      if (!product.power_watts || product.power_watts < filters.minWattage) {
        return false;
      }
    }
    if (filters.maxWattage !== null && filters.maxWattage !== undefined) {
      if (!product.power_watts || product.power_watts > filters.maxWattage) {
        return false;
      }
    }

    if (filters.cableLength && filters.cableLength !== 'all') {
      const targetLength = filters.cableLength.toLowerCase();
      const prodLength = (product.cable_length || '').toLowerCase();
      if (!prodLength.includes(targetLength)) {
        return false;
      }
    }

    if (filters.compatibilityBrand && filters.compatibilityBrand !== 'all') {
      const targetBrand = filters.compatibilityBrand.toLowerCase();
      const isCompatible = (product.compatibility || []).some((item) =>
        item.toLowerCase().includes(targetBrand)
      );
      if (!isCompatible) {
        return false;
      }
    }

    // Free text search across Name, SKU, Brand, Category, Subcategory, Model, Resolution, Features, Specs
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const query = filters.searchQuery.toLowerCase().trim();
      const inName = product.name.toLowerCase().includes(query);
      const inSku = product.sku.toLowerCase().includes(query);
      const inBrand = product.brand.toLowerCase().includes(query);
      const inCategory = product.category.toLowerCase().includes(query);
      const inSubcategory = product.subcategory
        ? product.subcategory.toLowerCase().includes(query)
        : false;
      const inModel = product.model
        ? product.model.toLowerCase().includes(query)
        : false;
      const inResolution = product.resolution
        ? product.resolution.toLowerCase().includes(query)
        : false;
      const inFeatures = product.features
        ? product.features.some((f) => f.toLowerCase().includes(query))
        : false;
      const inDesc = product.description.toLowerCase().includes(query);

      const inSpecs = product.specifications
        ? Object.entries(product.specifications).some(
            ([k, v]) =>
              k.toLowerCase().includes(query) || v.toLowerCase().includes(query)
          )
        : false;

      const inCompatibility = product.compatibility
        ? product.compatibility.some((c) => c.toLowerCase().includes(query))
        : false;

      if (
        !inName &&
        !inSku &&
        !inBrand &&
        !inCategory &&
        !inSubcategory &&
        !inModel &&
        !inResolution &&
        !inFeatures &&
        !inDesc &&
        !inSpecs &&
        !inCompatibility
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort products deterministically with fallback.
 */
export function sortProducts(
  products: Product[],
  sortBy: SortOption = 'recommended'
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => {
        if (a.is_new && !b.is_new) return -1;
        if (!a.is_new && b.is_new) return 1;
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });

    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);

    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'recommended':
    default:
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const aCctv = a.category === 'CCTV & Security' ? 0 : 1;
        const bCctv = b.category === 'CCTV & Security' ? 0 : 1;
        if (aCctv !== bCctv) return aCctv - bCctv;
        const orderA = a.sort_order ?? 999;
        const orderB = b.sort_order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      });
  }
}

/**
 * Format currency and price.
 */
export function formatPrice(
  price: number,
  _currency: string = 'USD',
  currencySymbol: string = '$'
): string {
  if (isNaN(price)) return `${currencySymbol}0.00`;
  return `${currencySymbol}${price.toFixed(2)}`;
}

/**
 * Generates pre-filled messaging link (WhatsApp / LINE / Telegram) for product inquiry.
 */
export function createProductInquiryUrl(
  product: Product,
  settings: StoreSettings
): string {
  const text = `Hello, I would like to ask about ${product.name}, SKU ${product.sku}. Is it available at your shop?`;
  const encodedText = encodeURIComponent(text);

  if (settings.messagingType === 'whatsapp') {
    const phone = settings.messagingHandle.replace(/[^0-9]/g, '');
    return `https://wa.me/${phone}?text=${encodedText}`;
  } else if (settings.messagingType === 'line') {
    return `https://line.me/R/msg/text/?${encodedText}`;
  } else {
    if (settings.messagingUrl.includes('?')) {
      return `${settings.messagingUrl}&text=${encodedText}`;
    }
    return `${settings.messagingUrl}?text=${encodedText}`;
  }
}

/**
 * Generates Schema.org Product structured data compliant with search guidelines.
 */
export function generateProductJsonLd(
  product: Product,
  settings: StoreSettings,
  appUrl: string = ''
): Record<string, unknown> {
  const url = `${appUrl}/products/${product.slug}`;
  const availabilitySchema =
    product.availability === 'In stock'
      ? 'https://schema.org/InStock'
      : product.availability === 'Low stock'
      ? 'https://schema.org/LimitedAvailability'
      : product.availability === 'Out of stock'
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/InStoreOnly';

  const images = [product.image_url, ...(product.additional_images || [])].filter(Boolean);

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    ...(images.length > 0 ? { image: images } : {}),
    description: product.description,
    sku: product.sku,
    mpn: product.model || product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: product.currency || settings.defaultCurrency || 'MYR',
      price: product.price.toFixed(2),
      availability: availabilitySchema,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'LocalBusiness',
        name: settings.shopName,
      },
    },
  };
}

/**
 * Generates Schema.org LocalBusiness structured data for physical retail store.
 */
export function generateLocalBusinessJsonLd(
  settings: StoreSettings,
  appUrl: string = ''
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ElectronicsStore',
    name: settings.shopName,
    ...(settings.defaultProductImage ? { image: settings.defaultProductImage } : {}),
    url: settings.websiteUrl || appUrl,
    telephone: settings.phone,
    ...(settings.email ? { email: settings.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Klang',
      addressRegion: 'Selangor',
      postalCode: '41200',
      addressCountry: 'MY',
    },
    ...(settings.establishedYear ? { foundingDate: settings.establishedYear } : {}),
  };
}
