import type { PaletteOptions } from '@mui/material';

/**
 * ProShop Lifestyle palette.
 * Inspired by editorial / boutique brands (Aritzia, Muji, Studio Neat).
 * Cream paper background + terracotta accent + sage secondary.
 */

const INK = '#20211f';
const MUTED = '#777a72';
const LINE = '#e8e8e1';
const PAPER = '#f7f7f4';
const ACCENT = '#d95d39';
const ACCENT_DARK = '#b84425';
const SAGE = '#dfe6d9';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: INK, // buttons, primary text — minimal palette
    light: '#3a3b38',
    dark: '#000000',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: ACCENT, // terracotta — accents, CTAs
    light: '#e58868',
    dark: ACCENT_DARK,
    contrastText: '#FFFFFF',
  },
  success: { main: '#4a6b3a', light: '#7ba05e', dark: '#2f4a23', contrastText: '#fff' },
  warning: { main: '#c98a25', light: '#e1a650', dark: '#9e6c14', contrastText: '#fff' },
  error:   { main: '#b84425', light: '#d95d39', dark: '#8a2c14', contrastText: '#fff' },
  info:    { main: '#5a6b7a', light: '#8a98a5', dark: '#3f4d59', contrastText: '#fff' },
  background: {
    default: PAPER,
    paper: '#FFFFFF',
  },
  text: {
    primary: INK,
    secondary: MUTED,
    disabled: '#a8a89e',
  },
  divider: LINE,
  grey: {
    50: '#fafaf7',
    100: '#f4f4ef',
    200: '#e8e8e1',
    300: '#d4d4cb',
    400: '#a8a89e',
    500: '#7a7c72',
    600: '#5e6057',
    700: '#3e3f39',
    800: '#28292a',
    900: INK,
  },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#f1f1ec',
    light: '#ffffff',
    dark: '#c8c8c0',
    contrastText: INK,
  },
  secondary: {
    main: '#e58868',
    light: '#f0a085',
    dark: ACCENT,
    contrastText: INK,
  },
  success: { main: '#7ba05e', light: '#9bbc7e', dark: '#4a6b3a', contrastText: '#000' },
  warning: { main: '#e1a650', light: '#ecc07d', dark: '#c98a25', contrastText: '#000' },
  error:   { main: '#d95d39', light: '#e58868', dark: '#b84425', contrastText: '#fff' },
  info:    { main: '#8a98a5', light: '#a8b4c0', dark: '#5a6b7a', contrastText: '#000' },
  background: {
    default: '#1a1b18',
    paper: '#22231f',
  },
  text: {
    primary: '#f1f1ec',
    secondary: '#a8a89e',
    disabled: '#5e6057',
  },
  divider: '#2e2f2a',
  grey: {
    50: '#1a1b18',
    100: '#22231f',
    200: '#2e2f2a',
    300: '#3e3f39',
    400: '#5e6057',
    500: '#7a7c72',
    600: '#a8a89e',
    700: '#c8c8c0',
    800: '#e8e8e1',
    900: '#f4f4ef',
  },
};

// Brand-only tokens (consumed by sx props where palette.* doesn't fit)
export const brand = {
  paper: PAPER,
  ink: INK,
  muted: MUTED,
  line: LINE,
  accent: ACCENT,
  accentDark: ACCENT_DARK,
  sage: SAGE,
  // Re-export as CSS variables for inline use
  cssVars: {
    '--ink': INK,
    '--muted': MUTED,
    '--line': LINE,
    '--paper': PAPER,
    '--accent': ACCENT,
    '--accent-dark': ACCENT_DARK,
    '--sage': SAGE,
  },
};
