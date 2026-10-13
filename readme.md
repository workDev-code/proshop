# ProShop eCommerce Platform (v3)

> MERN eCommerce with a redesigned dark-theme storefront and admin panel — built
> on **React 18 + MUI 6 + RTK Query** for the SPA and **Express + Mongoose** for
> the API.

<p align="center">
  <img alt="Stack" src="https://img.shields.io/badge/MERN-3.0-13aa52?logo=mongodb&logoColor=white">
  <img alt="Frontend" src="https://img.shields.io/badge/frontend-React%2018%20%2B%20MUI%206-61dafb?logo=react">
  <img alt="Backend" src="https://img.shields.io/badge/backend-Express%204-000?logo=express">
  <img alt="Tests" src="https://img.shields.io/badge/tests-19%2F19%20passing-17845e?logo=jest">
  <img alt="CI" src="https://img.shields.io/badge/CI-GitHub%20Actions-2088ff?logo=github-actions">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue">
</p>

<p align="center">
  <img src="./docs/screenshots/01-home-desktop-dark.jpg" alt="ProShop storefront — home page in dark theme, full scrollable view including hero, category grid, featured products, editorial cards, newsletter and footer" width="100%">
</p>

A complete eCommerce application: shopping cart, reviews, admin panel, PayPal +
card checkout, **Wishlist**, **discount coupons**, **advanced filter + sort**,
**Category / Brand / Address / Analytics** entities, a full **Design System
Showcase**, and end-to-end **GitHub Actions CI**.

## 📸 Screenshots

All 25 screenshots are reproducible — run `npm run screenshots`. They are taken
against the **demo build** (in-memory mock backend, no MongoDB required) so the
output never exposes real user data.

### Storefront — Desktop dark (1440 × 900, full page)

| | |
|---|---|
| ![Home](./docs/screenshots/01-home-desktop-dark.jpg) | **Home** — Announcement bar · Topbar · Hero (`Good things. Better everyday.`) · Trust badges · Category grid · The everyday edit · Feature card · Editorial cards · Newsletter · Footer |
| ![Shop](./docs/screenshots/02-shop-desktop-dark.jpg) | **Shop scrolled to "The everyday edit"** — category eyebrow, URL-driven filter chips (Category / Brand / Availability), 4-col product grid with 4/5 aspect-ratio images, pagination |
| ![Shop with filter](./docs/screenshots/03-shop-filter-desktop-dark.jpg) | **Shop with active filters** — `?category=Footwear&brand=Field&inStock=true` applied, results filtered to the matching products, orange "Footwear" chip selected |
| ![Product detail](./docs/screenshots/04-product-detail-desktop-dark.png) | **Product detail** — Breadcrumb · Image gallery · Brand · Title · Star rating + review count · Sale price + compareAtPrice strikethrough · Color & size selectors · Quantity · Add to bag + Wishlist · Tabs (Description / Specs / Reviews) · Reviews list |
| ![Cart](./docs/screenshots/05-cart-desktop-dark.png) | **Cart** — empty state with "Continue shopping" CTA |
| ![Checkout](./docs/screenshots/06-checkout-desktop-dark.png) | **Checkout** — multi-step form (Shipping · Payment · Place Order) |
| ![Orders](./docs/screenshots/07-orders-desktop-dark.png) | **My orders** — list of orders with status pills (Delivered · Cancelled · Shipped …) and per-order action buttons |
| ![Order detail](./docs/screenshots/08-order-detail-desktop-dark.png) | **Order detail** — items, prices, shipping address, payment method, status timeline |
| ![Wishlist](./docs/screenshots/09-wishlist-desktop-dark.png) | **Wishlist** — grid of saved products, "Move to cart" / "Remove" actions |
| ![Profile](./docs/screenshots/10-profile-desktop-dark.png) | **Profile** — name, email, phone, avatar, password change |
| ![Login](./docs/screenshots/11-login-desktop-dark.png) | **Login** — email + password, demo credentials hint, dark theme |
| ![Design system](./docs/screenshots/12-design-system-desktop-dark.png) | **Design system** — public `/design-system` route with 25+ components |

### Admin — Desktop dark (1440 × 900, full page)

| | |
|---|---|
| ![Admin dashboard](./docs/screenshots/13-admin-dashboard-dark.png) | **Admin dashboard** — dark sidebar + light topbar, KPI cards (Revenue · Orders · Products · AOV), Top products list, Revenue-by-month chart |
| ![Admin products](./docs/screenshots/14-admin-products-dark.png) | **Admin products** — DataGrid with image · name · price · category · brand · stock · rating · status, filter + search, "+ New product" CTA |
| ![Admin orders](./docs/screenshots/15-admin-orders-dark.png) | **Admin orders** — list with status pills + Mark shipped / delivered / cancel actions |
| ![Admin analytics](./docs/screenshots/16-admin-analytics-dark.png) | **Admin analytics** — overview + top-products + revenue-by-month |

### Storefront — Desktop light (1440 × 900)

| | |
|---|---|
| ![Home light](./docs/screenshots/17-home-desktop-light.jpg) | **Home, light theme** — same layout, paper background `#f7f7f4` instead of dark |
| ![Login light](./docs/screenshots/18-login-desktop-light.png) | **Login, light theme** |

### Storefront — Mobile dark (375 × 812, full page)

| | |
|---|---|
| ![Home mobile](./docs/screenshots/19-home-mobile-dark.jpg) | **Home, mobile** — single column, hero stacks, mobile nav |
| ![Shop mobile](./docs/screenshots/20-shop-mobile-dark.jpg) | **Shop scrolled to "The everyday edit"** — horizontally scrollable filter chips, 2-col product grid |
| ![Product mobile](./docs/screenshots/21-product-mobile-dark.png) | **Product detail, mobile** |
| ![Cart mobile](./docs/screenshots/22-cart-mobile-dark.png) | **Cart, mobile** |

### Storefront — Mobile light

| | |
|---|---|
| ![Home mobile light](./docs/screenshots/23-home-mobile-light.jpg) | **Home, mobile, light theme** |

### Storefront — Tablet dark (768 × 1024, full page)

| | |
|---|---|
| ![Home tablet](./docs/screenshots/24-home-tablet-dark.jpg) | **Home, tablet** |
| ![Shop tablet](./docs/screenshots/25-shop-tablet-dark.jpg) | **Shop scrolled to "The everyday edit", tablet** |

> 📝 Long full-page captures are encoded as JPEG to stay under ~600 KB.
> All other shots are PNG (under 500 KB each). See `scripts/screenshots.cjs`
> for the optimization pipeline.

### Not captured

- **404 page** — the SPA's catch-all `<Route path="*">` redirects to `/`, so
  there is no dedicated 404 component to screenshot. Skipped by design.
- **Newsletter error / success inline states** — those are micro-interactions
  inside the form; they would need a separate Playwright interaction script
  (click submit with an empty field, wait for the aria-live region). Tracked
  for a future `screenshots:interactions` task.
- **Cart drawer slide-in** — currently triggered by `TopBar` click; same
  reason as above (interaction required).

## 🌟 Features

- 🎨 **Redesigned dark-theme storefront + admin** — flat layout, no storefront
  sidebar, announcement bar + topbar + main + footer, Manrope 800 headlines,
  terracotta accent `#E8795A`, solid `#262624` surface, `#1C1C1A` page bg.
- 🗂️ **New entities** — `Category`, `Brand`, `Address`, `Analytics` (overview
  / top-products / revenue-by-month).
- 📦 **Order lifecycle** — `pending → paid → shipped → delivered | cancelled`
  with server-side status sync; pre-save hook keeps legacy `isPaid` /
  `isDelivered` working for back-compat.
- 🛒 **Cart drawer** (slides from right) + full `/cart` page fallback.
- 🛍️ **Storefront** — Hero · TrustBadges · CategoryGrid · Featured products
  with URL-driven filter chips · FeatureCard · EditorialCards · Newsletter.
- 👨‍💼 **Admin shell** — Dashboard with charts (KPI + bar/line) · Product CRUD ·
  Order list with status pills + mark-shipped / mark-delivered / cancel ·
  User list with aggregates · Coupon CRUD · Category CRUD · Brand CRUD.
- ⭐ **Wishlist** with heart toggle, dedicated page, header badge, optimistic UI.
- 🎟️ **Discount Coupons** with server-side validation (per-user limits,
  max-discount cap, expiry). Order stores a coupon snapshot for audit.
- 💳 **Checkout** — Multi-step: Shipping → Payment → Place Order.
  PayPal + credit card via `@paypal/react-paypal-js`.
- 🧪 **19/19 backend tests** (Jest + supertest) running on every PR.
- 🛠️ **GitHub Actions CI** with 3 jobs: backend-test (MongoDB 7 service) ·
  frontend-check (typecheck + lint + build) · root-build.
- 📦 **Dependabot** for backend / frontend / CI groups.
- 🎨 **Design System Showcase** at `/design-system` (25+ components, public).

## 🧱 Tech Stack

**Frontend** (`mui-redesign/`)
- React 18 + TypeScript + Vite 5
- MUI 6 (Material UI) + Emotion + MUI X Charts + MUI X DataGrid
- Redux Toolkit + RTK Query
- React Router v6 (lazy-loaded routes)
- React Hook Form + Zod validation
- Google Fonts: **Manrope** (headlines) + **DM Sans** (body)

**Backend** (`backend/`)
- Node.js 18+ / Express 4
- MongoDB 6+ / Mongoose 7
- JWT auth + bcrypt
- Multer file uploads
- ESM modules (`"type": "module"`)

**Tooling**
- Jest + supertest + babel-jest (ESM transform) — 19/19 tests
- GitHub Actions (3-job CI)
- Dependabot
- Playwright + sharp (screenshot pipeline — see [`scripts/screenshots.cjs`](./scripts/screenshots.cjs))

## ⚙️ Install & Run

```bash
# 1. Install root + frontend
npm install
npm install --prefix mui-redesign

# 2. Configure env (copy and edit as needed)
cp .env.example .env
cp mui-redesign/.env.example mui-redesign/.env

# 3. Start MongoDB locally OR set MONGO_URI to Atlas
#    docker run -d -p 27017:27017 --name proshop-mongo mongo:7
#    brew services start mongodb-community

# 4. Seed the database (idempotent)
npm run seed           # uses default seed key
npm run seed:fresh     # wipe + reinsert (full demo dataset)

# 5. Run both servers
npm run dev            # backend :5000 + frontend :5170
```

Then open:
- Storefront → <http://localhost:5173>
- Admin panel → <http://localhost:5173/admin>

### Environment variables

**Root `.env` (or `backend/.env`)**

```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/proshop
JWT_SECRET=replace-me-with-a-long-random-string
PAGINATION_LIMIT=8
SEED_KEY=proshop-seed-2026          # default if unset
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

**`mui-redesign/.env`**

```bash
# Use the live Express + MongoDB backend (default)
VITE_DEMO_MODE=false
VITE_API_BASE_URL=/api              # Vite dev server proxies to :5000

# Use the in-memory mock backend (no DB needed)
VITE_DEMO_MODE=true
```

### Demo logins (seeded)

| Email              | Password | Role     | Used in screenshots |
|--------------------|----------|----------|---------------------|
| `admin@email.com`  | `123456` | Admin    | Yes (`admin` login) |
| `jane@email.com`   | `123456` | Customer | Yes (`jane` login)  |

> The Login page reads `VITE_DEMO_MODE` and shows the right credential set.
> Demo-mode credentials live in `mui-redesign/src/demo/demoCredentials.ts`;
> backend credentials are seeded by `npm run seed`.

## 🗂️ Project Structure

```
proshop-v2/
├── backend/                   # Express + Mongoose API
│   ├── server.js
│   ├── controllers/           # 10 controllers (incl. analytics + seed)
│   ├── models/                # 7 Mongoose models
│   ├── routes/                # 10 route files
│   ├── middleware/            # auth, error handler, ObjectId validator
│   └── data/                  # legacy seed data (used by data:import)
│
├── mui-redesign/              # React 18 + MUI 6 + RTK Query SPA
│   ├── src/
│   │   ├── app/               # routes, providers
│   │   ├── components/        # layout + feedback (shared)
│   │   ├── theme/             # tokens, palette, typography, shadows,
│   │   │                      # components, ThemeProvider, GlobalStyles
│   │   ├── features/          # auth, products, cart, checkout, orders,
│   │   │                      # wishlist, profile, admin, design-system,
│   │   │                      # categories, brands, addresses, analytics
│   │   ├── demo/              # mockBaseQuery (mirrors 17 endpoints)
│   │   ├── hooks/             # useToast, etc.
│   │   └── store/             # api/index.ts, slices
│   └── vite.config.ts         # proxies /api → :5000
│
├── scripts/
│   ├── seed.js                # POST /api/seed wrapper
│   └── screenshots.cjs        # Playwright + sharp screenshot pipeline
│
├── docs/
│   └── screenshots/           # generated by `npm run screenshots`
│
├── .github/
│   ├── workflows/ci.yml       # 3-job GitHub Actions pipeline
│   ├── dependabot.yml         # 3 groups: backend / frontend / CI
│   └── PULL_REQUEST_TEMPLATE/  # standard PR template
│
├── babel.config.json          # ESM transform for Jest
├── package.json               # root — concurrently, jest, scripts
└── readme.md                  # you are here
```

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start backend (`:5000`) + frontend (`:5173`) concurrently |
| `npm run server` | Backend only (nodemon) |
| `npm run client` | Frontend only (Vite) |
| `npm test` | Run 19 Jest tests |
| `npm run build` | Install frontend deps (if needed) + production build |
| `npm run seed` | Hit `POST /api/seed` (idempotent) |
| `npm run seed:fresh` | Hit `POST /api/seed?fresh=true` (wipe + reinsert) |
| `npm run screenshots` | Build demo bundle + capture all screenshots into `docs/screenshots/` |
| `npm run screenshots:fast` | Skip the demo rebuild if you just changed the script |
| `npm run generate-toc` | Regenerate the `

<!-- toc -->

  * [Capturing screenshots](#capturing-screenshots)
- [🗃️ Database Schema](#%F0%9F%97%83%EF%B8%8F-database-schema)
  * [New collections (v3)](#new-collections-v3)
  * [Enriched existing models](#enriched-existing-models)
- [🔌 API Endpoints](#%F0%9F%94%8C-api-endpoints)
  * [New in v3 — Categories, Brands, Addresses, Analytics](#new-in-v3--categories-brands-addresses-analytics)
  * [New in v3 — Order lifecycle](#new-in-v3--order-lifecycle)
  * [Existing — Products, Users, Orders, Auth, Coupons, Wishlist, Uploads, Seed](#existing--products-users-orders-auth-coupons-wishlist-uploads-seed)
- [🔁 Order Status Lifecycle](#%F0%9F%94%81-order-status-lifecycle)
- [🌱 Seed Database](#%F0%9F%8C%B1-seed-database)
- [🚀 CI / CD](#%F0%9F%9A%80-ci--cd)
- [🎨 Design System & Tokens](#%F0%9F%8E%A8-design-system--tokens)
  * [Color tokens (dark theme)](#color-tokens-dark-theme)
  * [Typography](#typography)
  * [Spacing scale](#spacing-scale)
  * [Accessibility commitments](#accessibility-commitments)
  * [Live showcase](#live-showcase)
- [📦 Build & Deploy](#%F0%9F%93%A6-build--deploy)
  * [Production build](#production-build)
  * [Deployment matrix](#deployment-matrix)
  * [Render environment](#render-environment)
  * [Vercel environment](#vercel-environment)
- [📋 Roadmap / Known issues](#%F0%9F%93%8B-roadmap--known-issues)

<!-- tocstop -->

` block in this file |

### Capturing screenshots

The `npm run screenshots` script:

1. Builds `mui-redesign/` in `--mode demo` (single-file HTML, no backend needed).
2. Spins up a tiny static file server on a random port.
3. Launches Chromium via Playwright (system `google-chrome`), creates a
   context per (viewport, theme) pair, logs in when needed, navigates
   via the History API so the in-memory mock auth state isn't lost.
4. For each shot: waits for `document.fonts.ready` + `networkidle`, injects
   CSS to disable all transitions/animations (so cards don't show mid-hover),
   then captures full-page.
5. Optimizes with `sharp`: aggressive PNG palette, then downscale to
   1400px → 1000px → JPEG (`.jpg`) until under 500 KB.

The output is **deterministic per shot tuple** (viewport × theme × route ×
login state) — two consecutive runs produce identical file sizes.

Override defaults via env:

```bash
BACKEND_URL=https://my-api.example npm run seed:fresh
npm run screenshots -- --no-build   # skip the demo rebuild
```

## 🗃️ Database Schema

### New collections (v3)

```js
// Category
{ name, slug, description, image, isActive, productCount, timestamps }

// Brand
{ name, slug, logo, description, isActive, productCount, timestamps }

// Address
{
  user, label, fullName, phone, line1, line2,
  city, state, postalCode, country, isDefault, timestamps,
}
```

### Enriched existing models

```js
// Product (additions)
{ slug, sku, compareAtPrice, images[], tags[], isActive, weight, dimensions }

// User (additions)
{ phone, avatar }

// Order (additions)
{
  status:        ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
  trackingNumber, carrier, shippedAt, cancelledAt, cancelReason, notes,
  // pre-save hook syncs legacy isPaid / isDelivered from status.
}
```

## 🔌 API Endpoints

### New in v3 — Categories, Brands, Addresses, Analytics

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET    | `/api/categories`                | List active categories (with productCount)      | Public |
| GET    | `/api/categories/:idOrSlug`      | Get one                                         | Public |
| POST   | `/api/categories`                | Create                                          | Admin  |
| PUT    | `/api/categories/:id`            | Update                                          | Admin  |
| DELETE | `/api/categories/:id`            | Delete                                          | Admin  |
| GET    | `/api/brands`                    | List active brands (with productCount)          | Public |
| GET    | `/api/brands/:idOrSlug`          | Get one                                         | Public |
| POST   | `/api/brands`                    | Create                                          | Admin  |
| PUT    | `/api/brands/:id`                | Update                                          | Admin  |
| DELETE | `/api/brands/:id`                | Delete                                          | Admin  |
| GET    | `/api/addresses`                 | Current user's saved addresses                  | Private |
| POST   | `/api/addresses`                 | Add                                             | Private |
| PUT    | `/api/addresses/:id`             | Update                                          | Private |
| PUT    | `/api/addresses/:id/default`     | Mark as default                                 | Private |
| DELETE | `/api/addresses/:id`             | Delete                                          | Private |
| GET    | `/api/analytics/overview?days=30`   | KPIs (revenue, orders, AOV, paid-customer rate) | Admin |
| GET    | `/api/analytics/top-products?limit=5` | Top sellers (filters `stock>0 && isActive`) | Admin |
| GET    | `/api/analytics/revenue-by-month?months=7` | Monthly revenue series              | Admin |

### New in v3 — Order lifecycle

| Method | Endpoint | Description | Access |
|---|---|---|---|
| PUT    | `/api/orders/:id/ship`    | Mark shipped (status + tracking + carrier)     | Admin |
| PUT    | `/api/orders/:id/deliver` | Mark delivered                                | Admin |
| PUT    | `/api/orders/:id/cancel`  | Cancel + release coupon usageCount             | Admin |

### Existing — Products, Users, Orders, Auth, Coupons, Wishlist, Uploads, Seed

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET    | `/api/products`                 | List + filter + sort + paginate                 | Public |
| GET    | `/api/products/top`             | Top products                                    | Public |
| GET    | `/api/products/:id`             | Get one                                         | Public |
| POST   | `/api/products`                 | Create                                          | Admin  |
| PUT    | `/api/products/:id`             | Update                                          | Admin  |
| DELETE | `/api/products/:id`             | Delete                                          | Admin  |
| POST   | `/api/users`                    | Register                                        | Public |
| POST   | `/api/users/login`              | Login (returns JWT cookie)                      | Public |
| POST   | `/api/users/logout`             | Logout                                          | Private |
| GET    | `/api/users/profile`            | Current user                                    | Private |
| PUT    | `/api/users/profile`            | Update profile                                  | Private |
| GET    | `/api/users`                    | List (with `wishlistCount`, `ordersCount`, `totalSpent`) | Admin |
| GET    | `/api/users/:id`                | Get one                                         | Admin  |
| PUT    | `/api/users/:id`                | Update (toggle admin, etc.)                     | Admin  |
| DELETE | `/api/users/:id`                | Delete                                          | Admin  |
| GET    | `/api/orders/myorders`          | Current user's orders                           | Private |
| GET    | `/api/orders/:id`               | Get one                                         | Private |
| POST   | `/api/orders`                   | Place order (auto increments coupon usageCount) | Private |
| PUT    | `/api/orders/:id/pay`           | Mark paid                                       | Private |
| GET    | `/api/orders`                   | List all (filterable by status)                 | Admin  |
| POST   | `/api/coupons/validate`         | Validate + compute discount (server-side)       | Private |
| GET / POST / PUT / DELETE | `/api/coupons[/:id]` | Full CRUD                              | Admin  |
| GET    | `/api/users/wishlist`           | Get wishlist (populated)                        | Private |
| POST   | `/api/users/wishlist/:productId` | Add (idempotent)                              | Private |
| DELETE | `/api/users/wishlist/:productId` | Remove                                         | Private |
| DELETE | `/api/users/wishlist`           | Clear                                           | Private |
| POST   | `/api/upload`                   | Single file upload (multer)                     | Admin  |
| POST   | `/api/seed?fresh=true`          | Seed/reset demo dataset                         | Admin  |

## 🔁 Order Status Lifecycle

```
                   (place order)
                       │
                       ▼
                  ┌──────────┐    pay    ┌──────────┐
                  │ pending  │ ────────► │   paid   │
                  └──────────┘           └──────────┘
                       │                      │
                       │ cancel               │ ship
                       ▼                      ▼
                  ┌──────────┐           ┌──────────┐   deliver   ┌──────────┐
                  │cancelled │           │ shipped  │ ──────────► │delivered │
                  └──────────┘           └──────────┘             └──────────┘
```

- Status is the **single source of truth**.
- Pre-save hook on `Order` syncs legacy `isPaid` / `isDelivered` for back-compat.
- Cancel: decrements `coupon.usageCount`. Place order: increments.
- Shipped orders must have a `trackingNumber` + `carrier`.
- Admin UI surfaces 5 status tones: pending (warning) · paid (success) ·
  shipped (info) · delivered (success) · cancelled (error).

## 🌱 Seed Database

```bash
# Idempotent (upsert)
curl -X POST -H "X-Seed-Key: proshop-seed-2026" \
  "http://localhost:5000/api/seed"

# Fresh seed (drops + reinserts everything)
curl -X POST -H "X-Seed-Key: proshop-seed-2026" \
  "http://localhost:5000/api/seed?fresh=true"
```

Or via the convenience wrapper:

```bash
npm run seed           # idempotent
npm run seed:fresh     # wipe + reinsert
```

The seeder populates 4 categories, 4 brands, 12 products, 3 users, 4 coupons,
6 saved addresses, 6 orders covering all 5 statuses. Override the key via the
`SEED_KEY` env var. Default is `proshop-seed-2026`.

> The legacy `pnpm run data:import` script is deprecated — it produces an
> incomplete dataset (no `Category` / `Brand` / `Address` / `Analytics` data).

## 🚀 CI / CD

GitHub Actions runs on every push to `main` and every PR. Three parallel jobs:

| Job              | What it does                                            |
|------------------|---------------------------------------------------------|
| `backend-test`   | Spins up `mongo:7` service, runs Jest 19/19 tests       |
| `frontend-check` | `tsc --noEmit` + `eslint` + `vite build`                |
| `root-build`     | Smoke test: root `npm install` + `npm run build`        |

Configuration: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)

Dependabot keeps dependencies fresh in 3 groups (`backend`, `frontend`,
`ci`) — see [`.github/dependabot.yml`](./.github/dependabot.yml).

PR template at [`.github/PULL_REQUEST_TEMPLATE/`](./.github/PULL_REQUEST_TEMPLATE/).

## 🎨 Design System & Tokens

Visual identity follows a **flat editorial** aesthetic (think Aritzia /
Muji / Studio Neat). The full source of truth lives in
[`mui-redesign/src/theme/tokens.ts`](./mui-redesign/src/theme/tokens.ts).

### Color tokens (dark theme)

| Token         | Value      | Use                             |
|---------------|------------|---------------------------------|
| `--bg`        | `#1C1C1A`  | Page background                 |
| `--surface`   | `#262624`  | Cards, panels                   |
| `--surface-2` | `#2F2F2C`  | Inputs, dropdowns, image base   |
| `--text`      | `#F5F3EE`  | Primary text                    |
| `--text-muted`| `#B8B5AD`  | Secondary text (≥4.5:1 contrast)|
| `--border`    | `#3A3A36`  | All borders                     |
| `--accent`    | `#E8795A`  | Terracotta — CTAs, focus rings  |
| `--on-accent` | `#1C1C1A`  | Text on accent surfaces         |

### Typography

- **Manrope 800** — display headlines (h1, h2, h3)
- **Manrope 600** — section titles, product names
- **DM Sans 400-700** — body, UI chrome
- Minimum font size: 12px (enforced — no body text below 12px)

### Spacing scale

- Section vertical rhythm: 64px mobile, 96px desktop (`mb: { xs: 8, md: 12 }`)
- Container max-width: 1240px storefront, 1200px footer, 1600px admin
- Touch targets: ≥44×44px for icon buttons, ≥40×40 for nav, ≥32×32 for footer

### Accessibility commitments

- WCAG AA contrast on all text (verified against the dark surface)
- `prefers-reduced-motion` honored globally via `GlobalStyles`
- `:focus-visible` outline = 2px accent, 2px offset — set as a global default
- All form controls have `<label>` (sr-only if hidden visually)
- All icon-only buttons have `aria-label`
- All toggle buttons (filter chips, wishlist) have `aria-pressed`
- Pagination exposes `aria-current="page"`, `aria-label`, `aria-disabled`

### Live showcase

Open <http://localhost:5173/design-system> to browse 25+ components with
click-to-copy code snippets. Public route — share the URL with reviewers.

## 📦 Build & Deploy

### Production build

```bash
# Installs frontend deps (if needed) + runs the full build chain
npm run build
#   → mui-redesign/node_modules ensured
#   → tsc -b + vite build
#   → output in mui-redesign/dist/

# Or run the frontend build directly
npm run build --prefix mui-redesign
```

### Deployment matrix

| Service         | What                        | Notes |
|-----------------|-----------------------------|-------|
| Vercel          | Frontend SPA                | Build root: `mui-redesign/` · output: `dist/` |
| Render          | Backend Express             | Blueprint `render.yaml` · Node 18+ |
| MongoDB Atlas   | Database (M0 free)          | Manual setup · whitelist Render IP |
| GitHub Actions  | CI (lint + test + build)    | Runs on every PR |

### Render environment

```bash
NODE_ENV=production
PORT=10000
MONGO_URI=<atlas-srv-uri>
JWT_SECRET=<generated>
SEED_KEY=<your-seed-key>
PAGINATION_LIMIT=8
```

### Vercel environment

```bash
VITE_API_BASE_URL=https://your-app.onrender.com/api
VITE_DEMO_MODE=false
```

## 📋 Roadmap / Known issues

- 🟡 **Newsletter inline states** (loading / error / success) require a
  Playwright interaction script to capture; tracked in a future
  `screenshots:interactions` task.
- 🟡 **Cart drawer slide-in** is a click-triggered micro-interaction; same
  status as above.
- 🟢 **No 404 page** — the catch-all route redirects to `/`. Adding a
  dedicated 404 component is a small future task.

MIT
