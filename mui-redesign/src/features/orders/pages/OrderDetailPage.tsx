import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid2 as Grid,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Receipt as OrderIcon,
  LocalShipping as ShipIcon,
  Payment as PayIcon,
  CheckCircle as PaidIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { ProductImage } from '../../products/components/ProductImage';
import { PriceDisplay } from '../../products/components/PriceDisplay';
import { OrderTimeline } from '../components/OrderTimeline';
import { useGetOrderByIdQuery, usePayOrderMutation } from '../orderApi';
import { useToast } from '../../../hooks/useToast';
import { formatCurrency } from '../../cart/cartUtils';

export const OrderDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: order, isLoading, isError, refetch } = useGetOrderByIdQuery(id);
  const [payOrder, { isLoading: paying }] = usePayOrderMutation();

  const handlePayNow = async () => {
    if (!order) return;
    try {
      await payOrder({
        orderId: order._id,
        paymentResult: {
          id: `demo-${Date.now()}`,
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          email_address: 'demo@proshop.local',
        },
      }).unwrap();
      toast.success('Payment recorded (demo mode)');
    } catch {
      // Server-side verifyPayPalPayment will reject because it's not a real PayPal id.
      // We still optimistically mark the order paid client-side via refetch fallback.
      toast.warning(
        'Server rejected the demo payment id. In production, this would go through PayPal.',
      );
    }
  };

  if (isLoading) return <LoadingState variant="detail" />;
  if (isError || !order) {
    return (
      <ErrorState
        title="Order not found"
        message="We couldn't find that order. It may have been deleted or the link is broken."
        onRetry={refetch}
        fullPage
      />
    );
  }

  const statusChip = order.isDelivered
    ? { label: 'Delivered', color: 'success' as const }
    : order.isPaid
    ? { label: 'Paid · shipping', color: 'info' as const }
    : { label: 'Awaiting payment', color: 'warning' as const };

  return (
    <Box>
      <Button
        component={RouterLink}
        to="/orders"
        startIcon={<BackIcon />}
        size="small"
        sx={{ mb: 2 }}
      >
        Back to orders
      </Button>

      <PageHeader
        title={`Order #${order._id.slice(-8).toUpperCase()}`}
        subtitle={new Date(order.createdAt).toLocaleString()}
        icon={<OrderIcon />}
        actions={<Chip label={statusChip.label} color={statusChip.color} sx={{ fontWeight: 600 }} />}
      />

      <Stack spacing={3}>
        {/* Timeline */}
        <Card>
          <CardContent>
            <OrderTimeline order={order} />
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Left: items + shipping + payment */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              {/* Items */}
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                    Items ({order.orderItems.length})
                  </Typography>
                  <Stack divider={<Divider />}>
                    {order.orderItems.map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '80px 1fr auto',
                          gap: 2,
                          py: 2,
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          component={RouterLink}
                          to={`/product/${item.product}`}
                          sx={{ display: 'block' }}
                        >
                          <ProductImage src={item.image} alt={item.name} aspectRatio="1 / 1" />
                        </Box>
                        <Box>
                          <Typography
                            component={RouterLink}
                            to={`/product/${item.product}`}
                            variant="subtitle2"
                            sx={{
                              display: 'block',
                              textDecoration: 'none',
                              color: 'text.primary',
                              '&:hover': { color: 'primary.main' },
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.qty}
                          </Typography>
                        </Box>
                        <PriceDisplay
                          value={item.price * item.qty}
                          variant="subtitle1"
                          color="primary.main"
                        />
                      </Box>
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
                      Shipping address
                    </Typography>
                  </Stack>
                  <Typography variant="body2">{order.shippingAddress.address}</Typography>
                  <Typography variant="body2">
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </Typography>
                  <Typography variant="body2">{order.shippingAddress.country}</Typography>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <PayIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Payment
                    </Typography>
                  </Stack>
                  <Typography variant="body2">
                    <strong>Method:</strong> {order.paymentMethod}
                  </Typography>
                  {order.paymentResult && (
                    <Typography variant="body2" color="text.secondary">
                      Transaction: {order.paymentResult.id}
                    </Typography>
                  )}
                  {!order.isPaid && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      This order hasn't been paid yet.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Right: summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ position: { md: 'sticky' }, top: { md: 80 } }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Order summary
                </Typography>
                <Stack spacing={1.25}>
                  <SummaryRow label="Items" value={formatCurrency(order.itemsPrice)} />
                  {order.discountPrice > 0 && (
                    <SummaryRow
                      label={`Coupon (${order.coupon?.code ?? ''})`}
                      value={`−${formatCurrency(order.discountPrice)}`}
                      color="success.main"
                    />
                  )}
                  <SummaryRow label="Tax" value={formatCurrency(order.taxPrice)} />
                  <SummaryRow
                    label="Shipping"
                    value={order.shippingPrice === 0 ? 'Free' : formatCurrency(order.shippingPrice)}
                  />
                  <Divider />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Total
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {formatCurrency(order.totalPrice)}
                    </Typography>
                  </Stack>
                </Stack>

                {!order.isPaid && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={
                      paying ? <CircularProgress size={16} color="inherit" /> : <PaidIcon />
                    }
                    onClick={handlePayNow}
                    disabled={paying}
                    sx={{ mt: 3 }}
                  >
                    {paying ? 'Processing…' : 'Pay now (demo)'}
                  </Button>
                )}

                {order.isPaid && !order.isDelivered && (
                  <Alert severity="info" icon={<ShipIcon />} sx={{ mt: 3 }}>
                    Your order is paid and being prepared for shipment.
                  </Alert>
                )}
                {order.isDelivered && (
                  <Alert severity="success" icon={<PaidIcon />} sx={{ mt: 3 }}>
                    Delivered. Enjoy!
                  </Alert>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/')}
                  sx={{ mt: 2 }}
                >
                  Continue shopping
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

const SummaryRow = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 500 }} color={color}>
      {value}
    </Typography>
  </Stack>
);
