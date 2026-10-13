import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  GlobalStyles,
} from '@mui/material';
import { buildTheme } from './theme';

type Mode = 'light' | 'dark';

const STORAGE_KEY = 'proshop-theme-mode-v2';

interface ThemeCtx {
  mode: Mode;
  toggle: () => void;
  setMode: (mode: Mode) => void;
}

const Ctx = createContext<ThemeCtx>({
  mode: 'light',
  toggle: () => {},
  setMode: () => {},
});

/** Read user preference from localStorage or fall back to system */
const readInitial = (): Mode => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(STORAGE_KEY) as Mode | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return 'light';
};

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<Mode>(readInitial);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo<ThemeCtx>(
    () => ({
      mode,
      toggle: () => setModeState((m) => (m === 'light' ? 'dark' : 'light')),
      setMode: setModeState,
    }),
    [mode]
  );

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <Ctx.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {/* App-wide a11y rules:
             - Default focus-visible ring uses the brand accent.
             - prefers-reduced-motion: kill all transitions/animations. */}
        <GlobalStyles
          styles={{
            ':root': {
              '--proshop-accent': '#E8795A',
              '--proshop-accent-ink': '#1C1C1A',
            },
            '*:focus-visible': {
              outline: '2px solid var(--proshop-accent)',
              outlineOffset: 2,
            },
            '@media (prefers-reduced-motion: reduce)': {
              '*, *::before, *::after': {
                animationDuration: '0.01ms !important',
                animationIterationCount: '1 !important',
                transitionDuration: '0.01ms !important',
                scrollBehavior: 'auto !important',
              },
            },
          }}
        />
        {children}
      </MuiThemeProvider>
    </Ctx.Provider>
  );
};

export const useAppTheme = () => useContext(Ctx);
