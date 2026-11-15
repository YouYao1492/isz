import React, { useEffect } from 'react';
import { useCatalog } from '../context/CatalogContext.tsx';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import {
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Navigation,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { settings } = useCatalog();

  useEffect(() => {
    document.title = `Contact & Enquiries | ${settings.shopName}`;
  }, [settings]);

  return (
    <div className="bg-[#FFFFFF] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        {/* Heading */}
        <div className="border-b border-[#E2E8F0] pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111318] tracking-tight mt-1">
            Contact {settings.shopName}
          </h1>
          <p className="text-sm sm:text-base text-[#525866] mt-2 max-w-2xl leading-relaxed">
            For enquiries, product information, or technical service support regarding TP-Link Tapo &amp; VIGI CCTV, Omada networking, PCs, or ICT solutions, reach us through the channels below.
          </p>
        </div>

        {/* 3 Main Direct Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Channel 1: WhatsApp / Messaging */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#111318]">WhatsApp Enquiries</h2>
              <p className="text-xs sm:text-sm text-[#525866] leading-relaxed">
                Message us with product models, SKUs, or site requirements to confirm availability and pricing.
              </p>
            </div>
            <div>
              <a
                href={settings.messagingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp {settings.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Channel 2: Phone */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#111318]">Direct Phone Line</h2>
              <p className="text-xs sm:text-sm text-[#525866] leading-relaxed">
                Speak directly with our team for product information, stock checks, or service support.
              </p>
            </div>
            <div>
              <a
                href={`tel:${settings.phone}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call {settings.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Channel 3: Official Website */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#111318]">Official Website</h2>
              <p className="text-xs sm:text-sm text-[#525866] leading-relaxed">
                Explore {settings.shopName} online for full ICT, ELV, networking, and enterprise technology solutions.
              </p>
            </div>
            <div>
              <a
                href={settings.websiteUrl || 'https://isystemszone.com.my'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#111318] hover:bg-slate-800 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-colors shadow-sm"
              >
                <Globe className="w-4 h-4 text-amber-400" />
                <span>{settings.website || 'isystemszone.com.my'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Store Location & Support Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-[#E2E8F0]">
          {/* Location */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#111318] font-bold text-sm uppercase">
              <MapPin className="w-5 h-5 text-red-600" />
              <span>Retail Shop Address</span>
            </div>
            <p className="text-base font-bold text-[#111318]">{settings.address}</p>
            <p className="text-xs text-[#525866] leading-relaxed">
              Visit our retail shop at A-3-152, GM Klang Wholesale City for product sales, professional services, and reliable after-sales support under one roof.
            </p>
            <div>
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:underline"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps &rarr;</span>
              </a>
            </div>
          </div>

          {/* Support & Services Scope */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#111318] font-bold text-sm uppercase">
              <ShieldCheck className="w-5 h-5 text-red-600" />
              <span>How We Can Help</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>TP-Link Tapo, VIGI, and Hikvision CCTV product recommendations &amp; stock confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>TP-Link Omada network infrastructure, personal computers, servers &amp; peripherals</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Responsive technical troubleshooting, maintenance, and upgrading services</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
