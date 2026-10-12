import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

/**
 * Admin dashboard layout.
 *
 *   ┌───────┬──────────────────────────────┐
 *   │       │  Topbar (74px, sticky)       │
 *   │       ├──────────────────────────────┤
 *   │ Side  │                              │
 *   │ 238px │  Content (max 1600px)        │
 *   │       │                              │
 *   └───────┴──────────────────────────────┘
 */
export const AdminShell = () => (
  <Box sx={{ display: 'flex', bgcolor: '#f5f6f8', minHeight: '100vh', color: '#202532' }}>
    <AdminSidebar />
    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <AdminTopbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 1600,
          mx: 'auto',
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  </Box>
);
