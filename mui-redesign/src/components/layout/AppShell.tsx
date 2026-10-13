import { Outlet, useLocation } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { TopBar } from './TopBar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { useCart } from '../../features/cart/hooks';

const TOPBAR_HEIGHT = 82;

/**
 * Storefront layout.
 *
 * Vertical stack matching the approved HTML prototype:
 *
 *   [AnnouncementBar — fixed dark #1C1C1A]
 *   [TopBar - sticky, dark blur]
 *   [main content   - centered, max 1240]
 *   [Footer         - dark]
 *
 * No sidebar (the sidebar exists only in the admin shell).
 * Cart drawer is mounted here so the cart icon in TopBar can open it
 * from anywhere in the storefront.
 */
export const AppShell = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [cartOpen, setCartOpen] = useState(false);
  const { totals } = useCart();
  const location = useLocation();

  return (
    <Box
      sx={{
        // Page-wide background tuned to match the fixed-dark announcement
        // bar so the strip visually extends the page rather than floating
        // over a lighter band.
        bgcolor: (t) =>
          t.palette.mode === 'dark' ? '#1C1C1A' : 'background.default',
        minHeight: '100vh',
      }}
    >
      <AnnouncementBar />

      <TopBar
        onMenuClick={() => {/* mobile drawer trigger */}}
        showMenuButton={!isDesktop}
        currentPath={location.pathname}
        onCartClick={() => setCartOpen(true)}
        cartCount={totals.itemsCount}
      />

      <Box
        component="main"
        sx={{
          width: '100%',
          maxWidth: 1240,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: '28px' },
        }}
      >
        <Outlet />
      </Box>

      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </Box>
  );
};

export const LAYOUT_TOKENS = {
  TOPBAR_HEIGHT,
};
