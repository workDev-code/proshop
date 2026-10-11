import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { TopBar } from './TopBar';
import { SideNav } from './SideNav';

const DRAWER_FULL = 240;
const DRAWER_MINI = 64;

export const AppShell = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mini, setMini] = useState(false);
  const location = useLocation();

  const drawerWidth = mini ? DRAWER_MINI : DRAWER_FULL;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopBar
        onMenuClick={() => setMobileOpen((v) => !v)}
        showMenuButton={!isDesktop}
        currentPath={location.pathname}
      />

      <SideNav
        variant={isDesktop ? 'permanent' : 'temporary'}
        open={isDesktop ? true : mobileOpen}
        onClose={() => setMobileOpen(false)}
        mini={mini}
        onToggleMini={() => setMini((v) => !v)}
        width={drawerWidth}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          mt: '64px',
          p: { xs: 2, md: 3 },
          transition: 'margin-left 200ms ease, width 200ms ease',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
