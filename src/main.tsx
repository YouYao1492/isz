import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { readEmbedConfig } from './utils/embedConfig.ts';

function mountCatalogApp() {
  const container =
    document.getElementById('isz-catalog-root') ||
    document.getElementById('root');

  if (!container) {
    return;
  }

  const embedConfig = readEmbedConfig(container);
  createRoot(container).render(
    <App embedConfig={embedConfig} mountId={container.id} />
  );
}

mountCatalogApp();
