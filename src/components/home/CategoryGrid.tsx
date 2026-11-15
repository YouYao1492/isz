import React from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import {
  Cctv,
  Sun,
  Move3d,
  Camera,
  BellRing,
  Router,
  Activity,
  Plug,
  Grid,
  ArrowRight,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Cctv: <Cctv className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />,
  Sun: <Sun className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />,
  Move3d: <Move3d className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />,
  Camera: <Camera className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />,
  BellRing: <BellRing className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />,
  Router: <Router className="w-6 h-6 text-emerald-700 group-hover:text-white transition-colors" />,
  Activity: <Activity className="w-6 h-6 text-emerald-700 group-hover:text-white transition-colors" />,
  Plug: <Plug className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />,
  Grid: <Grid className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />,
};

export const CategoryGrid: React.FC = () => {
  const { categories, navigate } = useCatalog();

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              TAPO PRODUCT LINEUP
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight mt-1">
              Shop by Category
            </h2>
            <p className="text-sm text-[#525866] mt-1 max-w-xl">
              Explore outdoor CCTV cameras, solar &amp; 4G kits, indoor pan/tilt monitors, smart hubs, and sensors from our current inventory.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 hover:text-red-800 transition-colors"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(`/category/${cat.slug}`)}
              className="group bg-white rounded-xl p-5 border border-[#E2E8F0] hover:border-red-400 hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between"
              aria-label={`Browse ${cat.name}`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-colors">
                    {iconMap[cat.iconName] || <Grid className="w-6 h-6 text-red-600 group-hover:text-white" />}
                  </div>
                  {cat.department && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {cat.department === 'CCTV & Security' ? 'CCTV' : 'Smart Home'}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-[#111318] group-hover:text-red-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#525866] mt-1.5 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium tabular-nums">
                  {cat.productCount !== undefined ? `${cat.productCount} Models` : 'Available'}
                </span>
                <span className="font-semibold text-red-700 group-hover:translate-x-1 transition-transform flex items-center">
                  View &rarr;
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
