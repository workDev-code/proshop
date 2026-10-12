import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  IconButton,
  Stack,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { Close as CloseIcon, ArrowForward as ArrowIcon, RemoveShoppingCart as EmptyIcon } from '@mui/icons-material';
import { useCart } from '../../features/cart/hooks';
import { CartItemRow } from '../../features/cart/components/CartItemRow';
import { CartSummary } from '../../features/cart/components/CartSummary';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Cart drawer (slide-in from the right).
 *
 * Mirrors the prototype's cart drawer: 420px panel on desktop, full
 * width on mobile, scrim overlay, Escape to close.
 *
 * Business logic (Redux cartSlice) is untouched — this is a presentational
 * shell that reuses CartItemRow + CartSummary.
 */
export const CartDrawer = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const { items, totals, coupon, isEmpty, updateItemQty, removeItem, unsetCoupon } = useCart();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 420 },
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.5px',
          }}
        >
          Your bag
          <Typography component="span" sx={{ ml: 1, fontSize: 13, color: 'text.secondary', fontWeight: 500 }}>
            ({totals.itemsCount})
          </Typography>
        </Typography>
        <IconButton onClick={onClose} aria-label="Close cart">
          <CloseIcon />
        </IconButton>
      </Stack>

      {/* Items */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}>
        {isEmpty ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <EmptyIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
            <Typography sx={{ color: 'text.secondary', fontSize: 13, lineHeight: 1.7 }}>
              Your bag is taking a little break.
              <br />
              Find something you love and bring it along.
            </Typography>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              onClick={onClose}
              sx={{ mt: 3, borderRadius: 999 }}
            >
              Continue shopping
            </Button>
          </Box>
        ) : (
          <Stack divider={<Divider />}>
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onQtyChange={updateItemQty}
                onRemove={removeItem}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* Footer summary */}
      {!isEmpty && (
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 3 }}>
          <CartSummary
            totals={totals}
            coupon={coupon}
            onClearCoupon={unsetCoupon}
            checkoutLabel="Checkout"
            onCheckout={() => {
              onClose();
              navigate('/checkout');
            }}
            compact
          />
          <Button
            component={RouterLink}
            to="/cart"
            onClick={onClose}
            fullWidth
            endIcon={<ArrowIcon />}
            sx={{ mt: 1.5, borderRadius: 999 }}
          >
            View full cart
          </Button>
        </Box>
      )}
    </Drawer>
  );
};
