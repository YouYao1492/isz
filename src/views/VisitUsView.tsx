import React, { useEffect } from 'react';
import { useCatalog } from '../context/CatalogContext.tsx';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Globe,
  ShieldCheck,
  CheckCircle,
  Layers,
  Building2,
  Wrench,
} from 'lucide-react';

export const VisitUsView: React.FC = () => {
  const { settings, navigate } = useCatalog();

  useEffect(() => {
    document.title = `Visit Our Shop | ${settings.shopName}`;
  }, [settings]);

  return (
    <div className="bg-[#FFFFFF] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Visit Our Shop' }]} />

        {/* Page Header */}
        <div className="bg-gradient-to-br from-[#111318] via-[#151820] to-[#1D2029] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 text-red-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              GM Klang Wholesale City &bull; Est. {settings.establishedYear || '2015'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Visit {settings.shopName}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Visit our retail shop at A-3-152, GM Klang Wholesale City for a complete one-stop technology experience designed for customer convenience—product sales, professional services, and reliable after-sales support under one roof.
            </p>

            {/* Top Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/15 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call {settings.phoneDisplay}</span>
              </a>

              <a
                href={settings.messagingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>

              <button
                type="button"
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                <Layers className="w-4 h-4" />
                <span>Browse Catalog</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Store Details and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Location & Contact */}
          <div className="lg:col-span-6 space-y-6">
            {/* Location Card */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold text-sm uppercase">
                <MapPin className="w-5 h-5" />
                <span>Retail Shop Address</span>
              </div>
              <p className="text-lg font-bold text-[#111318]">{settings.shopName}</p>
              <p className="text-sm text-slate-700 leading-relaxed">{settings.address}</p>
              <div className="pt-2">
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-red-700 hover:underline inline-flex items-center gap-1"
                >
                  Open in Google Maps &rarr;
                </a>
              </div>
            </div>

            {/* Direct Contact & Online Portal */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase">
                <Phone className="w-5 h-5" />
                <span>Direct Store Contact</span>
              </div>
              <div className="divide-y divide-slate-100 text-sm">
                <div className="py-2.5 flex justify-between items-center gap-4">
                  <span className="font-medium text-slate-700">Phone / WhatsApp</span>
                  <a
                    href={`tel:${settings.phone}`}
                    className="font-semibold text-red-700 hover:underline"
                  >
                    {settings.phoneDisplay}
                  </a>
                </div>
                {settings.website && settings.websiteUrl && (
                  <div className="py-2.5 flex justify-between items-center gap-4">
                    <span className="font-medium text-slate-700">Official Website</span>
                    <a
                      href={settings.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{settings.website}</span>
                    </a>
                  </div>
                )}
                <div className="py-2.5 flex justify-between items-center gap-4">
                  <span className="font-medium text-slate-700">Retail Unit</span>
                  <span className="font-semibold text-[#111318]">A-3-152, Block A, GM Klang</span>
                </div>
              </div>
            </div>

            {/* Retail Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-[#111318] font-bold text-xs uppercase">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>GM Klang Wholesale City</span>
                </div>
                <p className="text-xs text-[#525866] leading-relaxed">
                  Located in Block A, Unit A-3-152 along Jalan Kasuarina 1, Bandar Botanic, 41200 Klang, Selangor.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-[#111318] font-bold text-xs uppercase">
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  <span>Sales &amp; Support</span>
                </div>
                <p className="text-xs text-[#525866] leading-relaxed">
                  Call or WhatsApp {settings.phoneDisplay} ahead to confirm stock availability or schedule CCTV &amp; ICT consultation.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Location Card & Services Under One Roof */}
          <div className="lg:col-span-6 space-y-6">
            {/* Visual Store Map & Directions Box */}
            <div className="bg-slate-100 border border-slate-300 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between h-80 relative">
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>

              <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                <div className="bg-white/95 backdrop-blur-xs p-4 rounded-xl border border-slate-200 shadow-sm max-w-sm">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#111318]">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{settings.shopName}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{settings.address}</p>
                </div>

                <div className="flex justify-end">
                  <a
                    href={settings.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-md transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Launch Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Services Under One Roof */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-[#111318] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>One-Stop In-Store Offerings</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Product Sales:</strong> Personal computers, servers, networking hardware, peripherals, and CCTV systems.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>CCTV Division:</strong> TP-Link Tapo, VIGI, and Hikvision surveillance solutions for homes and commercial spaces.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Network Infrastructure:</strong> Authorized TP-Link Omada networking design, setup, and optimization.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>After-Sales &amp; Upgrades:</strong> Responsive troubleshooting, maintenance, and modernization services.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
