# ProShop eCommerce Platform (v3)

> A full-featured MERN eCommerce platform with a redesigned dark-themed storefront
> and admin panel — built on **React 18 + MUI 6 + RTK Query** for the SPA and
> **Express + Mongoose** for the API.

<p align="center">
  <img alt="Stack" src="https://img.shields.io/badge/MERN-3.0-13aa52?logo=mongodb&logoColor=white">
  <img alt="Frontend" src="https://img.shields.io/badge/frontend-React%2018%20%2B%20MUI%206-61dafb?logo=react">
  <img alt="Backend" src="https://img.shields.io/badge/backend-Express%204-000?logo=express">
  <img alt="Tests" src="https://img.shields.io/badge/tests-19%2F19%20passing-17845e?logo=jest">
  <img alt="CI" src="https://img.shields.io/badge/CI-GitHub%20Actions-2088ff?logo=github-actions">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue">
</p>

A complete eCommerce application featuring a shopping cart, reviews, admin panel,
PayPal + card checkout, plus a **Wishlist**, **coupon system**, **advanced filter + sort**,
**category/brand/address/analytics** entities, a full **Design System Showcase**, and
end-to-end **GitHub Actions CI**.

## 🌟 Highlights

- 🎨 **Redesigned dark-theme storefront + admin** — flat layout, no storefront
  sidebar, announcement bar + topbar + main + footer, Manrope 800 headlines,
  terracotta accent (`#E8795A`), solid `#262624` surface, `#1C1C1A` page bg.
- 🗂️ **New entities** — `Category`, `Brand`, `Address`, `Analytics` (overview /
  top-products / revenue-by-month) for the UI that customers actually see.
- 📦 **Order lifecycle** — `pending → paid → shipped → delivered | cancelled`
  with server-side status sync; pre-save hook keeps legacy `isPaid` /
  `isDelivered` working for back-compat.
- 🛒 **Cart drawer** (slides from right) + full `/cart` page fallback.
- 🛍️ **Storefront** — Hero · TrustBadges · CategoryGrid · Featured products
  with URL-driven filter chips · FeatureCard · EditorialCards · Newsletter.
- 👨‍💼 **Admin shell** — Dashboard with charts (KPI + bar/line) · Product CRUD ·
  Order list with status pills + mark-shipped / mark-delivered / cancel · User
  list with aggregates · Coupon CRUD · Category CRUD · Brand CRUD.
- ⭐ **Wishlist** with heart toggle, dedicated page, header badge, optimistic UI.
- 🎟️ **Discount Coupons** with server-side validation (per-user limits,
  max-discount cap, expiry). Order stores a coupon snapshot for audit.
- 💳 **Checkout** — Multi-step: Shipping → Payment → Place Order.
  PayPal + credit card via `@paypal/react-paypal-js`.
- 🧪 **19/19 backend tests** (Jest + supertest) running on every PR.
- 🛠️ **GitHub Actions CI** with 3 jobs: backend-test (MongoDB 7 service) ·
  frontend-check (typecheck + lint + build) · root-build.
- 📦 **Dependabot** for backend / frontend / CI groups.
- 🎨 **Design System Showcase** at `/design-system` (25+ components, public route).

<!-- toc -->

- [🌟 Highlights](#-highlights)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
  * [New collections (v3)](#new-collections-v3)
  * [Enriched existing models](#enriched-existing-models)
- [API Endpoints](#api-endpoints)
  * [New in v3 — Categories, Brands, Addresses, Analytics](#new-in-v3--categories-brands-addresses-analytics)
  * [New in v3 — Order lifecycle](#new-in-v3--order-lifecycle)
  * [Existing — Products, Users, Orders, Auth, Coupons, Wishlist, Uploads](#existing--products-users-orders-auth-coupons-wishlist-uploads)
- [Order Status Lifecycle](#order-status-lifecycle)
- [Seed Database](#seed-database)
  * [Demo logins (seeded)](#demo-logins-seeded)
- [Environment Variables](#environment-variables)
  * [`backend/.env` (or root `.env`)](#backendenv-or-root-env)
  * [`mui-redesign/.env`](#mui-redesignenv)
- [Install & Run](#install--run)
- [Demo Mode (no backend)](#demo-mode-no-backend)
- [CI / CD](#ci--cd)
- [Design System & Tokens](#design-system--tokens)
  * [Color tokens (dark theme)](#color-tokens-dark-theme)
  * [Typography](#typography)
  * [Spacing scale](#spacing-scale)
  * [Accessibility commitments](#accessibility-commitments)
  * [Live showcase](#live-showcase)
- [Build & Deploy](#build--deploy)
  * [Production build](#production-build)
  * [Deployment matrix](#deployment-matrix)
  * [Render environment](#render-environment)
  * [Vercel environment](#vercel-environment)

<!-- tocstop -->

## Tech Stack

**Frontend** (`mui-redesign/`)
- React 18 + TypeScript + Vite 5
- MUI 6 (Material UI) + Emotion + MUI X Charts + MUI X DataGrid
- Redux Toolkit + RTK Query (no manual thunks, all 4 new entity slices
  mirror real backend endpoints)
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

## Project Structure

```
proshop-v2/
├── backend/                   # Express + Mongoose API
│   ├── server.js
│   ├── controllers/           # 10 controllers (incl. new analytics + seed)
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── couponController.js
│   │   ├── wishlistController.js
│   │   ├── categoryController.js   # NEW
│   │   ├── brandController.js      # NEW
│   │   ├── addressController.js    # NEW
│   │   ├── analyticsController.js  # NEW
│   │   └── seedController.js       # demo dataset
│   ├── models/                # 7 Mongoose models
│   │   ├── productModel.js    # +slug, sku, compareAtPrice, images[], tags[], isActive, weight, dimensions
│   │   ├── userModel.js       # +phone, avatar, wishlist[]
│   │   ├── orderModel.js      # +status enum, tracking, cancelReason
│   │   ├── couponModel.js
│   │   ├── categoryModel.js   # NEW
│   │   ├── brandModel.js      # NEW
│   │   └── addressModel.js    # NEW
│   └── routes/                # 10 route files
│
├── mui-redesign/              # React 18 + MUI 6 + RTK Query SPA
│   ├── src/
│   │   ├── app/               # routes, providers
│   │   ├── components/
│   │   │   ├── layout/        # AppShell, TopBar, AnnouncementBar, Footer,
│   │   │   │                  # CartDrawer, PageContainer, PageHeader
│   │   │   └── feedback/      # LoadingState, EmptyState, ErrorState,
│   │   │                      # Pagination, StatusPill
│   │   ├── theme/             # tokens, palette, typography, shadows,
│   │   │                      # components, ThemeProvider, GlobalStyles
│   │   ├── features/
│   │   │   ├── auth/          # login, register, hooks
│   │   │   ├── products/      # api, types, HomePage, ProductDetailPage,
│   │   │   │                  # components (Card, Filters, Image, Rating…)
│   │   │   ├── categories/    # NEW — api + types
│   │   │   ├── brands/        # NEW — api + types
│   │   │   ├── addresses/     # NEW — api + types
│   │   │   ├── analytics/     # NEW — api + types
│   │   │   ├── orders/        # api, types, OrderListPage, OrderDetailPage
│   │   │   ├── cart/          # drawer + /cart page
│   │   │   ├── checkout/
│   │   │   ├── wishlist/
│   │   │   ├── profile/
│   │   │   ├── admin/         # AdminShell, AdminSidebar, AdminTopbar,
│   │   │   │                  # dashboard, product/user/order/coupon CRUD
│   │   │   └── design-system/ # /design-system showcase
│   │   ├── demo/              # mockBaseQuery (836 lines mirroring 17 endpoints)
│   │   │                      # demoCredentials, mockData
│   │   ├── hooks/             # useToast, etc.
│   │   └── store/             # api/index.ts, slices
│   ├── vite.config.ts         # proxies /api → :5000
│   └── tsconfig.json
│
├── docs/                      # architecture diagrams, ERD
│
├── .github/
│   ├── workflows/ci.yml       # 3-job GitHub Actions pipeline
│   ├── dependabot.yml         # 3 groups: backend / frontend / CI
│   └── PULL_REQUEST_TEMPLATE/  # standard PR template
│
├── babel.config.json          # ESM transform for Jest
├── package.json               # root — concurrently, jest, etc.
└── readme.md                  # you are here
```

## Database Schema

### New collections (v3)

```js
// Category
{
  name:        { type: String, required, unique, trim },
  slug:        { type: String, required, unique, lowercase },
  description: String,
  image:       String,
  isActive:    { type: Boolean, default: true },
  productCount:{ type: Number, default: 0 },
  timestamps: true,
}

// Brand
{
  name:        { type: String, required, unique, trim },
  slug:        { type: String, required, unique, lowercase },
  logo:        String,
  description: String,
  isActive:    { type: Boolean, default: true },
  productCount:{ type: Number, default: 0 },
  timestamps: true,
}

// Address
{
  user:        { type: ObjectId, ref: 'User', required },
  label:       String,                      // 'Home', 'Work', …
  fullName:    String,
  phone:       String,
  line1:       { type: String, required },
  line2:       String,
  city:        { type: String, required },
  state:       String,
  postalCode:  { type: String, required },
  country:     { type: String, default: 'US' },
  isDefault:   { type: Boolean, default: false },
  timestamps: true,
}
```

### Enriched existing models

```js
// Product (additions)
{
  slug:            { type: String, unique, lowercase, index },
  sku:             { type: String, unique, sparse },
  compareAtPrice:  Number,          // > price → "Sale" pill + strikethrough
  images:          [String],        // gallery (first item is primary)
  tags:            [String],        // e.g. ['new', 'bestseller']
  isActive:        { type: Boolean, default: true },
  weight:          Number,          // grams
  dimensions: { length: Number, width: Number, height: Number },
}

// User (additions)
{ phone: String, avatar: String }

// Order (additions)
{
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  trackingNumber:  String,
  carrier:         String,
  shippedAt:       Date,
  cancelledAt:     Date,
  cancelReason:    String,
  notes:           String,
  // pre-save hook: syncs legacy isPaid / isDelivered from status
  // so older client code still works.
}
```

## API Endpoints

### New in v3 — Categories, Brands, Addresses, Analytics

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET    | `/api/categories`         | List active categories (with productCount)      | Public |
| GET    | `/api/categories/:idOrSlug` | Get one                                      | Public |
| POST   | `/api/categories`         | Create                                         | Admin  |
| PUT    | `/api/categories/:id`     | Update                                         | Admin  |
| DELETE | `/api/categories/:id`     | Delete                                         | Admin  |
| GET    | `/api/brands`             | List active brands (with productCount)          | Public |
| GET    | `/api/brands/:idOrSlug`   | Get one                                        | Public |
| POST   | `/api/brands`             | Create                                         | Admin  |
| PUT    | `/api/brands/:id`         | Update                                         | Admin  |
| DELETE | `/api/brands/:id`         | Delete                                         | Admin  |
| GET    | `/api/addresses`          | Current user's saved addresses                  | Private |
| POST   | `/api/addresses`          | Add address                                     | Private |
| PUT    | `/api/addresses/:id`      | Update                                          | Private |
| PUT    | `/api/addresses/:id/default` | Mark as default (unsets others)              | Private |
| DELETE | `/api/addresses/:id`      | Delete                                          | Private |
| GET    | `/api/analytics/overview?days=30`  | KPIs (revenue, orders, AOV, paid-customer rate) | Admin |
| GET    | `/api/analytics/top-products?limit=5` | Top-selling products (filters stock>0 + isActive) | Admin |
| GET    | `/api/analytics/revenue-by-month?months=7` | Monthly revenue series                | Admin |

### New in v3 — Order lifecycle

| Method | Endpoint | Description | Access |
|---|---|---|---|
| PUT    | `/api/orders/:id/ship`    | Mark shipped (set status + trackingNumber + carrier) | Admin |
| PUT    | `/api/orders/:id/deliver` | Mark delivered                                | Admin |
| PUT    | `/api/orders/:id/cancel`  | Cancel order + release coupon usageCount      | Admin |

### Existing — Products, Users, Orders, Auth, Coupons, Wishlist, Uploads

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET    | `/api/products`           | List + filter + sort + paginate (see below)   | Public |
| GET    | `/api/products/top`       | Top products (filters `countInStock>0 && isActive`) | Public |
| GET    | `/api/products/:id`       | Get one                                       | Public |
| POST   | `/api/products`           | Create                                         | Admin  |
| PUT    | `/api/products/:id`       | Update (uses req.body — fixed hardcoded bug)   | Admin  |
| DELETE | `/api/products/:id`       | Delete                                         | Admin  |
| POST   | `/api/users`              | Register                                       | Public |
| POST   | `/api/users/login`        | Login (returns JWT cookie)                     | Public |
| POST   | `/api/users/logout`       | Logout                                         | Private |
| GET    | `/api/users/profile`      | Current user                                   | Private |
| PUT    | `/api/users/profile`      | Update profile (name, email, phone, avatar, password) | Private |
| GET    | `/api/users`              | List all (with `wishlistCount`, `ordersCount`, `totalSpent`) | Admin |
| GET    | `/api/users/:id`          | Get one                                        | Admin |
| PUT    | `/api/users/:id`          | Update (toggle admin, etc.)                    | Admin |
| DELETE | `/api/users/:id`          | Delete                                         | Admin  |
| GET    | `/api/orders/myorders`    | Current user's orders                          | Private |
| GET    | `/api/orders/:id`         | Get one                                        | Private |
| POST   | `/api/orders`             | Place order (auto increments coupon usageCount) | Private |
| PUT    | `/api/orders/:id/pay`     | Mark paid                                      | Private |
| GET    | `/api/orders`             | List all (filters by status)                   | Admin  |
| POST   | `/api/coupons/validate`   | Validate + compute discount (server-side)      | Private |
| GET / POST / PUT / DELETE | `/api/coupons[/:id]` | Full CRUD                              | Admin  |
| GET    | `/api/users/wishlist`     | Get wishlist (populated)                       | Private |
| POST   | `/api/users/wishlist/:productId` | Add (idempotent)                       | Private |
| DELETE | `/api/users/wishlist/:productId` | Remove                              | Private |
| DELETE | `/api/users/wishlist`     | Clear                                          | Private |
| POST   | `/api/upload`             | Single file upload via multer                  | Admin  |
| POST   | `/api/seed?fresh=true`    | Seed/reset demo dataset (see below)            | Admin  |

## Order Status Lifecycle

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

## Seed Database

A one-shot endpoint populates a **complete demo dataset** (4 categories,
4 brands, 12 products, 3 users, 4 coupons, 6 saved addresses, 6 orders
covering all 5 statuses):

```bash
# Fresh seed (drops + reinserts everything)
curl -X POST -H "X-Seed-Key: proshop-seed-2026" \
  "http://localhost:5000/api/seed?fresh=true"

# Idempotent (upsert)
curl -X POST -H "X-Seed-Key: proshop-seed-2026" \
  "http://localhost:5000/api/seed"
```

Override the key via the `SEED_KEY` env var. Default is `proshop-seed-2026`.

### Demo logins (seeded)

| Email              | Password | Role     |
|--------------------|----------|----------|
| `admin@email.com`  | `123456` | Admin    |
| `john@email.com`   | `123456` | Customer |
| `jane@email.com`   | `123456` | Customer |

> The legacy `pnpm run data:import` script is deprecated — the new endpoint
> is the only supported way to populate the database in v3.

## Environment Variables

### `backend/.env` (or root `.env`)

```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/proshop
JWT_SECRET=replace-me-with-a-long-random-string
PAGINATION_LIMIT=8
# Optional
SEED_KEY=proshop-seed-2026          # default if unset
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

### `mui-redesign/.env`

```bash
# Use the live Express + MongoDB backend (default)
VITE_DEMO_MODE=false
VITE_API_BASE_URL=/api              # Vite dev server proxies to :5000

# Use the in-memory mock backend (no DB needed)
VITE_DEMO_MODE=true
```

The Login page reads `VITE_DEMO_MODE` and shows the right credential set:
- `VITE_DEMO_MODE=false` → BACKEND_ACCOUNTS (real seeded users)
- `VITE_DEMO_MODE=true`  → DEMO_ACCOUNTS (mock only)

## Install & Run

```bash
# 1. Install root + frontend
npm install
npm install --prefix mui-redesign

# 2. Start MongoDB locally (or set MONGO_URI to Atlas)
#    brew services start mongodb-community
#    # or:
#    docker run -d -p 27017:27017 --name proshop-mongo mongo:7

# 3. Seed the database
npm run seed   # convenience wrapper around POST /api/seed?fresh=true

# 4. Run both servers (Express :5000 + Vite :5173)
npm run dev
```

Other scripts:

```bash
npm run server         # backend only
npm run client         # frontend only
npm test               # 19 Jest tests
npm run build          # production build of mui-redesign
```

Open <http://localhost:5173> for the storefront or
<http://localhost:5173/admin> for the admin panel (sign in as
`admin@email.com`).

## Demo Mode (no backend)

`mui-redesign` ships with an **in-memory mock backend** that mirrors all
17 backend endpoints. Useful for:

- Reviewing the UI in any environment without MongoDB
- Demos and screenshots
- Offline development on a plane

```bash
# Build + run the demo bundle
npm run build:demo --prefix mui-redesign
npm run preview:demo --prefix mui-redesign   # serves at :4173
```

`mockBaseQuery.ts` (~836 lines) is kept in lock-step with the real backend,
so demo mode is always API-faithful — only the persistence layer is mocked.

## CI / CD

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

## Design System & Tokens

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
- Touch targets: ≥44×44px (Apple HIG) for icon buttons, ≥40×40 for nav,
  ≥32×32 for footer links

### Accessibility commitments

- WCAG AA contrast on all text (verified against the dark surface)
- `prefers-reduced-motion` honored globally via `GlobalStyles`
- `:focus-visible` outline = 2px accent, 2px offset — set as a global
  default in `ThemeProvider`
- All form controls have `<label>` (sr-only if hidden visually)
- All icon-only buttons have `aria-label`
- All toggle buttons (filter chips, wishlist) have `aria-pressed`
- Pagination exposes `aria-current="page"`, `aria-label`, `aria-disabled`
- Skip-to-content link in `AppShell`

### Live showcase

Open <http://localhost:5173/design-system> to browse 25+ components with
click-to-copy code snippets. Public route — share the URL with reviewers.

## Build & Deploy

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

MIT
