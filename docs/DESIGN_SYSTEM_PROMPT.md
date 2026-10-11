# 🎨 ProShop Design System — Proposal Document

> **Mục đích file này:** Mô tả chi tiết plan cho một trang **Design System / UI Kit** chạy trong dự án ProShop, dùng để showcase toàn bộ components hiện có (và sắp có). Người dùng có thể mở 1 URL duy nhất để đánh giá tất cả "mảnh ghép" UI trước khi quyết định nâng cấp/thay đổi.

---

## 1. 🎯 Goal

Biến ProShop thành **không chỉ là 1 app eCommerce** mà còn là **1 portfolio piece** có **Design System Showcase** mà nhà tuyển dụng/stakeholder có thể mở ra xem và đánh giá:

- Thương hiệu (brand) của ProShop có nhất quán không?
- Mỗi component trông thế nào ở các states khác nhau?
- eCommerce-specific patterns (Coupon, Wishlist, Rating...) được xử lý ra sao?
- Code structure đẹp cỡ nào (component reusability)?

---

## 2. 🌐 Vị trí & Routing

| Aspect | Quyết định |
|---|---|
| **URL public** | `/design-system` (không cần login) |
| **Trang landing mới** | Có link trỏ về từ Header dropdown `Help → Design System` (chỉ hiện trong dev) |
| **Route name** | `DesignSystemScreen` |
| **Layout** | Single Page (1 scroll) + anchor navigation (TOC ở sidebar trái) |
| **File location** | `frontend/src/screens/DesignSystemScreen.jsx` |

**Lý do public:** Để người ngoài (HR, mentor, người phỏng vấn) có thể truy cập demo ngay mà không cần tài khoản.

---

## 3. 📦 Phạm vi (Scope) — Trang sẽ chứa

### Section A: Brand & Visual Identity
- [A1] **Color Palette** — primary, secondary, success, warning, danger, info, light, dark, muted
- [A2] **Typography Scale** — h1 → h6, body, small, code, blockquote
- [A3] **Spacing Scale** — 0/1/2/3/4/5 (visual squares)
- [A4] **Logo area** — favicon + wordmark variations (light/dark bg)

### Section B: Core Components (Bootstrap-based)
- [B1] **Buttons** — 7 variants × 3 sizes + loading/disabled/active/icon states
- [B2] **Forms** — input, select, textarea, checkbox, radio, switch, file input, validation states
- [B3] **Alerts** — success/info/warning/danger + dismissible variants
- [B4] **Badges & Tags** — pill, square, with icon, removable
- [B5] **Cards** — basic, with image, with footer, pricing-style
- [B6] **Tables** — basic, striped, hover, dark, with actions

### Section C: Data Display
- [C1] **Rating Stars** — readonly, interactive, half-star, with count
- [C2] **Loaders** — Spinner, Skeleton (card & row), progress bar
- [C3] **Empty States** — icon + heading + subtext + CTA pattern
- [C4] **Toast notifications** — variants, with action button, dismissable

### Section D: eCommerce-Specific Patterns (USP của ProShop)
- [D1] **Product Card** — hiện state với/without wishlist ❤️, out-of-stock badge, top-rated badge
- [D2] **Product Card States** — 5 states: in-stock, low-stock, out-of-stock, in-cart, in-wishlist
- [D3] **Cart Item Row** — preview layout
- [D4] **Coupon Box** — input + applied state (màu sắc badge)
- [D5] **Coupon Card** — coupon admin preview (admin view)
- [D6] **Wishlist Heart States** — empty + filled (red)
- [D7] **Price Display** — sale price (gạch ngang giá cũ), range, currency
- [D8] **Order Status Timeline** — Pending → Paid → Shipped → Delivered
- [D9] **Filter Sidebar** — preview the sidebar mới

### Section E: Layout & Navigation
- [E1] **Header variations** — collapsed vs expanded, with/without user menu
- [E2] **Footer**
- [E3] **Container widths** — fluid vs fixed
- [E4] **Breadcrumbs** (CheckoutSteps preview)
- [E5] **Pagination** — different layouts

### Section F: Icons & Imagery
- [F1] **Icon library** — sample từ react-icons (FaHeart, FaCart, FaUser, etc.)
- [F2] **Image placeholder patterns** — fallback when img missing
- [F3] **Avatar placeholder**

---

## 4. 🎨 Wireframe (ASCII mockup)

```
┌────────────────────────────────────────────────────────────────────┐
│  HEADER: ProShop logo  |  Search  |  Cart(2)  |  Wishlist(1)  | 👤 │
├────────────────────────────────────────────────────────────────────┤
│ HERO / INTRO                                                       │
│   ┌───────────────────────┐  ┌──────────────────────────────────┐  │
│   │  TOC SIDEBAR (sticky) │  │  PROSHOP DESIGN SYSTEM            │  │
│   │  • Brand Identity     │  │  ──────────────────────────────  │  │
│   │  • Core Components    │  │  📐 64 components | 7 categories │  │
│   │  • Data Display       │  │  🎨 Built with React-Bootstrap 5  │  │
│   │  • eCommerce          │  │  🔄 Last updated: Oct 2026        │  │
│   │  • Layout & Nav       │  │                                   │  │
│   │  • Icons              │  │                                   │  │
│   └───────────────────────┘  └──────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────┤
│  A. BRAND & VISUAL IDENTITY                                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  │primary  │ │secondary│ │success  │ │warning  │ │danger   │ …     │
│  │  #0d6efd│ │  #6c757d│ │  #198754│ │  #ffc107│ │  #dc3545│        │
│  │ [█████] │ │ [█████] │ │ [█████] │ │ [█████] │ │ [█████] │        │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
│                                                                    │
│  Typography:                                                        │
│  H1  ProShop Display Heading                                         │
│  H2  H2 Section heading                                             │
│  H3  H3 Subsection                                                  │
│  Body  Used for paragraphs ...                                       │
│  <code>inline code</code>                                           │
│  Small muted text                                                   │
├────────────────────────────────────────────────────────────────────┤
│  B1. BUTTONS                                                         │
│  [Primary] [Secondary] [Outline] [Danger] [Warning] [Light] [Dark]  │
│  [Primary sm] [Primary md] [Primary lg]                              │
│  [⏳ Loading…] [Disabled] [✓ Active]                                  │
├────────────────────────────────────────────────────────────────────┤
│  D1. PRODUCT CARD STATES                                            │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                        │
│  │In Stock   │  │Out Stock  │  │In Wishlist│                        │
│  │[img]      │  │[img]      │  │[img] ❤    │                        │
│  │Title      │  │Title      │  │Title      │                        │
│  │★ 4.5 (8)  │  │★ 3.0 (1)  │  │★ 5.0 (12) │                        │
│  │$89.99 ❤🤍  │  │$1299  ❤🤍  │  │$29.99  ❤❤️ │                        │
│  └───────────┘  └───────────┘  └───────────┘                        │
├────────────────────────────────────────────────────────────────────┤
│  D4. COUPON BOX                                                     │
│  ┌─────────────────────────────────────┐                            │
│  │ Have a coupon?                       │                            │
│  │ [code____] [Apply]                   │                            │
│  │ Try WELCOME10, SAVE20 ...            │                            │
│  └─────────────────────────────────────┘                            │
│  ┌─────────────────────────────────────┐                            │
│  │ Have a coupon?                       │                            │
│  │ [WELCOME10  -$9.00]    [Remove]      │                            │
│  └─────────────────────────────────────┘                            │
├────────────────────────────────────────────────────────────────────┤
│  D5. COUPON ADMIN CARDS                                             │
│  ┌──────────────────────────────────────────────┐                    │
│  │ WELCOME10  [percentage 10%]                  │                    │
│  │ "10% off for first-time customers"           │                    │
│  │ Min $50 | Max discount $50 | 12/1000 | 30d  │                    │
│  │ ✓ Active           [Edit] [Delete]            │                    │
│  └──────────────────────────────────────────────┘                    │
├────────────────────────────────────────────────────────────────────┤
│  D8. ORDER STATUS TIMELINE                                          │
│  ●─────────●─────────●─────────○                                     │
│  Pending   Paid    Shipped  Delivered                                │
├────────────────────────────────────────────────────────────────────┤
│  E1. FOOTER                                                          │
│  © 2026 ProShop · Built with MERN                                   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 5. 🎨 Visual Theme

| Aspect | Value | Ghi chú |
|---|---|---|
| **Primary brand** | `#0d6efd` (Bootstrap primary blue) | đã có sẵn |
| **Accent for "discount/sale"** | `#dc3545` (danger red) | nổi bật |
| **Success** | `#198754` | cho isPaid, inStock |
| **Background section** | White cards on `#f5f5f5` page bg | phân vùng rõ |
| **Code mono** | `Fira Code` / Consolas | hiển thị tokens |
| **TOC sidebar** | Sticky left, 220px wide | scroll anchor nav |
| **Content max-width** | 960px central | dễ scan |

**Không cần dark mode** ở giai đoạn này (giữ đơn giản, có thể làm sau).

---

## 6. 🛠 Tech Implementation

### Stack
- **React 18** + **React-Bootstrap 5** (đã dùng trong project)
- **CSS Modules** hoặc **inline style** cho color swatches (không cần Tailwind)
- **react-icons** cho icon samples

### Component structure
```
frontend/src/screens/
  DesignSystemScreen.jsx           # Trang chính
  
frontend/src/components/design-system/
  Section.jsx                      # Wrapper với heading + anchor
  ColorSwatch.jsx                  # Box vuông hiện màu + hex
  Buttons.jsx                      # Demo buttons
  Forms.jsx                        # Demo inputs
  Alerts.jsx
  Badges.jsx
  Cards.jsx
  Tables.jsx
  Loaders.jsx
  EmptyState.jsx
  Icons.jsx
  ProductCardState.jsx             # 5 variants product card
  CouponBox.jsx                    # 2 states
  CouponCard.jsx                   # Admin preview
  OrderTimeline.jsx
  FilterSidebar.jsx
  ToC.jsx                          # Sticky sidebar nav
  Layout/index.jsx                 # Header + Footer preview
```

### Routing changes
```js
// index.js
<Route path='/design-system' element={<DesignSystemScreen />} />
```

### Header link (optional)
Thêm vào dropdown Admin (hoặc user menu) "Design System" → trỏ tới `/design-system`.

---

## 7. 📊 Acceptance Criteria

Khi xong, trang phải:
- [ ] Mở `http://localhost:3000/design-system` hiển thị đầy đủ ~40 components
- [ ] Có **sticky TOC** bên trái, click link → smooth-scroll tới section
- [ ] Có **"Copy" button** trên mỗi code snippet (reusability)
- [ ] **Không error** trong console
- [ ] **Responsive** trên mobile (TOC collapse thành dropdown hoặc hide)
- [ ] **Bundle size impact**: < +30 KB gzipped (chỉ thêm components, không thêm lib)
- [ ] Screenshot ổn cho portfolio

---

## 8. ⏱ Estimate

| Phase | Effort |
|---|---|
| 1. Setup + TOC + base Section component | 1h |
| 2. Brand section (color, type, spacing) | 30 min |
| 3. Core components (buttons, forms, alerts...) | 2h |
| 4. eCommerce patterns (product card, coupon, order status) | 2h |
| 5. Layout patterns (header, footer, filter) | 1h |
| 6. Icons + polish + responsive | 1h |
| 7. Final review + screenshots | 30 min |
| **Total** | **~8h** |

---

## 9. ❓ Decisions cần user xác nhận

| # | Decision | Default |
|---|---|---|
| 1 | **URL** `/design-system` (public) vs `/admin/design-system` (gated)? | public |
| 2 | **Style guide "tone"**: Technical (nhiều code/states) vs Marketing (nhiều hero/info)? | Technical |
| 3 | **Sections** liệt kê ở trên đã đủ chưa? Muốn thêm/bớt gì? | giữ nguyên |
| 4 | **Color choice** dùng Bootstrap mặc định hay custom palette (Tailwind-like)? | giữ Bootstrap |
| 5 | **Showcase feature vừa build** (Wishlist, Coupons, Filter) ở section eCommerce? | có |
| 6 | Có cần **dark mode toggle** cho design system? | không |
| 7 | Có cần **interactive playground** (vd: đổi màu primary live)? | không (giai đoạn sau) |

---

## 10. 🚫 Out of scope (KHÔNG làm ở đây)

- Storybook setup (quá nặng cho project này)
- Live theme editor
- Component code generator
- Documentation site riêng (chỉ route trong app)
- Multi-page docs (chỉ 1 scroll page)

---

## 11. ✅ Next steps

Sau khi bạn duyệt proposal này:
1. Tạo issue / task list chi tiết cho từng section
2. Code theo thứ tự A → B → C → D → E → F
3. Test responsive + commit từng phase
4. Cuối cùng: cập nhật README với link + screenshot

---

> **Bạn muốn điều chỉnh gì trong proposal này trước khi tôi bắt đầu code?**
> - Có section nào thừa/thiếu?
> - Sections nào cần ưu tiên làm trước?
> - Có muốn thêm "interactive playground" (click button → see code change)?
> - Có muốn tôi chia nhỏ thành nhiều giai đoạn (gợi ý: làm trước Core + eCommerce trước)?
