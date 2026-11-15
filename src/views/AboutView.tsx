import React, { useEffect } from 'react';
import { useCatalog } from '../context/CatalogContext.tsx';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import {
  MapPin,
  ShieldCheck,
  Cctv,
  ArrowRight,
  Network,
  Wrench,
  Monitor,
  Award,
  Building2,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { settings, navigate } = useCatalog();

  useEffect(() => {
    document.title = `About Us | ${settings.shopName}`;
  }, [settings]);

  const offerings = [
    {
      title: 'Sales & Hardware',
      desc: 'Personal computers, servers, networking equipment, and CCTV systems tailored to customer requirements.',
      icon: <Monitor className="w-4 h-4 text-blue-600" />,
    },
    {
      title: 'CCTV Division',
      desc: 'Professional TP-Link Tapo & VIGI and Hikvision surveillance solutions for residential and commercial environments.',
      icon: <Cctv className="w-4 h-4 text-red-600" />,
    },
    {
      title: 'Network Infrastructure',
      desc: 'Design, implementation, and optimization of robust Omada networking and extra low voltage (ELV) systems.',
      icon: <Network className="w-4 h-4 text-emerald-600" />,
    },
    {
      title: 'Support & Upgrading',
      desc: 'Responsive technical assistance, troubleshooting, maintenance, peripherals, and modernization services.',
      icon: <Wrench className="w-4 h-4 text-amber-600" />,
    },
  ];

  const partners = [
    { name: 'TP-Link', detail: 'Authorized solution partner for Omada networking & VIGI / Tapo CCTV solutions.' },
    { name: 'Hikvision', detail: 'Advanced surveillance and security systems for commercial & industrial needs.' },
    { name: 'Microsoft', detail: 'Trusted software solutions and cloud-enabled services for digital transformation.' },
    { name: 'HPE (Hewlett Packard Enterprise)', detail: 'Dependable server, storage, and enterprise infrastructure solutions.' },
    { name: 'Dell', detail: 'High-performance hardware and computing solutions for workplace efficiency.' },
  ];

  const clients = [
    { name: "O'Connor Engineering Sdn Bhd", desc: 'Systems integration, hospitality solutions, and network communication services.' },
    { name: 'Comintel Sdn Bhd', desc: 'Communication solutions and engineering services provider.' },
    { name: 'Mahligai E&C Sdn Bhd', desc: 'Property development and ICT-related tender collaborations.' },
    { name: 'VICCS Venture Sdn Bhd', desc: 'Interior design and renovation partner for multiple CCTV projects.' },
  ];

  return (
    <div className="bg-[#FFFFFF] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Breadcrumbs items={[{ label: `About ${settings.logoText}` }]} />

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-[#111318] via-[#151820] to-[#1D2029] text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Established 2015 &bull; One-Stop Technology Solutions Partner
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              About {settings.shopName}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Established in 2015, {settings.shopName} is a dynamic technology company dedicated to delivering reliable and comprehensive ICT solutions. We specialize in personal computers, network infrastructure, extra low voltage (ELV) systems, and CCTV solutions to support both business and individual needs.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/visit-us')}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Visit Us at GM Klang</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-slate-100 font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/15 transition-colors"
              >
                <span>Contact {settings.phoneDisplay}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Our Mission & Retail Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#111318]">Our Mission</h2>
            <p className="text-xs sm:text-sm text-[#525866] leading-relaxed">
              To be a trusted one-stop technology solutions provider, delivering high-quality products, dependable services, and responsive support that create lasting value. We build long-term relationships through professionalism, reliability, and customer-focused solutions.
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#111318]">Retail Experience at GM Klang</h2>
            <p className="text-xs sm:text-sm text-[#525866] leading-relaxed">
              Visit our retail shop at {settings.address} for product sales, professional ICT &amp; CCTV consultation, and reliable after-sales support under one roof.
            </p>
          </div>
        </div>

        {/* Our Offerings */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-10 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">
              Comprehensive ICT &amp; Security
            </span>
            <h2 className="text-2xl font-extrabold text-[#111318] tracking-tight mt-1">
              Our Offerings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {offerings.map((item) => (
              <div key={item.title} className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-[#111318] flex items-center gap-1.5">
                  {item.icon}
                  <span>{item.title}</span>
                </h3>
                <p className="text-xs text-[#525866] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Partnerships & Valued Clients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Strategic Partnerships</span>
            </div>
            <div className="space-y-3">
              {partners.map((p) => (
                <div key={p.name} className="border-b border-slate-100 pb-2.5 last:border-none last:pb-0">
                  <p className="text-sm font-bold text-[#111318]">{p.name}</p>
                  <p className="text-xs text-[#525866]">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Valued Clients</span>
            </div>
            <div className="space-y-3">
              {clients.map((c) => (
                <div key={c.name} className="border-b border-slate-100 pb-2.5 last:border-none last:pb-0">
                  <p className="text-sm font-bold text-[#111318]">{c.name}</p>
                  <p className="text-xs text-[#525866]">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA to visit */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#111318]">
              Ready to plan your CCTV or ICT setup?
            </h3>
            <p className="text-xs sm:text-sm text-[#525866] mt-1">
              Browse our Tapo catalog online or contact {settings.shopName} at {settings.phoneDisplay}.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              Browse Tapo Catalog
            </button>
            <button
              type="button"
              onClick={() => navigate('/visit-us')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Visit Shop</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
