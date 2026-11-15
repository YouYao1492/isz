export type AvailabilityStatus =
  | 'In stock'
  | 'Low stock'
  | 'Out of stock'
  | 'Confirm availability'
  | 'Not specified';

export interface Product {
  sku: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  brand: string;
  price: number;
  currency: string;
  image_url: string;
  additional_images?: string[];
  description: string;
  published: boolean;
  model?: string;
  resolution?: string;
  features?: string[];
  specifications?: Record<string, string>;
  compatibility?: string[];
  connector_type?: string;
  power_watts?: number;
  cable_length?: string;
  availability: AvailabilityStatus;
  warranty?: string;
  featured?: boolean;
  is_new?: boolean;
  created_at?: string;
  updated_at?: string;
  sort_order?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  department?: string;
  description: string;
  iconName: string;
  image: string;
  productCount?: number;
  subcategories: string[];
}

export interface StoreSettings {
  shopName: string;
  logoText: string;
  tagline: string;
  establishedYear?: string;
  address: string;
  shortAddress?: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  website?: string;
  websiteUrl?: string;
  messagingType: 'whatsapp' | 'line' | 'telegram';
  messagingHandle: string;
  messagingUrl: string;
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    holidays?: string;
  };
  mapUrl: string;
  mapEmbedUrl?: string;
  currencySymbol: string;
  defaultCurrency: string;
  defaultSeoDescription: string;
  defaultProductImage: string;
  refreshIntervalSeconds: number;
  isDemoData: boolean;
  lastUpdated?: string;
  sheetSourceType: 'tapo_csv' | 'google_sheets_csv' | 'google_sheets_api';
  sheetId?: string;
}

export interface CatalogFilterState {
  searchQuery: string;
  department: string;
  category: string;
  subcategory: string;
  brands: string[];
  minPrice: number | null;
  maxPrice: number | null;
  availability: string[];
  resolution: string;
  feature: string;
  connectorType: string;
  minWattage: number | null;
  maxWattage: number | null;
  cableLength: string;
  compatibilityBrand: string;
}

export type SortOption =
  | 'recommended'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc';

export interface CatalogResponse {
  products: Product[];
  total: number;
  categories: Category[];
  brands: string[];
  availableFilters: {
    departments: string[];
    resolutions: string[];
    features: string[];
    connectorTypes: string[];
    wattages: number[];
    cableLengths: string[];
    compatibilityBrands: string[];
  };
  isDemoData: boolean;
  lastUpdated: string;
  source: string;
}
