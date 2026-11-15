import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

/**
 * Dedicated single-bundle build for mounting onto WordPress via HFCM
 * (Header Footer Code Manager).
 *
 * Output directory: dist-wp/
 *  - isz-catalog.js      (mount script — load in HFCM Footer as type="module")
 *  - isz-catalog.css     (bundled Tailwind styles — load in HFCM Header)
 *  - assets/src/logo.png
 *  - assets/src/products.csv
 */
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
  build: {
    outDir: 'dist-wp',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(import.meta.dirname, 'src/main.tsx'),
      output: {
        entryFileNames: 'isz-catalog.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.some((n) => n.endsWith('.css')) || assetInfo.name?.endsWith('.css')) {
            return 'isz-catalog.css';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
