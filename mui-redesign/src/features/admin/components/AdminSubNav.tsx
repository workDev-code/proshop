import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory2 as ProductsIcon,
  Receipt as OrdersIcon,
  Group as UsersIcon,
  LocalOffer as CouponsIcon,
} from '@mui/icons-material';

const TABS = [
  { label: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
  { label: 'Products', path: '/admin/products', icon: <ProductsIcon /> },
  { label: 'Orders', path: '/admin/orders', icon: <OrdersIcon /> },
  { label: 'Users', path: '/admin/users', icon: <UsersIcon /> },
  { label: 'Coupons', path: '/admin/coupons', icon: <CouponsIcon /> },
];

/**
 * Sub-navigation tabs for /admin/* routes.
 * Active tab is derived from the current URL.
 */
export const AdminSubNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // For exact /admin path show tab 0
  let active = TABS.findIndex((t) => t.path === pathname);
  if (pathname === '/admin') active = 0;
  if (active === -1) active = 0;

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs
        value={active}
        onChange={(_, v) => navigate(TABS[v].path)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {TABS.map((t) => (
          <Tab key={t.path} icon={t.icon} iconPosition="start" label={t.label} />
        ))}
      </Tabs>
    </Box>
  );
};
