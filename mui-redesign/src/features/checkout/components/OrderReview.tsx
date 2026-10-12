import { Box, Stack, Typography, Card, CardContent, Divider, Grid2 as Grid, Button, Alert, CircularProgress } from '@mui/material';
import { CheckCircle as CheckIcon, LocalShipping as ShipIcon, Payment as PayIcon } from '@mui/icons-material';
import { CartItemRow } from '../../cart/components/CartItemRow';
import { CartSummary } from '../../cart/components/CartSummary';
import { CouponInput } from './CouponInput';
import { useCart } from '../../cart/hooks';
import { useCreateOrderMutation } from '../../orders/orderApi';
import { useToast } from '../../../hooks/useToast';
import { useNavigate } from 'react-router-dom';


interface Props {
  onBack: () => void;
}

export const OrderReview = ({ onBack }: Props) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { items, totals, coupon, shippingAddress, paymentMethod, updateItemQty, removeItem, unsetCoupon, clear } =
    useCart();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !paymentMethod || items.length === 0) return;

    try {
      const order = await createOrder({
        orderItems: items.map((i) => ({
          _id: i.productId,
          name: i.name,
          qty: i.qty,
          image: i.image,
          price: i.price,
          countInStock: i.countInStock,
          brand: i.brand,
        })),
        shippingAddress,
        paymentMethod,
        couponCode: coupon?.code,
      }).unwrap();

      toast.success('Order placed successfully!');
      clear();
      navigate(`/orders/${order._id}`);
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Failed to place order. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Review your order
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            {/* Items */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  Items ({totals.itemsCount})
                </Typography>
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
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <ShipIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Shipping to
                  </Typography>
                </Stack>
                {shippingAddress ? (
                  <Box sx={{ color: 'text.secondary' }}>
                    <Typography variant="body2">
                      {shippingAddress.address}
                    </Typography>
                    <Typography variant="body2">
                      {shippingAddress.city}, {shippingAddress.postalCode}
                    </Typography>
                    <Typography variant="body2">{shippingAddress.country}</Typography>
                  </Box>
                ) : (
                  <Alert severity="warning">No shipping address set.</Alert>
                )}
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <PayIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Payment method
                  </Typography>
                </Stack>
                {paymentMethod ? (
                  <Typography variant="body2" color="text.secondary">
                    {paymentMethod}
                  </Typography>
                ) : (
                  <Alert severity="warning">No payment method selected.</Alert>
                )}
              </CardContent>
            </Card>

            {/* Coupon */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  Coupon
                </Typography>
                <CouponInput disabled={items.length === 0} />
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CartSummary
            totals={totals}
            coupon={coupon}
            onClearCoupon={unsetCoupon}
            showCheckoutButton={false}
          />

          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePlaceOrder}
              disabled={isLoading || items.length === 0}
              startIcon={
                isLoading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <CheckIcon />
                )
              }
            >
              {isLoading ? 'Placing order…' : 'Place order'}
            </Button>
            <Button fullWidth variant="text" onClick={onBack} disabled={isLoading}>
              Back
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
