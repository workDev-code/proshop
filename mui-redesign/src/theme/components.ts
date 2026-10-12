import type { Components, Theme } from '@mui/material';

/**
 * Component overrides — single source of truth for the look.
 * Editorial / boutique aesthetic: large border-radius, soft borders, pill buttons.
 */
const LINE = '#e8e8e1';
const INK = '#20211f';

export const components: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        transition: 'background-color 0.3s ease, color 0.3s ease',
        letterSpacing: '0',
      },
      '*::-webkit-scrollbar': { width: 8, height: 8 },
      '*::-webkit-scrollbar-thumb': { backgroundColor: '#d4d4cb', borderRadius: 4 },
      '*::-webkit-scrollbar-thumb:hover': { backgroundColor: '#a8a89e' },
      '::selection': { backgroundColor: 'rgba(217,93,57,0.18)' },
    },
  },

  MuiButton: {
    defaultProps: { disableElevation: true, disableRipple: false },
    styleOverrides: {
      root: {
        // Pill shape
        borderRadius: 999,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 22,
        paddingRight: 22,
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.04em',
        transition: 'all 200ms ease',
        '&:hover': { transform: 'translateY(-1px)' },
      },
      sizeSmall: {
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: '0.75rem',
        borderRadius: 999,
      },
      sizeLarge: {
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 28,
        paddingRight: 28,
        fontSize: '0.875rem',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': { boxShadow: '0 8px 20px rgba(32,33,31,0.12)' },
      },
      containedPrimary: {
        // Slight cream-on-dark for the "ink" primary
        backgroundColor: INK,
        color: '#fff',
        '&:hover': { backgroundColor: '#000' },
      },
      containedSecondary: {
        // Terracotta CTA
        backgroundColor: '#d95d39',
        color: '#fff',
        '&:hover': { backgroundColor: '#b84425' },
      },
      outlined: {
        borderWidth: 1,
        '&:hover': { borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.02)' },
      },
      text: {
        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
      },
    },
  },

  MuiTextField: {
    defaultProps: { variant: 'outlined', size: 'medium' },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 12,
        fontSize: '0.9375rem',
        // Background follows palette so dark mode has dark inputs (not white-on-white)
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
        '& fieldset': { borderColor: LINE },
        '&:hover fieldset': { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : '#c8c8be' },
        '&.Mui-focused fieldset': { borderWidth: 1.5, borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[100] : INK },
      }),
      input: { paddingTop: 14, paddingBottom: 14 },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        '&.Mui-focused': { fontWeight: 500 },
      },
    },
  },

  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        borderRadius: 18,
        border: `1px solid ${LINE}`,
        backgroundImage: 'none',
        transition: 'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
      },
    },
  },

  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      rounded: { borderRadius: 18 },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 999, height: 28, fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.04em' },
      label: { paddingLeft: 12, paddingRight: 12 },
      outlined: { borderColor: LINE },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: 18 },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: INK,
        fontSize: '0.75rem',
        fontWeight: 500,
        borderRadius: 8,
        padding: '6px 10px',
      },
      arrow: { color: INK },
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: {
        paddingTop: 14,
        paddingBottom: 14,
        borderColor: LINE,
      },
      head: { fontWeight: 600, color: '#5e6057', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
    },
  },

  MuiAlert: {
    defaultProps: { variant: 'standard' },
    styleOverrides: {
      root: { borderRadius: 12, fontSize: '0.875rem' },
      standardSuccess: { backgroundColor: '#e8efe1', color: '#4a6b3a' },
      standardError:   { backgroundColor: '#fbe9e2', color: '#b84425' },
      standardWarning: { backgroundColor: '#faf0d8', color: '#9e6c14' },
      standardInfo:    { backgroundColor: '#e8eae6', color: '#3f4d59' },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' },
    },
  },

  MuiTabs: {
    styleOverrides: {
      indicator: { backgroundColor: INK, height: 2, borderRadius: 1 },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: 'none',
        backgroundImage: 'none',
      },
    },
  },

  MuiAppBar: {
    defaultProps: { elevation: 0, color: 'inherit' },
  },

  MuiBadge: {
    styleOverrides: {
      badge: {
        fontWeight: 700,
        fontSize: '0.625rem',
        height: 18,
        minWidth: 18,
        padding: '0 4px',
        border: `2px solid #f7f7f4`,
      },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: { transition: 'all 200ms ease' },
    },
  },

  MuiLink: {
    defaultProps: { underline: 'hover' },
    styleOverrides: {
      root: { transition: 'color 200ms ease' },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: { borderColor: LINE },
    },
  },
};
