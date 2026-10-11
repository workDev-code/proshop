# 🎨 ProShop MUI Redesign — Phase 0 + 1

> **MUI v6 + TypeScript + Vite** rewrite of the ProShop storefront.
> Parallel to the existing `frontend/` (Bootstrap + JS + CRA) until approval.

---

## 🚀 Run locally

```bash
cd mui-redesign
npm install
npm run dev
# → http://localhost:5173
```

Pages available:
- `/`              Dashboard skeleton (Phase 6 = full charts)
- `/login`        Login form (MUI)
- `/register`      Register form
- `/design-system` Theme showcase with 25+ tokens

---

## 📁 What's in `src/`

| Folder | Purpose |
|---|---|
| `app/`          | Routes + providers |
| `theme/`        | Palette, typography, components, theme, ThemeProvider |
| `components/`   | Layout (AppShell, TopBar, SideNav, PageHeader) + Feedback (Skeleton/Empty) |
| `features/`     | Feature slices: auth, dashboard, design-system |
| `store/`        | Redux Toolkit + RTK Query setup |
| `hooks/`        | (TBD) per-feature hooks |
| `utils/`        | (TBD) formatters, validators |
| `types/`        | (TBD) shared TypeScript types |

---

## 🛠 Stack

- React 18 + TypeScript + Vite
- MUI v6 (`@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`, `@mui/x-charts`)
- Redux Toolkit + RTK Query
- React Router v6
- React Hook Form + Zod (Phase 2+)

---

## 📊 Phases

- [x] **Phase 0**: Vite + TS + MUI setup, theme tokens, providers
- [x] **Phase 1**: Design system showcase (`/design-system`)
- [ ] **Phase 2**: Auth + AppShell (login + register + theme toggle)
- [ ] **Phase 3**: Catalog (Home, Search, ProductDetail)
- [ ] **Phase 4**: Cart, Checkout, Order, Wishlist, Profile
- [ ] **Phase 5**: Admin CRUD pages
- [ ] **Phase 6**: Admin Dashboard with charts (MUI X Charts)
- [ ] **Phase 7**: Polish (animations, dark mode parity, a11y audit)

---

## 🌗 Theme toggle

Click the sun/moon icon in the top bar. Persisted to `localStorage.proshop-theme-mode`.
Defaults to system preference on first load.
