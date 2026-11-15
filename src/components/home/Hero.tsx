import React, { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import {
  Search,
  MapPin,
  ArrowRight,
  Check,
  Cctv,
  Sun,
  ShieldCheck,
  BellRing,
  Phone,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { navigate, settings, products } = useCatalog();
  const [searchQuery, setSearchQuery] = useState('');
  const [failedSlugs, setFailedSlugs] = useState<Record<string, boolean>>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const cctvCount = products.filter((p) => p.category === 'CCTV & Security').length;
  const smartHomeCount = products.filter((p) => p.category === 'Smart Home').length;

  const spotlightModels = [
    {
      model: 'Tapo C520WS',
      spec: '2K QHD 4MP Outdoor Pan/Tilt',
      slug: 'tapo-c520ws',
      badge: 'Outdoor',
      badgeClass: 'bg-red-950/80 text-red-300 border-red-500/30',
      icon: <Cctv className="w-4 h-4 text-red-400" />,
    },
    {
      model: 'Tapo C665G Kit',
      spec: 'Wi-Fi / 4G Solar Powered',
      slug: 'tapo-c665g-kit',
      badge: 'Solar + 4G',
      badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/30',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
    },
    {
      model: 'Tapo C575D',
      spec: 'Dual 4K Lenses Outdoor',
      slug: 'tapo-c575d',
      badge: 'Dual 4K',
      badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
    },
    {
      model: 'Tapo D235',
      spec: '2K 5MP Video Doorbell Camera',
      slug: 'tapo-d235',
      badge: 'Doorbell',
      badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-500/30',
      icon: <BellRing className="w-4 h-4 text-blue-400" />,
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#111318] via-[#171A21] to-[#111318] text-white pt-10 pb-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold tracking-wider uppercase text-red-400">
              I Systems Zone &middot; Est. 2015 &middot; GM Klang Wholesale City
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight [text-wrap:balance]">
              Your Trusted One-Stop <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-red-400">
                Technology &amp; CCTV Partner.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Established in 2015, {settings.shopName} delivers reliable ICT solutions—from TP-Link Tapo &amp; VIGI CCTV security and Omada networking to PCs, ELV systems, and upgrading services. Visit us at A-3-152, GM Klang Wholesale City.
            </p>

            {/* Product Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl">
              <div className="relative flex items-center shadow-lg rounded-xl overflow-hidden bg-white text-[#111318] p-1 border border-slate-300 focus-within:ring-2 focus-within:ring-red-600">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search Tapo model, 4K, Solar, 4G, or Pan/Tilt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm sm:text-base text-[#111318] placeholder-slate-400 bg-transparent focus:outline-none"
                  aria-label="Search Tapo catalog products"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0"
                >
                  Search
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
                <span>Popular:</span>
                {['Tapo C520WS', 'Solar Kit', '4K', '4G', 'Pan/Tilt', 'Doorbell'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => navigate(`/products?search=${encodeURIComponent(term)}`)}
                    className="hover:text-red-300 underline underline-offset-2 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/category/cctv-security')}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-semibold px-6 py-3 rounded-xl transition-all shadow-md"
              >
                <span>Browse Tapo CCTV ({cctvCount})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm sm:text-base font-semibold px-6 py-3 rounded-xl border border-white/15 transition-colors"
              >
                <span>All {products.length} Products</span>
              </button>
            </div>

            {/* Store strengths bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-red-400 shrink-0" />
                <span>{cctvCount} CCTV &amp; {smartHomeCount} Smart Home Units</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Authorized TP-Link Partner</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Sales, Support &amp; Upgrades</span>
              </div>
            </div>
          </div>

          {/* Right Column: Tapo Security Lineup Overview Card */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl bg-[#1A1D24] border border-white/10 shadow-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                    Current Lineup
                  </span>
                  <h2 className="text-lg font-bold text-white">
                    Popular Tapo CCTV Models
                  </h2>
                </div>
                <span className="text-xs font-mono bg-white/5 text-slate-300 px-2.5 py-1 rounded-lg border border-white/10 tabular-nums">
                  {products.length} Items
                </span>
              </div>

              <div className="space-y-2.5">
                {spotlightModels.map((item) => {
                  const matchedProduct = products.find((p) => p.slug === item.slug);
                  const thumbUrl = matchedProduct?.image_url;
                  const showThumb = Boolean(thumbUrl && !failedSlugs[item.slug]);

                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => navigate(`/products/${item.slug}`)}
                      className="w-full text-left flex items-center justify-between gap-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/60 rounded-xl p-3 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 overflow-hidden ${
                            showThumb
                              ? 'bg-white border-white/20 p-1'
                              : 'bg-[#111318] border-white/10'
                          }`}
                        >
                          {showThumb ? (
                            <img
                              src={thumbUrl}
                              alt={item.model}
                              referrerPolicy="no-referrer"
                              onError={() =>
                                setFailedSlugs((prev) => ({ ...prev, [item.slug]: true }))
                              }
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            item.icon
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-white group-hover:text-red-300 transition-colors">
                            {item.model}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            {item.spec}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded shrink-0 ${item.badgeClass}`}>
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-[#111318] border border-white/10 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="min-w-0 space-y-0.5">
                  <p className="font-semibold text-white truncate">
                    {settings.shortAddress || settings.address}
                  </p>
                  <a
                    href={`tel:${settings.phone}`}
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{settings.phoneDisplay}</span>
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/visit-us')}
                  className="inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Visit Shop</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
