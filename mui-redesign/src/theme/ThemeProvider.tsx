import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { buildTheme } from './theme';

type Mode = 'light' | 'dark';

const STORAGE_KEY = 'proshop-theme-mode';

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
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
        {children}
      </MuiThemeProvider>
    </Ctx.Provider>
  );
};

export const useAppTheme = () => useContext(Ctx);
