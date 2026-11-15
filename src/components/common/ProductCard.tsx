import React, { useState } from 'react';
import { Product } from '../../types/index.ts';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { formatPrice } from '../../utils/catalog.ts';
import { ProductVisualPlaceholder } from './ProductVisualPlaceholder.tsx';
import { ArrowRight, Camera } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate, settings } = useCatalog();
  const [imageError, setImageError] = useState(false);

  const hasValidImage = Boolean(product.image_url && !imageError);

  const getAvailabilityBadge = () => {
    switch (product.availability) {
      case 'In stock':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            In stock
          </span>
        );
      case 'Low stock':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Low stock
          </span>
        );
      case 'Out of stock':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
            Out of stock
          </span>
        );
      case 'Confirm availability':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
            Confirm in store
          </span>
        );
    }
  };

  const keySpecSummary =
    product.specifications?.['Key Specifications'] || product.description;

  return (
    <article
      onClick={() => navigate(`/products/${product.slug}`)}
      className="group relative bg-white border border-[#E2E8F0] hover:border-red-400 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-lg cursor-pointer"
      aria-label={`${product.name} by ${product.brand}`}
    >
      <div>
        {/* Visual Header */}
        <div className="relative bg-white p-4 flex items-center justify-center h-44 sm:h-48 overflow-hidden border-b border-[#E2E8F0]">
          {/* Subcategory Tag */}
          {product.subcategory && (
            <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
              <span className="bg-[#F8FAFC]/95 text-slate-700 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs">
                {product.subcategory}
              </span>
            </div>
          )}

          {hasValidImage ? (
            <img
              src={product.image_url}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              loading="lazy"
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <ProductVisualPlaceholder product={product} size="card" />
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 space-y-2">
          {/* Brand & Department */}
          <div className="flex items-center justify-between text-xs text-[#525866]">
            <span className="font-semibold text-red-700 uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-[11px] font-medium text-slate-500 truncate max-w-[140px]">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-sm sm:text-base text-[#111318] line-clamp-1 leading-snug group-hover:text-red-700 transition-colors">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${product.slug}`);
              }}
              className="text-left hover:underline focus:outline-none focus:text-red-700"
            >
              {product.name}
            </button>
          </h3>

          {/* Key Specifications line from CSV */}
          <p className="text-xs text-slate-600 line-clamp-2 min-h-[2rem]">
            {keySpecSummary}
          </p>

          {/* Key Quick Technical Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.resolution && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-800 border border-blue-200/70 px-2 py-0.5 rounded font-semibold">
                <Camera className="w-3 h-3 text-blue-600" />
                {product.resolution}
              </span>
            )}
            {(product.features || []).slice(0, 2).map((feat) => (
              <span
                key={feat}
                className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Area: Price & Action */}
      <div className="p-4 pt-0 border-t border-slate-100 mt-2">
        <div className="flex items-baseline justify-between pt-3 pb-2">
          <div>
            <span className="text-lg sm:text-xl font-bold text-[#111318] tabular-nums">
              {formatPrice(product.price, product.currency, settings.currencySymbol)}
            </span>
          </div>
          <div>{getAvailabilityBadge()}</div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${product.slug}`);
          }}
          className="w-full mt-1.5 flex items-center justify-center gap-1.5 bg-[#F8FAFC] group-hover:bg-red-600 text-slate-800 group-hover:text-white text-xs sm:text-sm font-semibold py-2 px-3 rounded-lg border border-slate-200 group-hover:border-red-600 transition-colors"
        >
          <span>View Specifications</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </article>
  );
};
