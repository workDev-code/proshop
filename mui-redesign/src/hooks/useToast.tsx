import { createContext, useCallback, useContext, useMemo, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import type { AlertColor } from '@mui/material';
import { Snackbar, Alert, Stack, Button } from '@mui/material';

/**
 * Minimal toast system built on MUI Snackbar + Alert.
 * - No third-party dependency (notistack etc.)
 * - Queue up to 3 toasts if user spams actions
 * - Default 4000ms duration, configurable
 */

type ToastInput = {
  message: string;
  severity?: AlertColor;
  duration?: number;
};

type ToastContextValue = {
  showToast: (t: ToastInput) => void;
  error: (message: string) => void;
  success: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type QueuedToast = Required<ToastInput>;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<QueuedToast[]>([]);
  const [current, setCurrent] = useState<QueuedToast | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setQueue((prev) => {
      if (prev.length === 0) {
        setCurrent(null);
        return prev;
      }
      const [next, ...rest] = prev;
      setCurrent(next);
      return rest;
    });
  }, []);

  const showToast = useCallback(
    (t: ToastInput) => {
      const normalized: QueuedToast = {
        message: t.message,
        severity: t.severity ?? 'info',
        duration: t.duration ?? 4000,
      };
      // If nothing on screen, show immediately; otherwise queue
      setQueue((prev) => {
        if (current === null) {
          setCurrent(normalized);
          return prev;
        }
        return [...prev, normalized].slice(-3); // keep last 3
      });
    },
    [current],
  );

  const handleClose = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(advance, 200);
  }, [advance]);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      error: (m) => showToast({ message: m, severity: 'error' }),
      success: (m) => showToast({ message: m, severity: 'success' }),
      info: (m) => showToast({ message: m, severity: 'info' }),
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={current !== null}
        autoHideDuration={current?.duration ?? 4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {current ? (
          <Alert
            severity={current.severity}
            variant="filled"
            onClose={handleClose}
            sx={{ minWidth: 280 }}
            action={
              queue.length > 0 ? (
                <Button color="inherit" size="small" onClick={advance}>
                  Next ({queue.length})
                </Button>
              ) : undefined
            }
          >
            {current.message}
          </Alert>
        ) : (
          <span />
        )}
      </Snackbar>
      {queue.length > 0 && (
        <Stack
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 24,
            pointerEvents: 'none',
            opacity: 0.6,
            fontSize: 12,
            color: 'text.secondary',
          }}
        >
          +{queue.length} more
        </Stack>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};
