import type { TypographyOptions } from '@mui/material/styles/createTypography';

/**
 * Typography scale. Inter font, 8px base, semantic sizes.
 */
export const typography: TypographyOptions = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", system-ui, sans-serif',
  // Base font size: 14px (compact, denser UI)
  htmlFontSize: 14,

  h1: {
    fontSize: '3.5rem',     // 49px
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2.5rem',     // 35px
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '2rem',       // 28px
    fontWeight: 600,
    lineHeight: 1.25,
  },
  h4: {
    fontSize: '1.5rem',     // 21px
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h5: {
    fontSize: '1.25rem',    // 17.5px
    fontWeight: 500,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1.125rem',   // 15.75px
    fontWeight: 500,
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
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.02em',
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
  },
  overline: {
    fontSize: '0.625rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
};
