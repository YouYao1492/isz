# WordPress Mounting Guide (HFCM — Header Footer Code Manager)

This project is pre-configured to mount cleanly inside any WordPress page using **HFCM (Header Footer Code Manager)** without breaking WordPress permalinks or causing missing-asset errors.

---

## Step 1: Build the WordPress Bundle

Run:

```bash
npm run build:wp
```

This generates a self-contained static bundle inside `dist-wp/`:

- `dist-wp/isz-catalog.css` — Bundled Tailwind stylesheet
- `dist-wp/isz-catalog.js` — Single-file React catalog application
- `dist-wp/assets/src/logo.png` — Store logo (`iSystemsZone`)
- `dist-wp/assets/src/products.csv` — Current Tapo inventory CSV

---

## Step 2: Upload `dist-wp/` to Your WordPress Server

Upload the entire contents of `dist-wp/` to a folder on your WordPress host, for example via FTP / File Manager into:

```text
/wp-content/uploads/isz-catalog/
```

So that the files are accessible at:

- `https://isystemszone.com.my/wp-content/uploads/isz-catalog/isz-catalog.css`
- `https://isystemszone.com.my/wp-content/uploads/isz-catalog/isz-catalog.js`
- `https://isystemszone.com.my/wp-content/uploads/isz-catalog/assets/src/logo.png`
- `https://isystemszone.com.my/wp-content/uploads/isz-catalog/assets/src/products.csv`

*(The app automatically resolves `assets/src/logo.png` relative to `isz-catalog.js`—no manual path rewrite required.)*

---

## Step 3: Add the Mount Container on Your WordPress Page

Create or edit the target WordPress page (for example `/tapo-catalog/`), add a **Custom HTML** block (or Elementor HTML widget), and paste:

```html
<div
  id="isz-catalog-root"
  data-routing="hash"
  data-csv-url="/wp-content/uploads/isz-catalog/assets/src/products.csv"
></div>
```

### Optional Configuration Attributes (`data-*`)

| Attribute | Values | Purpose |
| :--- | :--- | :--- |
| `data-routing` | `hash` (default for `#isz-catalog-root`) | Keeps URLs as `#/products/tapo-c520ws` so WordPress permalinks never 404 on refresh. |
| `data-csv-url` | URL to `products.csv` or published Google Sheets CSV | Fetches live CSV updates without rebuilding JS. Omit to use the built-in bundled dataset. |
| `data-api-base` | `https://your-node-server.example.com` | Optional external `server.ts` URL if using private Google Sheets API v4 caching. |
| `data-assets-base` | `https://your-domain.com/wp-content/uploads/isz-catalog` | Optional override for logo/static asset base URL. |
| `data-hide-header` | `true` / `false` | Set `true` to hide the catalog's top bar and use your WordPress theme's header instead. |
| `data-hide-footer` | `true` / `false` | Set `true` to hide the catalog's footer and use your WordPress theme's footer instead. |
| `data-initial-route` | e.g. `/products` | Start directly on the catalog grid instead of the hero homepage. |

---

## Step 4: Configure HFCM Snippets in WordPress Admin

In WordPress Admin, go to **HFCM → Add New Snippet** and create two snippets set to **Site Display: Specific Pages** *(select your Catalog page so Tailwind styles only load on that page)*.

### Snippet 1 — Catalog Styles & Fonts (Header)

- **Snippet Name**: `I Systems Zone Catalog - CSS`
- **Snippet Type**: `HTML`
- **Site Display**: `Specific Pages` → *(select your Catalog page)*
- **Location**: `Header`
- **Snippet / Code**:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
<link
  rel="stylesheet"
  href="/wp-content/uploads/isz-catalog/isz-catalog.css"
/>
```

### Snippet 2 — Catalog App Script (Footer)

- **Snippet Name**: `I Systems Zone Catalog - JS`
- **Snippet Type**: `HTML`
- **Site Display**: `Specific Pages` → *(select your Catalog page)*
- **Location**: `Footer`
- **Snippet / Code**:

```html
<script
  type="module"
  src="/wp-content/uploads/isz-catalog/isz-catalog.js"
></script>
```

> **Note:** `type="module"` is required for ES module bundles produced by Vite. If your WordPress security/optimization plugin strips `type="module"`, whitelist `isz-catalog.js` from script minification/deferral plugins (such as WP Rocket or LiteSpeed Cache).
