import { NavLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory2 as ProductsIcon,
  ShoppingCart as OrdersIcon,
  Favorite as WishlistIcon,
  DesignServices as DesignIcon,
  ChevronLeft as CollapseIcon,
  ChevronRight as ExpandIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';

interface NavItem {
  label: string;
  to: string;
  icon: JSX.Element;
}

const NAV: NavItem[] = [
  { label: 'Home',      to: '/',          icon: <DashboardIcon /> },
  { label: 'Cart',      to: '/cart',      icon: <ProductsIcon /> },
  { label: 'Orders',    to: '/orders',    icon: <OrdersIcon /> },
  { label: 'Wishlist',  to: '/wishlist',  icon: <WishlistIcon /> },
  { label: 'Profile',   to: '/profile',   icon: <ProfileIcon /> },
];

const SECONDARY: NavItem[] = [
  { label: 'Design System', to: '/design-system', icon: <DesignIcon /> },
];

interface Props {
  variant: 'permanent' | 'temporary';
  open: boolean;
  onClose: () => void;
  mini: boolean;
  onToggleMini: () => void;
  width: number;
}

export const SideNav = ({ variant, open, onClose, mini, onToggleMini, width }: Props) => {
  const renderList = (items: NavItem[]) =>
    items.map((it) => {
      const isActive =
        it.to === '/' ? location.pathname === '/' : location.pathname.startsWith(it.to);
      return (
        <ListItem key={it.to} disablePadding sx={{ px: 1, py: 0.25 }}>
          <ListItemButton
            component={NavLink}
            to={it.to}
            onClick={variant === 'temporary' ? onClose : undefined}
            sx={{
              borderRadius: 2,
              minHeight: 44,
              justifyContent: mini ? 'center' : 'flex-start',
              px: mini ? 1 : 1.5,
              bgcolor: isActive ? 'action.selected' : 'transparent',
              color: isActive ? 'primary.main' : 'text.primary',
              '&:hover': { bgcolor: 'action.hover' },
              transition: 'all 200ms ease',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: mini ? 0 : 1.5,
                justifyContent: 'center',
                color: isActive ? 'primary.main' : 'text.secondary',
              }}
            >
              {it.icon}
            </ListItemIcon>
            {!mini && (
              <ListItemText
                primary={it.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      );
    });

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'relative',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          display: 'flex',
          flexShrink: 0,
          justifyContent: mini ? 'center' : 'space-between',
          alignItems: 'center',
          px: 2,
        }}
      >
        {!mini && (
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
            Menu
          </Typography>
        )}
        <IconButton onClick={onToggleMini} size="small" aria-label="Toggle mini">
          {mini ? <ExpandIcon /> : <CollapseIcon />}
        </IconButton>
      </Toolbar>
      <Divider sx={{ flexShrink: 0 }} />
      <List sx={{ py: 1, flexShrink: 0 }}>{renderList(NAV)}</List>

      {/* Bottom group — absolutely positioned so it sits at the bottom of the drawer */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ p: 1 }}>
          {!mini && (
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ pl: 1.5, fontWeight: 600 }}
            >
              Tools
            </Typography>
          )}
          <List dense>{renderList(SECONDARY)}</List>
        </Box>
        {!mini && (
          <Box sx={{ px: 2, py: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
              ProShop v3.0
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', fontSize: '0.65rem' }}>
              Boutique commerce demo
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: 'width 200ms ease !important',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
