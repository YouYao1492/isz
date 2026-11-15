import React, { useEffect } from 'react';
import { Hero } from '../components/home/Hero.tsx';
import { CategoryGrid } from '../components/home/CategoryGrid.tsx';
import { StoreCta } from '../components/home/StoreCta.tsx';
import { useCatalog } from '../context/CatalogContext.tsx';
import { generateLocalBusinessJsonLd } from '../utils/catalog.ts';

export const HomeView: React.FC = () => {
  const { settings } = useCatalog();

  useEffect(() => {
    document.title = `${settings.shopName} | ${settings.tagline}`;

    // Inject LocalBusiness JSON-LD
    const scriptId = 'local-business-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(generateLocalBusinessJsonLd(settings, window.location.origin));
  }, [settings]);

  return (
    <div className="space-y-0">
      <Hero />
      <CategoryGrid />
      <StoreCta />
    </div>
  );
};
