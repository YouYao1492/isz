import React, { useMemo } from 'react';
import { useCatalog } from '../context/CatalogContext.tsx';
import { CatalogView } from './CatalogView.tsx';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const CategoryView: React.FC = () => {
  const { categories, routeParams, navigate } = useCatalog();
  const slug = routeParams.slug || '';

  const category = useMemo(() => {
    const lowerSlug = slug.toLowerCase();
    const matched = categories.find(
      (c) => c.slug.toLowerCase() === lowerSlug || c.id.toLowerCase() === lowerSlug
    );
    if (matched) return matched;

    if (lowerSlug === 'cctv-security') {
      return {
        id: 'cctv-security',
        slug: 'cctv-security',
        name: 'CCTV & Security',
        department: 'CCTV & Security',
        description:
          'Complete range of TP-Link Tapo outdoor, indoor, solar/battery, 4G LTE, and video doorbell surveillance cameras.',
        iconName: 'Cctv',
        image: '',
        subcategories: ['Outdoor Cameras', 'Solar / Battery', 'Indoor/Outdoor Pan-Tilt', 'Indoor Cameras', 'Doorbells'],
      };
    }

    if (lowerSlug === 'smart-home') {
      return {
        id: 'smart-home',
        slug: 'smart-home',
        name: 'Smart Home',
        department: 'Smart Home',
        description:
          'Tapo smart hubs with HDD storage, solar charging panels, motion/water/contact sensors, and Wi-Fi plugs & lighting.',
        iconName: 'Router',
        image: '',
        subcategories: ['Hubs & Gateways', 'Sensors', 'Power & Lighting'],
      };
    }

    return undefined;
  }, [categories, slug]);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Breadcrumbs items={[{ label: 'Products', path: '/products' }, { label: 'Category Not Found' }]} />
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-12 max-w-lg mx-auto mt-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#111318]">Category Not Found</h2>
          <p className="text-sm text-[#525866]">
            We could not find the category &ldquo;{slug}&rdquo;. It may have been updated or renamed in the catalog inventory.
          </p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Products</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-[#111318] to-[#1A1D24] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs uppercase tracking-wider font-bold text-red-400">
                {category.department || 'TP-Link Tapo Series'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {category.name}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {category.description}
              </p>
            </div>

            {category.subcategories && category.subcategories.length > 0 && (
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 max-w-md">
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  Included Models &amp; Series:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {category.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="text-xs bg-white/10 text-slate-100 px-2.5 py-1 rounded-md"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CatalogView />
    </div>
  );
};
