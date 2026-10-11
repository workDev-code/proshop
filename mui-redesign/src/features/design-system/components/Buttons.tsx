import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  ButtonGroup,
  CircularProgress,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';

const VARIANTS = [
  'contained', 'outlined', 'text',
] as const;

const COLORS = [
  'primary', 'secondary', 'success', 'warning', 'error', 'info',
] as const;

export const Buttons = () => (
  <>
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
      {VARIANTS.map((variant) =>
        COLORS.map((color) => (
          <Button
            key={`${variant}-${color}`}
            variant={variant}
            color={color}
          >
            {variant} · {color}
          </Button>
        ))
      )}
    </Stack>

    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
      <Button variant="contained" size="small">Small</Button>
      <Button variant="contained">Medium (default)</Button>
      <Button variant="contained" size="large">Large</Button>
      <Box sx={{ width: 16 }} />
      <Button variant="contained" disabled>Disabled</Button>
      <Button
        variant="contained"
        startIcon={<CircularProgress size={16} color="inherit" />}
      >
        Loading…
      </Button>
    </Stack>

    <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
      <Button variant="contained" startIcon={<CartIcon />}>Add to cart</Button>
      <Button variant="outlined" color="error" startIcon={<FavoriteIcon />}>
        Wishlist
      </Button>
      <Button variant="text" color="error" startIcon={<DeleteIcon />}>
        Remove
      </Button>
    </Stack>

    <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
      <ButtonGroup variant="outlined">
        <Button>1</Button>
        <Button>2</Button>
        <Button>3</Button>
      </ButtonGroup>
      <ButtonGroup variant="contained">
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </ButtonGroup>
    </Stack>

    <Box>
      <ToggleButtonGroup value={['left']} exclusive>
        <ToggleButton value="left">Left</ToggleButton>
        <ToggleButton value="center">Center</ToggleButton>
        <ToggleButton value="right">Right</ToggleButton>
      </ToggleButtonGroup>
    </Box>

    <Stack direction="row" spacing={1} sx={{ mt: 4 }}>
      <IconButton color="primary"><FavoriteIcon /></IconButton>
      <IconButton color="secondary"><CartIcon /></IconButton>
    </Stack>
  </>
);
