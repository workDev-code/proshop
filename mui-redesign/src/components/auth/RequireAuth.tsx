import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useCurrentUser } from '../../features/auth/hooks';

/**
 * Route guard for protected pages.
 * - While checking session: show centered spinner (avoids flash-of-login)
 * - Not authenticated: redirect to /login with `from` state
 * - Authenticated: render children
 */
export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isLoading, isAuthenticated } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Checking session…
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
