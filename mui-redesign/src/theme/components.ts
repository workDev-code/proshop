import type { Components, Theme } from '@mui/material';

/**
 * Component overrides — single source of truth for the whole look.
 * Apply via theme.components.MuiButton.styleOverrides, etc.
 */
export const components: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        transition: 'background-color 0.3s ease, color 0.3s ease',
      },
      '*::-webkit-scrollbar': { width: 8, height: 8 },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: '#CBD5E1',
        borderRadius: 4,
      },
      '*::-webkit-scrollbar-thumb:hover': { backgroundColor: '#94A3B8' },
    },
  },

  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        borderRadius: 10,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 22,
        paddingRight: 22,
        fontWeight: 600,
        textTransform: 'none',
        transition: 'all 200ms ease',
        '&:hover': { transform: 'translateY(-1px)' },
      },
      sizeSmall: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 14,
        paddingRight: 14,
        fontSize: '0.8125rem',
      },
      sizeLarge: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 28,
        paddingRight: 28,
        fontSize: '0.9375rem',
      },
      contained: {
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        '&:hover': { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)' },
      },
      outlined: {
        borderWidth: 1.5,
        '&:hover': { borderWidth: 1.5 },
      },
    },
  },

  MuiTextField: {
    defaultProps: { variant: 'outlined', size: 'medium' },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        fontSize: '0.9375rem',
        '& fieldset': { borderWidth: 1 },
        '&:hover fieldset': { borderColor: '#94A3B8' },
        '&.Mui-focused fieldset': { borderWidth: 1.5 },
      },
      input: {
        paddingTop: 14,
        paddingBottom: 14,
      },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: '0.9375rem',
        '&.Mui-focused': { fontWeight: 500 },
      },
    },
  },

  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        borderRadius: 16,
        border: '1px solid #E2E8F0',
        backgroundImage: 'none',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
      },
    },
  },

  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      rounded: { borderRadius: 16 },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 8, height: 28, fontWeight: 500 },
      label: { paddingLeft: 12, paddingRight: 12 },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: 16 },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: '#0F172A',
        fontSize: '0.75rem',
        fontWeight: 500,
        borderRadius: 6,
        padding: '6px 10px',
      },
      arrow: { color: '#0F172A' },
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: {
        paddingTop: 14,
        paddingBottom: 14,
        borderColor: '#E2E8F0',
      },
      head: { fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' },
    },
  },

  MuiAlert: {
    defaultProps: { variant: 'standard' },
    styleOverrides: {
      root: { borderRadius: 10, fontSize: '0.875rem' },
      standardSuccess: { backgroundColor: '#ECFDF5', color: '#065F46' },
      standardError:   { backgroundColor: '#FEF2F2', color: '#991B1B' },
      standardWarning: { backgroundColor: '#FFFBEB', color: '#92400E' },
      standardInfo:    { backgroundColor: '#EFF6FF', color: '#1E40AF' },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' },
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
};
