import type { PaletteOptions } from '@mui/material';

/**
 * Brand color tokens.
 * Primary = Indigo 600 (#4F46E5) — chosen for premium, trustworthy feel.
 */
export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#4F46E5',
    light: '#818CF8',
    dark: '#3730A3',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#EC4899',
    light: '#F472B6',
    dark: '#BE185D',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#000000',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    disabled: '#94A3B8',
  },
  divider: '#E2E8F0',
  grey: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#818CF8',
    light: '#A5B4FC',
    dark: '#4F46E5',
    contrastText: '#0F172A',
  },
  secondary: {
    main: '#F472B6',
    light: '#F9A8D4',
    dark: '#EC4899',
    contrastText: '#0F172A',
  },
  success: {
    main: '#34D399',
    light: '#6EE7B7',
    dark: '#10B981',
    contrastText: '#0F172A',
  },
  warning: {
    main: '#FBBF24',
    light: '#FCD34D',
    dark: '#F59E0B',
    contrastText: '#0F172A',
  },
  error: {
    main: '#F87171',
    light: '#FCA5A5',
    dark: '#EF4444',
    contrastText: '#0F172A',
  },
  info: {
    main: '#60A5FA',
    light: '#93C5FD',
    dark: '#3B82F6',
    contrastText: '#0F172A',
  },
  background: {
    default: '#0F172A',
    paper: '#1E293B',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#CBD5E1',
    disabled: '#64748B',
  },
  divider: '#334155',
  grey: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
};
