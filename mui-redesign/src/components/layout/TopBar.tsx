import { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  LightMode as LightIcon,
  DarkMode as DarkIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingBag as CartIcon,
  FavoriteBorder as WishlistIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useCurrentUser } from '../../features/auth/hooks';
import { useLogoutMutation } from '../../features/auth/authApi';
import { useGetWishlistQuery } from '../../features/wishlist/wishlistApi';
import { useToast } from '../../hooks/useToast';

interface Props {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  currentPath?: string;
  onCartClick?: () => void;
  cartCount?: number;
}

const NAV_LINKS = [
  { label: 'Shop', to: '/' },
  { label: 'Collections', to: '/?sort=newest' },
  { label: 'Stories', to: '/' },
  { label: 'About', to: '/' },
];

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Shared 44x44 touch-target icon button style.
 * - Bumped from 40x40 to 44x44 to meet WCAG 2.5.5 / Apple HIG.
 * - Added focus-visible outline so keyboard users see a clear ring.
 * - Added prefers-reduced-motion guard so the hover transition is
 *   instant when the OS asks for less motion.
 */
const roundBtnSx = {
  width: 44,
  height: 44,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'transparent',
  borderRadius: '50%',
  transition:
    'background-color 200ms ease, border-color 200ms ease, transform 200ms ease',
  '&:hover': { bgcolor: 'background.paper', borderColor: 'grey.300' },
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: '#E8795A',
    outlineOffset: 2,
  },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
} as const;

/** Round 44px icon button matching the prototype's nav-actions. */
const RoundIcon = ({
  children,
  to,
  count,
  invisible,
  onClick,
  ariaLabel,
  title,
}: {
  children: React.ReactNode;
  to?: string;
  count?: number;
  invisible?: boolean;
  onClick?: () => void;
  ariaLabel: string;
  title?: string;
}) => {
  const inner = (
    <Box sx={{ position: 'relative', display: 'inline-grid', placeItems: 'center' }}>
      {children}
      {count !== undefined && !invisible && (
        <Box
          sx={{
            position: 'absolute',
            top: -4,
            right: -4,
            bgcolor: '#E8795A',
            color: '#1C1C1A',
            border: '2px solid',
            borderColor: 'background.paper',
            height: 20,
            minWidth: 20,
            padding: '0 5px',
            borderRadius: 20,
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {count > 99 ? '99+' : count}
        </Box>
      )}
    </Box>
  );

  if (onClick) {
    return (
      <Tooltip title={title ?? ariaLabel}>
        <IconButton onClick={onClick} aria-label={ariaLabel} sx={roundBtnSx}>
          {inner}
        </IconButton>
      </Tooltip>
    );
  }
  if (to) {
    return (
      <Tooltip title={title ?? ariaLabel}>
        <IconButton component={Link} to={to} aria-label={ariaLabel} sx={roundBtnSx}>
          {inner}
        </IconButton>
      </Tooltip>
    );
  }
  return null;
};

/**
 * Storefront top bar matching the approved prototype.
 *
 *   [LOGO]  Shop  Collections  Stories  About     [search pill]   ♡ 🛒 ☀ 👤
 */
export const TopBar = ({
  onMenuClick,
  showMenuButton,
  currentPath,
  onCartClick,
  cartCount = 0,
}: Props) => {
  const { mode, toggle } = useAppTheme();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useCurrentUser();
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !user });
  const [logoutMutate, logoutState] = useLogoutMutation();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const wishlistCount = wishlist?.length ?? 0;

  const handleLogout = async () => {
    setAnchor(null);
    try {
      await logoutMutate().unwrap();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(28,28,26,0.92)'
            : 'rgba(247,247,244,0.94)',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(16px)',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 82,
          height: 82,
          gap: 1,
          px: { xs: 1, sm: 2, md: 3 },
          width: '100%',
          maxWidth: 1240,
          mx: 'auto',
        }}
      >
        {showMenuButton ? (
          <IconButton onClick={onMenuClick} edge="start" aria-label="Open menu">
            <MenuIcon />
          </IconButton>
        ) : (
          <Box
            component={Link}
            to="/"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: { xs: 22, md: 25 },
              fontWeight: 800,
              letterSpacing: '-1.6px',
              color: 'text.primary',
              textDecoration: 'none',
              mr: { xs: 1, md: 2 },
              whiteSpace: 'nowrap',
            }}
          >
            Pro<Box component="em" sx={{ fontStyle: 'normal', color: '#E8795A' }}>S</Box>hop
          </Box>
        )}

        {/* Inline horizontal nav (desktop) */}
        {!showMenuButton && (
          <Stack direction="row" spacing={3.25} alignItems="center" sx={{ ml: 1 }}>
            {NAV_LINKS.map((l) => (
              <Box
                key={l.label}
                component={NavLink}
                to={l.to}
                end={l.to === '/'}
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  transition: 'color 200ms ease',
                  '&:hover, &.active': { color: '#E8795A' },
                  '&:focus-visible': {
                    outline: '2px solid #E8795A',
                    outlineOffset: 4,
                    borderRadius: 1,
                  },
                }}
              >
                {l.label}
              </Box>
            ))}
          </Stack>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Pill search */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            position: 'relative',
            width: 'min(280px, 24vw)',
          }}
        >
          <SearchIcon
            fontSize="small"
            sx={{
              position: 'absolute',
              left: 15,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'text.secondary',
              fontSize: 18,
              pointerEvents: 'none',
            }}
          />
          <InputBase
            placeholder="Search products…"
            inputProps={{ 'aria-label': 'Search products' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const v = (e.target as HTMLInputElement).value.trim();
                if (v) navigate(`/search/${encodeURIComponent(v)}`);
              }
            }}
            sx={{
              width: '100%',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              borderRadius: 999,
              py: 1.25,
              pl: 5,
              pr: 2,
              outline: 'none',
              fontSize: 12,
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
              '&.Mui-focused': {
                borderColor: '#E8795A',
                boxShadow: '0 0 0 3px rgba(232,121,90,0.18)',
              },
              '&:focus-visible': {
                outline: '2px solid #E8795A',
                outlineOffset: 2,
              },
            }}
          />
        </Box>

        {/* Round icon buttons */}
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ ml: { md: 1 } }}>
          <RoundIcon
            ariaLabel="Wishlist"
            title="Wishlist"
            to="/wishlist"
            count={wishlistCount}
            invisible={!user || wishlistCount === 0}
          >
            <WishlistIcon sx={{ fontSize: 18 }} />
          </RoundIcon>

          <RoundIcon
            ariaLabel="Cart"
            title="Cart"
            count={cartCount}
            onClick={onCartClick}
            invisible={cartCount === 0}
          >
            <CartIcon sx={{ fontSize: 18 }} />
          </RoundIcon>

          {user?.isAdmin && (
            <Tooltip title="Admin">
              <IconButton
                component={Link}
                to="/admin"
                aria-label="Admin"
                sx={roundBtnSx}
                color={currentPath?.startsWith('/admin') ? 'secondary' : 'default'}
              >
                <DashboardIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggle} aria-label="Toggle theme" sx={roundBtnSx}>
              {mode === 'dark' ? (
                <LightIcon sx={{ fontSize: 18 }} />
              ) : (
                <DarkIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <Tooltip title={user.name}>
                <IconButton
                  onClick={(e) => setAnchor(e.currentTarget)}
                  aria-label="Account menu"
                  sx={{ ...roundBtnSx, ml: 0.25 }}
                  disabled={logoutState.isLoading}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: '#E8795A',
                      color: '#1C1C1A',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {getInitials(user.name)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{ paper: { sx: { minWidth: 240, mt: 0.75, borderRadius: 2 } } }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {user.name}
                    </Typography>
                    {user.isAdmin && (
                      <Chip
                        label="Admin"
                        size="small"
                        color="secondary"
                        icon={<AdminIcon sx={{ fontSize: 14 }} />}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { setAnchor(null); navigate('/profile'); }}>
                  <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { setAnchor(null); navigate('/orders'); }}>
                  <ListItemIcon><CartIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>My orders</ListItemText>
                </MenuItem>
                {user.isAdmin && (
                  <MenuItem onClick={() => { setAnchor(null); navigate('/admin'); }}>
                    <ListItemIcon><AdminIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Admin dashboard</ListItemText>
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout} disabled={logoutState.isLoading}>
                  <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>
                    {logoutState.isLoading ? 'Logging out' : 'Logout'}
                  </ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Tooltip title="Sign in">
              <IconButton component={Link} to="/login" aria-label="Sign in" sx={roundBtnSx}>
                <PersonIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
