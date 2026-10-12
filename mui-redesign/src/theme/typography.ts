import type { TypographyOptions } from '@mui/material/styles/createTypography';

/**
 * Editorial typography scale.
 * - Manrope for display (headings, brand) — geometric sans
 * - DM Sans for body — clean, highly readable
 * - Larger display sizes for editorial feel
 */
export const typography: TypographyOptions = {
  fontFamily: '"DM Sans", "Inter", system-ui, -apple-system, sans-serif',
  htmlFontSize: 16,

  h1: {
    fontFamily: '"Manrope", "Inter", sans-serif',
    fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
    fontWeight: 800,
    lineHeight: 1.04,
    letterSpacing: '-0.04em',
  },
  h2: {
    fontFamily: '"Manrope", "Inter", sans-serif',
    fontSize: 'clamp(1.75rem, 3vw, 2.375rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
  },
  h3: {
    fontFamily: '"Manrope", "Inter", sans-serif',
    fontSize: '1.75rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h4: {
    fontFamily: '"Manrope", "Inter", sans-serif',
    fontSize: '1.375rem',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h5: {
    fontFamily: '"Manrope", "Inter", sans-serif',
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontFamily: '"Manrope", "Inter", sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '0.9375rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    lineHeight: 1.55,
  },
  button: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.04em',
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
  },
  overline: {
    fontSize: '0.6875rem',
    fontWeight: 700,
    lineHeight: 1.4,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
  },
};
