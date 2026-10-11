import { createTheme } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette';
import { typography } from './typography';
import { shadows } from './shadows';
import { components } from './components';

export const buildTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: mode === 'dark' ? darkPalette : lightPalette,
    typography,
    shadows: shadows as unknown as ReturnType<typeof createTheme>['shadows'],
    shape: { borderRadius: 12 },
    components,
  });

export type AppTheme = ReturnType<typeof buildTheme>;
