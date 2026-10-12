import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  TextField,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { ProductImage } from '../../products/components/ProductImage';
import { PriceDisplay } from '../../products/components/PriceDisplay';
import type { CartItem as CartItemType } from '../types';

interface Props {
  item: CartItemType;
  onQtyChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

/**
 * A single row in the cart page (and the checkout review).
 * Image | Name+brand | Qty selector | Price | Subtotal | Remove
 */
export const CartItemRow = ({ item, onQtyChange, onRemove }: Props) => {
  const { productId, name, brand, image, price, qty, countInStock } = item;
  const subtotal = price * qty;

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '80px 1fr',
            sm: '100px 1fr auto auto auto',
            md: '120px 1fr 160px 120px 40px',
          },
          gap: 2,
          alignItems: 'center',
          py: 2,
        }}
      >
        {/* Image */}
        <Box
          component={RouterLink}
          to={`/product/${productId}`}
          sx={{ display: 'block', width: { xs: 80, sm: 100, md: 120 } }}
        >
          <ProductImage src={image} alt={name} aspectRatio="1 / 1" />
        </Box>

        {/* Name + brand */}
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {brand}
          </Typography>
          <Typography
            component={RouterLink}
            to={`/product/${productId}`}
            variant="subtitle1"
            sx={{
              display: 'block',
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 600,
              mt: 0.5,
              '&:hover': { color: 'primary.main' },
            }}
          >
            {name}
          </Typography>
          <PriceDisplay value={price} variant="body2" color="text.secondary" />
        </Box>

        {/* Qty selector */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            width: 'fit-content',
            gridColumn: { xs: '1 / -1', sm: 'auto' },
          }}
        >
          <IconButton
            size="small"
            onClick={() => onQtyChange(productId, Math.max(1, qty - 1))}
            disabled={qty <= 1}
            aria-label="decrease quantity"
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <TextField
            value={qty}
            onChange={(e) => {
              const v = Number(e.target.value) || 1;
              onQtyChange(productId, Math.max(1, Math.min(v, countInStock)));
            }}
            type="number"
            size="small"
            sx={{
              width: 56,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& input': { textAlign: 'center', p: 1 },
            }}
            inputProps={{ min: 1, max: countInStock }}
          />
          <IconButton
            size="small"
            onClick={() => onQtyChange(productId, Math.min(qty + 1, countInStock))}
            disabled={qty >= countInStock}
            aria-label="increase quantity"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Subtotal (desktop) */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <PriceDisplay value={subtotal} variant="subtitle1" color="primary.main" />
        </Box>

        {/* Remove */}
        <IconButton
          onClick={() => onRemove(productId)}
          aria-label="remove from cart"
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
      <Divider />
    </>
  );
};
