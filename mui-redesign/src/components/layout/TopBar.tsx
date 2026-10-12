import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  DesignServices as DesignIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useCurrentUser } from '../../features/auth/hooks';
import { useLogoutMutation } from '../../features/auth/authApi';
import { useToast } from '../../hooks/useToast';

interface Props {
  onMenuClick: () => void;
  showMenuButton: boolean;
  currentPath?: string;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const TopBar = ({ onMenuClick, showMenuButton, currentPath }: Props) => {
  const { mode, toggle } = useAppTheme();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useCurrentUser();
  const [logoutMutate, logoutState] = useLogoutMutation();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

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
      position="fixed"
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {showMenuButton && (
          <IconButton onClick={onMenuClick} edge="start" aria-label="Open drawer">
            <MenuIcon />
          </IconButton>
        )}

        {/* Brand */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '1.125rem',
            mr: 2,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'grid',
              placeItems: 'center',
              fontSize: '0.875rem',
            }}
          >
            P
          </Box>
          ProShop
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Search */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            bgcolor: 'action.hover',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            width: 280,
            gap: 1,
          }}
        >
          <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <InputBase
            placeholder="Search products..."
            sx={{ flex: 1, fontSize: '0.875rem' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) navigate(`/search/${encodeURIComponent(value)}`);
              }
            }}
          />
        </Box>

        {/* Design system quick link */}
        <Tooltip title="Design System">
          <IconButton
            component={Link}
            to="/design-system"
            sx={{ ml: 1 }}
            color={currentPath === '/design-system' ? 'primary' : 'default'}
          >
            <DesignIcon />
          </IconButton>
        </Tooltip>

        {/* Theme toggle */}
        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton onClick={toggle}>
            {mode === 'dark' ? <LightIcon /> : <DarkIcon />}
          </IconButton>
        </Tooltip>

        {/* User menu */}
        {user ? (
          <>
            <Tooltip title={user.name}>
              <IconButton
                onClick={(e) => setAnchor(e.currentTarget)}
                sx={{ ml: 1 }}
                disabled={logoutState.isLoading}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main',
                    fontSize: 14,
                    fontWeight: 600,
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
              slotProps={{ paper: { sx: { minWidth: 220, mt: 0.5 } } }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  {user.isAdmin && (
                    <Chip
                      label="Admin"
                      size="small"
                      color="primary"
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
              <MenuItem
                onClick={() => {
                  setAnchor(null);
                  navigate('/profile');
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              {user.isAdmin && (
                <MenuItem
                  onClick={() => {
                    setAnchor(null);
                    navigate('/admin');
                  }}
                >
                  <ListItemIcon>
                    <AdminIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Admin dashboard</ListItemText>
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  setAnchor(null);
                  navigate('/design-system');
                }}
              >
                <ListItemIcon>
                  <DesignIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Design System</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} disabled={logoutState.isLoading}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  {logoutState.isLoading ? 'Logging out…' : 'Logout'}
                </ListItemText>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Tooltip title="Sign in">
            <IconButton component={Link} to="/login" sx={{ ml: 1 }}>
              <PersonIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
};
