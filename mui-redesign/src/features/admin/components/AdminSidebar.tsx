import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
} from '@mui/material';
import {
  SpaceDashboard as OverviewIcon,
  Inventory2 as ProductsIcon,
  ReceiptLong as OrdersIcon,
  Group as CustomersIcon,
  Insights as AnalyticsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useCurrentUser } from '../../auth/hooks';

interface NavItem {
  label: string;
  to: string;
  icon: JSX.Element;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview',  to: '/admin',           icon: <OverviewIcon />, exact: true },
  { label: 'Products',  to: '/admin/products',  icon: <ProductsIcon /> },
  { label: 'Orders',    to: '/admin/orders',    icon: <OrdersIcon /> },
  { label: 'Customers', to: '/admin/users',     icon: <CustomersIcon /> },
  { label: 'Analytics', to: '/admin/analytics', icon: <AnalyticsIcon /> },
  { label: 'Settings',  to: '/admin/settings',  icon: <SettingsIcon /> },
];

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Admin sidebar (dark navy, 238px wide).
 *
 * Mirrors the approved HTML prototype:
 *   [brand]              (ProShop with accent S)
 *   MENU                 (caption)
 *   Overview
 *   Products
 *   Orders
 *   Customers
 *   Analytics
 *   Settings
 *   ─────────────
 *   [avatar] Store Admin / admin@proshop.demo
 */
export const AdminSidebar = () => {
  const { pathname } = useLocation();
  const { user } = useCurrentUser();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <Box
      component="aside"
      sx={{
        width: 238,
        flexShrink: 0,
        bgcolor: '#171c27',
        color: '#e7eaf0',
        display: 'flex',
        flexDirection: 'column',
        gap: 3.25,
        py: 3.125,
        px: 2,
        minHeight: '100vh',
      }}
    >
      {/* Brand */}
      <Box
        component={NavLink}
        to="/admin"
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: 23,
          fontWeight: 800,
          letterSpacing: '-1.3px',
          color: '#e7eaf0',
          textDecoration: 'none',
          px: 1.625,
          '& em': { fontStyle: 'normal', color: 'secondary.light' },
        }}
      >
        Pro<em>S</em>hop
      </Box>

      {/* Caption */}
      <Box>
        <Typography
          sx={{
            color: '#858d9e',
            fontSize: '0.5625rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            px: 1.625,
            mb: 0.875,
            fontWeight: 600,
          }}
        >
          Menu
        </Typography>
        <Stack spacing={0.625}>
          {NAV_ITEMS.map((it) => {
            const active = isActive(it.to, it.exact);
            const Icon = it.icon;
            return (
              <Box
                key={it.to}
                component={NavLink}
                to={it.to}
                end={it.exact}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  borderRadius: 1.125,
                  py: 1.5,
                  px: 1.625,
                  fontSize: 12,
                  color: active ? '#fff' : '#aeb6c6',
                  bgcolor: active ? '#2b3241' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background-color 160ms ease, color 160ms ease',
                  '&:hover': { bgcolor: '#2b3241', color: '#fff' },
                  '& svg': { fontSize: 18 },
                }}
              >
                {Icon}
                <span>{it.label}</span>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Bottom: admin profile */}
      <Box sx={{ mt: 'auto', borderTop: '1px solid #303746', pt: 2.25, px: 1.5 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              bgcolor: '#f2d4c9',
              color: '#75412f',
              display: 'grid',
              placeItems: 'center',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {getInitials(user?.name ?? 'SA')}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#e7eaf0', lineHeight: 1.2 }}>
              {user?.name ?? 'Store Admin'}
            </Typography>
            <Typography sx={{ fontSize: 10, color: '#939bac', mt: 0.5 }}>
              {user?.email ?? 'admin@proshop.demo'}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
