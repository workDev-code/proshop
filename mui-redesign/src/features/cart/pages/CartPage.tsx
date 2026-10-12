import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Grid2 as Grid,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  ArrowForward as ArrowIcon,
  RemoveShoppingCart as EmptyIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { CartItemRow } from '../components/CartItemRow';
import { CartSummary } from '../components/CartSummary';
import { useCart } from '../hooks';
import { useToast } from '../../../hooks/useToast';

export const CartPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    items,
    totals,
    coupon,
    isEmpty,
    updateItemQty,
    removeItem,
    unsetCoupon,
  } = useCart();

  const handleRemove = (productId: string) => {
    removeItem(productId);
    toast.info('Item removed from cart');
  };

  if (isEmpty) {
    return (
      <Box>
        <PageHeader title="Shopping Cart" icon={<CartIcon />} />
        <Card>
          <CardContent sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center' }}>
              <EmptyIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Your cart is empty
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Looks like you haven't added anything yet. Let's fix that.
              </Typography>
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
                size="large"
                endIcon={<ArrowIcon />}
              >
                Browse products
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Shopping Cart"
        subtitle={`${totals.itemsCount} ${totals.itemsCount === 1 ? 'item' : 'items'}`}
        icon={<CartIcon />}
        actions={
          <Button
            component={RouterLink}
            to="/"
            variant="outlined"
            size="small"
          >
            Continue shopping
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
                {items.map((item) => (
                  <CartItemRow
                    key={item.productId}
                    item={item}
                    onQtyChange={updateItemQty}
                    onRemove={handleRemove}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CartSummary
            totals={totals}
            coupon={coupon}
            onClearCoupon={unsetCoupon}
            checkoutLabel="Proceed to checkout"
            onCheckout={() => navigate('/checkout')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
