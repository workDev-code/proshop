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
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  LightMode as LightIcon,
  DarkMode as DarkIcon,
  Palette as PaletteIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  DesignServices as DesignIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAppTheme } from '../../theme/ThemeProvider';

interface Props {
  onMenuClick: () => void;
  showMenuButton: boolean;
  currentPath?: string;
}

export const TopBar = ({ onMenuClick, showMenuButton }: Props) => {
  const { mode, toggle } = useAppTheme();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchor);

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
                const value = (e.target as HTMLInputElement).value;
                navigate(`/search/${encodeURIComponent(value)}`);
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
            color={location?.pathname === '/design-system' ? 'primary' : 'default'}
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

        {/* User menu (placeholder) */}
        <Tooltip title="Account">
          <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
              JD
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchor}
          open={open}
          onClose={() => setAnchor(null)}
          onClick={() => setAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5, minWidth: 200 }}>
            <Typography variant="subtitle2">John Doe</Typography>
            <Typography variant="caption" color="text.secondary">
              john@email.com
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => navigate('/profile')}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => navigate('/design-system')}>
            <ListItemIcon><PaletteIcon fontSize="small" /></ListItemIcon>
            Design System
          </MenuItem>
          <Divider />
          <MenuItem>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Hidden theme hook reference to silence linter */}
        <span style={{ display: 'none' }}>{mode === 'dark' && 'd'}</span>
      </Toolbar>
    </AppBar>
  );
};
