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
        SideNav is a MUI Drawer (permanent variant on desktop) which is
        position:fixed and overlays the page. So <main> needs marginLeft
        to push content out from under the drawer. The mobile drawer
        (temporary) doesn't need this — it slides in over content.
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
          flexGrow: 1,
          flexBasis: 0,                         // grow from 0 so it shares space with SideNav
          minWidth: 0,                          // prevent flex item overflow with long content
          mt: '64px',                            // offset for fixed TopBar
          ml: { xs: 0, md: `${drawerWidth}px` }, // offset for permanent Drawer on desktop
          transition: 'margin-left 200ms ease',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
        }}
      >
        {/* Centered max-width container so content doesn't stretch on huge screens */}
        <Box
          sx={{
            maxWidth: 1440,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
