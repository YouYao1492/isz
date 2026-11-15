import React from 'react';
import { CatalogProvider, useCatalog } from './context/CatalogContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { CatalogEmbedConfig } from './utils/embedConfig.ts';

// Views
import { HomeView } from './views/HomeView.tsx';
import { CatalogView } from './views/CatalogView.tsx';
import { CategoryView } from './views/CategoryView.tsx';
import { ProductDetailView } from './views/ProductDetailView.tsx';
import { VisitUsView } from './views/VisitUsView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { ContactView } from './views/ContactView.tsx';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const RouterView: React.FC = () => {
  const { currentPath, navigate } = useCatalog();

  if (currentPath === '/' || currentPath === '') {
    return <HomeView />;
  }

  if (currentPath === '/products') {
    return <CatalogView />;
  }

  if (currentPath.startsWith('/products/')) {
    return <ProductDetailView />;
  }

  if (currentPath.startsWith('/category/')) {
    return <CategoryView />;
  }

  if (currentPath === '/visit-us') {
    return <VisitUsView />;
  }

  if (currentPath === '/about') {
    return <AboutView />;
  }

  if (currentPath === '/contact') {
    return <ContactView />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-[#111318]">Page Not Found</h1>
      <p className="text-sm text-[#525866] max-w-md mx-auto">
        The page you are looking for does not exist or has been moved.
      </p>
      <div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
};

const AppShell: React.FC = () => {
  const { embedConfig } = useCatalog();
  const isEmbeddedChrome = Boolean(embedConfig.hideHeader || embedConfig.hideFooter);

  return (
    <div
      id="isz-catalog-app"
      className={`${isEmbeddedChrome ? '' : 'min-h-screen '}flex flex-col bg-white text-[#111318] font-sans antialiased`}
    >
      {!embedConfig.hideHeader && <Navbar />}
      <main className="flex-1">
        <RouterView />
      </main>
      {!embedConfig.hideFooter && <Footer />}
    </div>
  );
};

interface AppProps {
  embedConfig?: CatalogEmbedConfig;
  mountId?: string;
}

export default function App({ embedConfig = {}, mountId = 'root' }: AppProps) {
  return (
    <CatalogProvider embedConfig={embedConfig} mountId={mountId}>
      <AppShell />
    </CatalogProvider>
  );
}
