import React, { useState, useEffect, useMemo } from 'react';
import { useCatalog } from '../context/CatalogContext.tsx';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import { ProductCard } from '../components/common/ProductCard.tsx';
import { ProductVisualPlaceholder } from '../components/common/ProductVisualPlaceholder.tsx';
import {
  formatPrice,
  createProductInquiryUrl,
  generateProductJsonLd,
  slugifyValue,
} from '../utils/catalog.ts';
import {
  MessageCircle,
  Navigation,
  ShieldCheck,
  AlertCircle,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Camera,
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    routeParams,
    settings,
    navigate,
    addRecentlyViewed,
    recentlyViewedSkus,
  } = useCatalog();

  const slug = routeParams.slug || '';

  const product = useMemo(() => {
    return products.find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase() && p.published
    );
  }, [products, slug]);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image_url || '');
      setImageError(false);
      addRecentlyViewed(product.sku);

      document.title = `${product.name} | ${settings.shopName}`;

      const scriptId = 'product-jsonld-schema';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(
        generateProductJsonLd(product, settings, window.location.origin)
      );
    }
  }, [product, settings, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Breadcrumbs items={[{ label: 'Products', path: '/products' }, { label: 'Product Not Found' }]} />
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-12 max-w-lg mx-auto mt-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#111318]">Product Not Found</h2>
          <p className="text-sm text-[#525866]">
            This product is either not published or has a different URL slug in the catalog inventory.
          </p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalog</span>
          </button>
        </div>
      </div>
    );
  }

  const galleryImages = [
    product.image_url,
    ...(product.additional_images || []),
  ].filter(Boolean);

  const hasValidSelectedImage = Boolean(selectedImage && !imageError);
  const inquiryUrl = createProductInquiryUrl(product, settings);

  const categoryNavTarget = product.subcategory
    ? `/category/${slugifyValue(product.subcategory)}`
    : `/category/${slugifyValue(product.category)}`;

  const categoryLabel = product.subcategory || product.category;

  const relatedProducts = products
    .filter(
      (p) =>
        (p.subcategory === product.subcategory || p.category === product.category) &&
        p.sku !== product.sku &&
        p.published
    )
    .slice(0, 4);

  const recentProducts = products.filter(
    (p) => recentlyViewedSkus.includes(p.sku) && p.sku !== product.sku && p.published
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getAvailabilityNotice = () => {
    switch (product.availability) {
      case 'In stock':
        return {
          badge: 'In stock at physical shop',
          className: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          dot: 'bg-emerald-600',
          desc: 'Available for walk-in purchase and setup guidance today.',
        };
      case 'Low stock':
        return {
          badge: 'Low stock in store',
          className: 'text-amber-800 bg-amber-50 border-amber-200',
          dot: 'bg-amber-500',
          desc: 'Only a few units remaining. Send us a quick message to confirm before visiting.',
        };
      case 'Out of stock':
        return {
          badge: 'Temporarily out of stock',
          className: 'text-slate-700 bg-slate-100 border-slate-300',
          dot: 'bg-slate-400',
          desc: 'Currently awaiting restock. Contact us to inquire about arrival ETA.',
        };
      case 'Confirm availability':
      default:
        return {
          badge: 'Contact us to confirm availability',
          className: 'text-red-800 bg-red-50 border-red-200',
          dot: 'bg-red-600',
          desc: 'Send our store a quick message with this model number to verify stock before visiting.',
        };
    }
  };

  const avail = getAvailabilityNotice();

  return (
    <div className="bg-[#FFFFFF] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Products', path: '/products' },
            { label: categoryLabel, path: categoryNavTarget },
            { label: product.name },
          ]}
        />

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Product Visual */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex items-center justify-center min-h-[320px] sm:min-h-[420px] overflow-hidden relative">
              {hasValidSelectedImage ? (
                <img
                  src={selectedImage}
                  alt={`${product.name} photo`}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="max-h-[360px] w-auto max-w-full object-contain transition-all duration-300"
                />
              ) : (
                <ProductVisualPlaceholder product={product} size="detail" />
              )}

              {product.subcategory && (
                <div className="absolute top-4 right-4">
                  <span className="bg-[#F8FAFC] border border-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs">
                    {product.subcategory}
                  </span>
                </div>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImage(img);
                      setImageError(false);
                    }}
                    className={`w-20 h-20 rounded-xl bg-white border p-1.5 flex items-center justify-center shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-red-600 ring-2 ring-red-100'
                        : 'border-[#E2E8F0] hover:border-slate-400'
                    }`}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & In-Store Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold text-red-700 uppercase tracking-wider text-sm">
                  {product.brand} &middot; {product.category}
                </span>
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight leading-tight">
                {product.name}
              </h1>

              {product.model && (
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Model: {product.model}
                </p>
              )}

              {/* Quick Resolution & Feature Pills */}
              {(product.resolution || (product.features && product.features.length > 0)) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {product.resolution && (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md font-semibold">
                      <Camera className="w-3.5 h-3.5 text-blue-600" />
                      {product.resolution}
                    </span>
                  )}
                  {(product.features || []).map((feat) => (
                    <span
                      key={feat}
                      className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md font-medium"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              )}

              {/* Price & Availability Notice */}
              <div className="flex flex-wrap items-baseline gap-4 mt-4 pt-3 border-t border-[#E2E8F0]">
                <div className="text-3xl font-black text-[#111318] tabular-nums">
                  {formatPrice(product.price, product.currency, settings.currencySymbol)}
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${avail.className}`}
                >
                  <span className={`w-2 h-2 rounded-full ${avail.dot}`}></span>
                  <span>{avail.badge}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">{avail.desc}</p>
            </div>

            {/* In-Store Call-to-Action Buttons */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                In-Store Purchase &amp; Inquiry
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={inquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm sm:text-base py-3 px-5 rounded-xl transition-colors shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Ask About This Product</span>
                </a>

                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#111318] hover:bg-slate-800 text-white font-semibold text-sm py-3 px-5 rounded-xl transition-colors"
                >
                  <Navigation className="w-4 h-4 text-red-400" />
                  <span>Get Directions</span>
                </a>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-slate-200/80 text-xs">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-2.5 py-1.5 rounded-lg"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
                </button>
              </div>
            </div>

            {/* Description / Key Specifications */}
            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#111318]">Key Specifications</h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {product.specifications?.['Key Specifications'] || product.description}
              </p>
            </div>

            {/* Compatibility notes if provided */}
            {product.compatibility && product.compatibility.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-[#E2E8F0]">
                <h3 className="text-sm font-bold text-[#111318] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Compatible Ecosystem</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.compatibility.map((device, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-md font-medium"
                    >
                      {device}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* In-Store CCTV & Smart Home Benefits */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
              <div className="font-semibold text-[#111318] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>In-Store Tapo Hardware Advice</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {product.warranty && <li><strong>Warranty:</strong> {product.warranty}</li>}
                <li>Get advice on camera placement, indoor/outdoor mounting, and solar panel pairing.</li>
                <li>Pair cameras seamlessly with Tapo smart hubs (H500 / H100) and sensors at our shop.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="pt-8 border-t border-[#E2E8F0] space-y-4">
            <h2 className="text-xl font-bold text-[#111318]">
              Product Specification Sheet
            </h2>
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-sm">
                <tbody>
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <tr
                      key={key}
                      className={idx % 2 === 0 ? 'bg-[#F8FAFC]' : 'bg-white'}
                    >
                      <th className="py-3 px-4 font-semibold text-slate-700 w-1/3 border-b border-[#E2E8F0]/80">
                        {key}
                      </th>
                      <td className="py-3 px-4 text-slate-800 border-b border-[#E2E8F0]/80 font-mono text-xs sm:text-sm">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-10 border-t border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111318]">
                More in {categoryLabel}
              </h2>
              <button
                type="button"
                onClick={() => navigate(categoryNavTarget)}
                className="text-xs font-semibold text-red-700 hover:underline"
              >
                View all &rarr;
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.sku} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        {recentProducts.length > 0 && (
          <div className="pt-10 border-t border-[#E2E8F0] space-y-4">
            <h2 className="text-xl font-bold text-[#111318]">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.sku} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
