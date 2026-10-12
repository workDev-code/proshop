/**
 * Design tokens extracted from the approved HTML prototype.
 *
 * - Colors / typography mirror what palette.ts + typography.ts already
 *   expose via the MUI theme. These are pure-CSS, JSX-friendly copies
 *   for places where the theme is not in scope (e.g. dynamic sx, CSS
 *   that runs outside the React tree).
 *
 * - Container widths, breakpoints, spacing, radius, shadow scales
 *   are stored here so layout components and pages can share them.
 */
export const CONTAINER = {
  storefront: 1240, // .wrap
  storefrontGutter: 56, // calc(100% - 56px) in prototype
  admin: 1600, // .admin-content
  detail: 1240,
} as const;

export const BREAKPOINTS = {
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1440,
} as const;

export const SPACING = {
  sectionY: 72,
  sectionYMobile: 48,
  row: 16,
  gap: 18,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const SHADOWS = {
  // reused across product cards, admin panels, cart drawer
  card: '0 18px 50px rgba(32,33,31,.08)',
  cardHover: '0 24px 60px rgba(32,33,31,.12)',
  popover: '0 8px 24px rgba(32,33,31,.10)',
} as const;

/* Brand color tokens (also lives in palette.ts as `brand` for the
   theme — exported here for non-React contexts). */
export const COLOR = {
  ink: '#20211f',
  muted: '#777a72',
  line: '#e8e8e1',
  paper: '#f7f7f4',
  white: '#fff',
  accent: '#d95d39',
  accentDark: '#b84425',
  accentSoft: '#f2b49f',
  sage: '#dfe6d9',
  // admin
  adminBg: '#f5f6f8',
  adminSidebar: '#171c27',
  adminSidebarHover: '#2b3241',
  adminLine: '#e9ecf1',
  adminText: '#202532',
  adminMuted: '#818999',
  // status
  success: '#17845e',
  successBg: '#e8f7f0',
  warning: '#a96a0b',
  warningBg: '#fff4df',
  info: '#326bc4',
  infoBg: '#eaf2ff',
  error: '#c84c4c',
  errorBg: '#ffeded',
} as const;
