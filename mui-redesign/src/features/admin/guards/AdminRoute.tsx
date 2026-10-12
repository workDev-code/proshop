import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Stack, Typography, Alert, Button } from '@mui/material';
import { Lock as LockIcon, Home as HomeIcon } from '@mui/icons-material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useCurrentUser } from '../../auth/hooks';

/**
 * Guard for /admin/* routes.
 *  - Loading session → spinner
 *  - Not logged in → /login with redirect-back (handled by RequireAuth wrapper)
 *  - Logged in but not admin → 403 screen with link to /
 */
export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Checking admin privileges…
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!user?.isAdmin) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'grid',
          placeItems: 'center',
          p: 2,
        }}
      >
        <Stack alignItems="center" spacing={2} sx={{ maxWidth: 480, textAlign: 'center' }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'error.lighter',
              color: 'error.main',
            }}
          >
            <LockIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            403 — Admins only
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You need administrator privileges to access this area. If you believe this is
            an error, contact your store owner.
          </Typography>
          <Alert severity="info" sx={{ width: '100%' }}>
            Logged in as <strong>{user?.email}</strong> (not admin). Try logging in with{' '}
            <code>admin@email.com</code>.
          </Alert>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            startIcon={<HomeIcon />}
          >
            Back to home
          </Button>
        </Stack>
      </Box>
    );
  }

  return <>{children}</>;
};
