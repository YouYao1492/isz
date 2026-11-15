import React from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { MapPin, Phone, MessageCircle, Navigation, CheckCircle, Globe } from 'lucide-react';

export const StoreCta: React.FC = () => {
  const { settings, navigate } = useCatalog();

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#111318] to-[#1A1D24] rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
                <MapPin className="w-3.5 h-3.5" />
                GM Klang Wholesale City Retail Shop
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Visit {settings.shopName} in Klang
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Visit our retail shop at A-3-152, GM Klang Wholesale City for a complete one-stop technology experience—product sales, professional ICT &amp; CCTV consultation, and reliable after-sales support under one roof.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/[0.05] rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-red-400 font-semibold text-xs uppercase mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>Retail Shop Address</span>
                  </div>
                  <p className="text-sm font-medium text-white leading-relaxed">{settings.address}</p>
                </div>

                <div className="bg-white/[0.05] rounded-xl p-4 border border-white/10 space-y-2">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase mb-1">
                      <Phone className="w-4 h-4" />
                      <span>Direct Contact</span>
                    </div>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-sm font-semibold text-white hover:text-emerald-300 transition-colors"
                    >
                      {settings.phoneDisplay}
                    </a>
                  </div>
                  {settings.website && settings.websiteUrl && (
                    <div className="pt-1 border-t border-white/10">
                      <a
                        href={settings.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-sky-200 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{settings.website}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl transition-colors shadow-md"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={settings.messagingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp {settings.phoneDisplay}</span>
                </a>

                <button
                  type="button"
                  onClick={() => navigate('/visit-us')}
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white text-sm font-semibold px-4 py-3 underline underline-offset-4"
                >
                  View Store Details &rarr;
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/[0.05] rounded-2xl p-6 border border-white/10 backdrop-blur-xs space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                One-Stop ICT &amp; CCTV Solutions
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>CCTV &amp; Security Division:</strong> TP-Link Tapo, VIGI, and Hikvision surveillance solutions for homes and businesses.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Networking &amp; ELV Systems:</strong> Authorized TP-Link Omada networking, structured connectivity, and ELV infrastructure.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>PCs, Support &amp; Upgrades:</strong> Personal computers, servers, peripherals, troubleshooting, maintenance, and system upgrades.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
