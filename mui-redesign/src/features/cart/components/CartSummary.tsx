import { Card, CardContent, Stack, Typography, Divider, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalOffer as CouponIcon } from '@mui/icons-material';
import { formatCurrency } from '../cartUtils';
import type { CartTotals, CartCoupon } from '../types';

interface Props {
  totals: CartTotals;
  coupon: CartCoupon | null;
  onClearCoupon?: () => void;
  checkoutLabel?: string;
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
  disabled?: boolean;
}

/**
 * Order summary card. Used in cart page and checkout.
 * Shows items, discount, tax, shipping, total + optional checkout button.
 */
export const CartSummary = ({
  totals,
  coupon,
  onClearCoupon,
  checkoutLabel = 'Proceed to checkout',
  onCheckout,
  showCheckoutButton = true,
  disabled,
}: Props) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (onCheckout) onCheckout();
    else navigate('/checkout');
  };

  return (
    <Card sx={{ position: { md: 'sticky' }, top: { md: 80 } }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Order summary
        </Typography>

        <Stack spacing={1.25}>
          <Row label={`Items (${totals.itemsCount})`} value={formatCurrency(totals.itemsPrice)} />

          {coupon && (
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'success.main' }}>
                <CouponIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Coupon ({coupon.code})
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                  −{formatCurrency(coupon.discount)}
                </Typography>
                {onClearCoupon && (
                  <Button size="small" onClick={onClearCoupon} sx={{ minWidth: 0, p: 0.5 }}>
                    Remove
                  </Button>
                )}
              </Stack>
            </Stack>
          )}

          <Row label="Discounted subtotal" value={formatCurrency(totals.discountedItemsPrice)} />

          <Row label="Tax (15%)" value={formatCurrency(totals.taxPrice)} />

          <Row
            label="Shipping"
            value={totals.shippingPrice === 0 ? 'Free' : formatCurrency(totals.shippingPrice)}
            valueColor={totals.shippingPrice === 0 ? 'success.main' : undefined}
          />

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Total
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {formatCurrency(totals.totalPrice)}
            </Typography>
          </Stack>

          {totals.discountedItemsPrice < 100 && totals.discountedItemsPrice > 0 && (
            <Box
              sx={{
                bgcolor: 'info.lighter',
                color: 'info.main',
                p: 1,
                borderRadius: 1,
                fontSize: '0.75rem',
                textAlign: 'center',
              }}
            >
              Add {formatCurrency(100 - totals.discountedItemsPrice)} more for FREE shipping 🚚
            </Box>
          )}

          {showCheckoutButton && (
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              disabled={disabled || totals.itemsCount === 0}
              sx={{ mt: 2 }}
            >
              {checkoutLabel}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const Row = ({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 500 }} color={valueColor}>
      {value}
    </Typography>
  </Stack>
);
