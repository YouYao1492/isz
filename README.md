# I Systems Zone — TP-Link Tapo CCTV & Smart Security Catalog

A mobile-first retail product catalog website focused on **TP-Link Tapo CCTV security cameras and smart home accessories**, powered directly by the store's Tapo product CSV (`public/assets/src/products.csv`) or a connected Google Sheet.

---

## Key Features

1. **Tapo CCTV & Smart Security Lineup (42 Products)**
   - **CCTV & Security (28 models)**: Outdoor Cameras (12), Solar / Battery Kits (7), Indoor/Outdoor Pan-Tilt (3), Indoor Cameras (5), Video Doorbells (1).
   - **Smart Home (14 models)**: Power & Lighting (8), Sensors (4), Hubs & Gateways (2).
   - Automatic extraction of camera resolution (`4K / 8MP`, `3K / 5MP`, `2K QHD / 4MP`, `2K / 3MP`, `1080P / 2MP`) and capabilities (`Pan/Tilt`, `Solar Powered`, `4G LTE`, `Dual Lens`, `Color Night Vision`, `Wire-Free / Battery`, `Ethernet Port`, `Face Recognition`, `HDD Storage`).

2. **Physical Retail Discovery (No Cart / No Online Checkout)**
   - Direct WhatsApp inquiry button prefilled with model name and SKU.
   - Store directions, opening hours, and consultation info.

3. **Tapo CSV & Google Sheets Integration**
   - Loads directly from `public/assets/src/products.csv` (`Category, Sub-Category, Brand, Model / Product Description, Key Specifications, Unit Price, Image`).
   - Supports live Google Sheets CSV (`GOOGLE_SHEET_CSV_URL`) or Google Sheets API v4 (`GOOGLE_SHEET_ID` + `GOOGLE_API_KEY`) with TTL caching and manual sync.
   - Downloadable CSV template at `/api/sheets-template.csv`.

---

## Running & Testing

```bash
npm install
npm test
npm run build
npm run dev
```
