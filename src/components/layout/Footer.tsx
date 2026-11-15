import React, { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import {
  MapPin,
  Globe,
  Phone,
  MessageCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, categories, navigate, resolveAssetUrl } = useCatalog();
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-[#111318] text-slate-300 border-t border-slate-800">
      <div className="h-[3px] w-full grid grid-cols-4">
        <div className="bg-red-600" />
        <div className="bg-amber-400" />
        <div className="bg-blue-600" />
        <div className="bg-emerald-600" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Store Branding & Overview */}
          <div className="space-y-4">
            {!logoError ? (
              <div className="inline-flex bg-white px-2.5 py-1.5 rounded-lg overflow-hidden">
                <img
                  src={resolveAssetUrl('assets/src/logo.png')}
                  alt={settings.shopName}
                  onError={() => setLogoError(true)}
                  className="h-8 w-auto object-contain [clip-path:inset(1%_1.5%_1%_1%)]"
                />
              </div>
            ) : (
              <span className="text-xl font-bold tracking-tight text-white">
                {settings.shopName}
              </span>
            )}
            <p className="text-sm text-slate-400 leading-relaxed">
              Established in 2015, {settings.shopName} is your trusted one-stop technology solutions partner for personal computers, network infrastructure, ELV systems, and CCTV solutions.
            </p>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Tapo Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/category/${cat.slug}`)}
                    className="hover:text-white transition-colors text-slate-400 text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="text-red-400 hover:text-red-300 text-xs font-semibold pt-1 inline-flex items-center gap-1"
                >
                  View All Products &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Store Information */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Visit The Shop
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`tel:${settings.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.phoneDisplay}
                </a>
              </div>
              {settings.website && settings.websiteUrl && (
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                  <a
                    href={settings.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {settings.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Quick Actions & Inquiries */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Customer Enquiries
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Have questions about camera placement, solar compatibility, or in-store stock? Chat with us directly:
            </p>
            <div className="space-y-2">
              <a
                href={settings.messagingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => navigate('/visit-us')}
                className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Get Directions to Store</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} {settings.shopName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button type="button" onClick={() => navigate('/about')} className="hover:text-slate-300 transition-colors">
              About
            </button>
            <button type="button" onClick={() => navigate('/contact')} className="hover:text-slate-300 transition-colors">
              Contact
            </button>
            <button type="button" onClick={() => navigate('/visit-us')} className="hover:text-slate-300 transition-colors">
              Store Directions
            </button>
            <a href="/sitemap.xml" className="hover:text-slate-300 transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
