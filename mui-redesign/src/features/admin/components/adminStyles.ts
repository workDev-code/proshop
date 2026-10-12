/**
 * Shared visual primitives for the admin pages, modelled on the
 * approved HTML prototype.  Each export is a small `sx` object so
 * pages can simply spread them onto a <Box> (or any MUI component).
 */
import type { SxProps, Theme } from '@mui/material';

/* Title row: "Overview h1 + small description" + optional right slot. */
export const adminTitleRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: 2.5,
  mb: 3.125,
  flexWrap: 'wrap',
};

export const adminH1Sx: SxProps<Theme> = {
  fontFamily: '"Manrope", sans-serif',
  fontSize: 27,
  fontWeight: 800,
  letterSpacing: '-1px',
  color: '#202532',
  lineHeight: 1.2,
  m: 0,
  mb: '7px',
};

export const adminSubtitleSx: SxProps<Theme> = {
  fontSize: 11,
  color: '#818999',
  m: 0,
};

/* Panels: white card with 1px #e9ecf1 border, 13px radius, 20px padding. */
export const adminPanelSx: SxProps<Theme> = {
  bgcolor: '#fff',
  border: '1px solid #e9ecf1',
  borderRadius: '13px',
  p: 2.5,
  minWidth: 0,
};

export const adminPanelHeadSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1.75,
  mb: 2.5,
};

export const adminPanelH2Sx: SxProps<Theme> = {
  fontFamily: '"Manrope", sans-serif',
  fontSize: 14,
  fontWeight: 800,
  color: '#242b39',
  m: 0,
};

export const adminPanelDescSx: SxProps<Theme> = {
  fontSize: 10,
  color: '#858d9b',
  m: 0,
  mt: '6px',
};

/* Mini cards row (3-col on desktop). */
export const adminMiniGridSx: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
  gap: 1.75,
  mb: 2.25,
};

export const adminMiniCardSx: SxProps<Theme> = {
  bgcolor: '#fff',
  border: '1px solid #e9ecf1',
  borderRadius: '12px',
  p: '17px',
};

/* Filter bar (search + selects). */
export const adminFilterRowSx: SxProps<Theme> = {
  display: 'flex',
  gap: 1.125,
  alignItems: 'center',
  flexWrap: 'wrap',
  mb: 2,
};

export const adminInputSx: SxProps<Theme> = {
  border: '1px solid #e4e7ed',
  borderRadius: '8px',
  px: 1.5,
  py: 1.125,
  fontSize: 10,
  bgcolor: '#fff',
  color: '#4d5666',
  minWidth: 190,
};

/* Table primitives. */
export const adminTableSx: SxProps<Theme> = {
  width: '100%',
  borderCollapse: 'collapse',
  whiteSpace: 'nowrap',
};

export const adminThSx: SxProps<Theme> = {
  textAlign: 'left',
  fontSize: 9,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#8992a1',
  bgcolor: '#fafbfc',
  py: 1.5,
  px: 1.625,
  borderTop: '1px solid #edf0f4',
  borderBottom: '1px solid #edf0f4',
  fontWeight: 700,
};

export const adminTdSx: SxProps<Theme> = {
  py: 1.75,
  px: 1.625,
  borderBottom: '1px solid #f0f2f5',
  fontSize: 10,
  color: '#50596a',
};

export const adminTdFirstSx: SxProps<Theme> = {
  ...adminTdSx,
  color: '#272e3d',
  fontWeight: 700,
};

/* Empty / unavailable state (one line: heading + muted explanation). */
export const adminEmptySx: SxProps<Theme> = {
  py: 6,
  textAlign: 'center',
};

export const adminEmptyTitleSx: SxProps<Theme> = {
  fontSize: 13,
  fontWeight: 600,
  color: '#50596a',
  mb: 1,
};

export const adminEmptyDescSx: SxProps<Theme> = {
  fontSize: 11,
  color: '#828b9b',
};

/* Pill-shaped "link" button matching `.admin-link` in the prototype. */
export const adminLinkSx: SxProps<Theme> = {
  color: '#e45f3d',
  fontSize: 10,
  fontWeight: 700,
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': { textDecoration: 'underline' },
};
