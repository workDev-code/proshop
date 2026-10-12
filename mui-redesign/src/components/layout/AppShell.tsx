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

      {/*
        SideNav is a flex item that takes its own width (240 or 64).
        DO NOT also set margin-left or width on <main> — it would double-count
        and push the content area way off to the right.
      */}
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
          flexGrow: 1,                          // take remaining width
          minWidth: 0,                          // prevent flex item overflow with long content
          mt: '64px',                            // offset for fixed TopBar
          p: { xs: 2, sm: 3, md: 4 },           // uniform padding
          transition: 'padding 200ms ease',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
