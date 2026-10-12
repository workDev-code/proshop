import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, InputBase, Stack, Button, Breadcrumbs, Link } from '@mui/material';
import { Search as SearchIcon, ExitToApp as ExitIcon } from '@mui/icons-material';

const ROUTE_LABELS: Record<string, string> = {
  '/admin': 'Overview',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/users': 'Customers',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
};

const getCurrentLabel = (pathname: string) => {
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];
  // try parent match
  const parent = '/' + pathname.split('/').slice(1, 3).join('/');
  return ROUTE_LABELS[parent] ?? 'Admin';
};

/**
 * Admin top bar (74px, white) matching the prototype.
 *
 *   Dashboard / [Section]              [search 200px]  [+ Add product]  [Date]
 */
export const AdminTopbar = () => {
  const { pathname } = useLocation();
  const label = getCurrentLabel(pathname);

  return (
    <Box
      sx={{
        height: 74,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        gap: 2.25,
        position: 'sticky',
        top: 0,
        zIndex: 5,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Breadcrumbs sx={{ fontSize: 11, color: 'text.secondary' }}>
          <Link component={RouterLink} to="/admin" underline="hover" color="inherit" sx={{ fontSize: 11 }}>
            Dashboard
          </Link>
          <Box component="strong" sx={{ color: 'text.primary', fontSize: 13, ml: 1, fontWeight: 700 }}>
            {label}
          </Box>
        </Breadcrumbs>
      </Box>

      <Stack direction="row" spacing={1.25} alignItems="center">
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            px: 1.5,
            py: 0.75,
            width: 200,
            gap: 0.75,
          }}
        >
          <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <InputBase placeholder="Search…" sx={{ fontSize: 11, flex: 1 }} />
        </Box>

        <Button
          component={RouterLink}
          to="/"
          variant="outlined"
          size="small"
          startIcon={<ExitIcon sx={{ fontSize: 14 }} />}
          sx={{
            borderRadius: 1,
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'none',
            color: 'text.secondary',
            borderColor: 'divider',
            display: { xs: 'none', sm: 'inline-flex' },
          }}
        >
          Back to store
        </Button>
      </Stack>
    </Box>
  );
};
