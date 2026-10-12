import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  LocalShipping as ShipIcon,
  Payment as PayIcon,
  CheckCircle as PaidIcon,
  Inventory2 as ItemsIcon,
  Home as AddressIcon,
} from '@mui/icons-material';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { StatusPill, type PillTone } from '../../../components/feedback/StatusPill';
import { ProductImage } from '../../products/components/ProductImage';
import { PriceDisplay } from '../../products/components/PriceDisplay';
import { OrderTimeline } from '../components/OrderTimeline';
import { useGetOrderByIdQuery, usePayOrderMutation } from '../orderApi';
import { useCurrentUser } from '../../auth/hooks';
import { useToast } from '../../../hooks/useToast';
import { fmtDateTime } from '../../../utils/fmt';
import { formatCurrency } from '../../cart/cartUtils';
import type { Order } from '../types';

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';

const orderStatus = (order: Order): OrderStatus => {
  if (order.isDelivered) return 'delivered';
  if (order.isPaid) return 'shipped';
  return 'pending';
};

const STATUS_TONE: Record<OrderStatus, PillTone> = {
  pending: 'warning',
  paid: 'success',
  shipped: 'info',
  delivered: 'success',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Awaiting payment',
  paid: 'Paid',
  shipped: 'Paid · shipping',
  delivered: 'Delivered',
};

/**
 * Single order detail page.
 *
 * Layout:
 *   [editorial header — kicker "Order #…" + h1 "Order details"]
 *   [Order timeline card]
 *   [2-col: left = items + shipping + payment; right = summary panel]
 */
export const OrderDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useCurrentUser();
  const isAdmin = !!user?.isAdmin;

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
      toast.warning(
        'Server rejected the demo payment id. In production, this would go through PayPal.',
      );
    }
  };

  if (isLoading) return <LoadingState variant="detail" />;
  if (isError || !order) {
    return (
      <Box sx={{ pt: { xs: 2, md: 3.5 } }}>
        <Button
          component={RouterLink}
          to="/orders"
          startIcon={<BackIcon sx={{ fontSize: 16 }} />}
          sx={{
            mb: 2,
            borderRadius: 999,
            borderColor: 'divider',
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 12,
            px: 2,
            py: 0.875,
          }}
          variant="outlined"
          size="small"
        >
          Back to orders
        </Button>
        <ErrorState
          title="Order not found"
          message="We couldn't find that order. It may have been deleted or the link is broken."
          onRetry={refetch}
          fullPage
        />
      </Box>
    );
  }

  const status = orderStatus(order);
  const shortId = order._id.slice(-8).toUpperCase();
  const itemsCount = order.orderItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <Box sx={{ pt: { xs: 2, md: 3.5 } }}>
      {/* Back link */}
      <Button
        component={RouterLink}
        to="/orders"
        startIcon={<BackIcon sx={{ fontSize: 16 }} />}
        sx={{
          mb: 2,
          borderRadius: 999,
          color: 'text.secondary',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 12,
          px: 0.5,
          '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
        }}
        size="small"
      >
        Back to orders
      </Button>

      {/* Editorial header */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'flex-end' }}
        spacing={2}
        sx={{ mb: { xs: 3, md: 4.5 } }}
      >
        <Box>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.25,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'secondary.main',
              mb: 1.25,
            }}
          >
            <Box sx={{ width: 24, height: 1, bgcolor: 'currentColor' }} />
            Order #{shortId}
          </Box>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.75rem, 3vw, 2.375rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              color: 'text.primary',
              m: 0,
            }}
          >
            Order details
          </Typography>
          <Typography sx={{ mt: 1.25, fontSize: 13, color: 'text.secondary' }}>
            Placed {fmtDateTime(order.createdAt)} · {itemsCount}{' '}
            {itemsCount === 1 ? 'item' : 'items'}
          </Typography>
        </Box>
        <StatusPill label={STATUS_LABEL[status]} tone={STATUS_TONE[status]} />
      </Stack>

      {/* Timeline */}
      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid rgba(32,33,31,0.08)',
          boxShadow: 'none',
          mb: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <OrderTimeline order={order} />
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.7fr) minmax(0, 1fr)' },
          gap: { xs: 2.5, md: 3 },
          alignItems: 'flex-start',
        }}
      >
        {/* LEFT — items + shipping + payment */}
        <Stack spacing={2.5}>
          {/* Items */}
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(32,33,31,0.08)',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <SectionHeader
                icon={<ItemsIcon sx={{ fontSize: 18 }} />}
                title="Items"
                hint={`${order.orderItems.length} ${order.orderItems.length === 1 ? 'product' : 'products'}`}
              />
              <Box sx={{ mt: 2 }}>
                <Stack divider={<Divider sx={{ my: 1 }} />}>
                  {order.orderItems.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '72px 1fr auto',
                        gap: 2,
                        py: 1.5,
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        component={RouterLink}
                        to={`/product/${item.product}`}
                        sx={{
                          display: 'block',
                          width: 72,
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '1px solid rgba(32,33,31,0.08)',
                        }}
                      >
                        <ProductImage src={item.image} alt={item.name} aspectRatio="1 / 1" />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          component={RouterLink}
                          to={`/product/${item.product}`}
                          sx={{
                            display: 'block',
                            textDecoration: 'none',
                            color: 'text.primary',
                            fontSize: 13,
                            fontWeight: 600,
                            lineHeight: 1.4,
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            '&:hover': { color: 'secondary.main' },
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Qty {item.qty} · {formatCurrency(item.price)} ea.
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <PriceDisplay
                          value={item.price * item.qty}
                          variant="body2"
                          sx={{ fontSize: 14, fontWeight: 700 }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {/* Shipping + Payment (side by side on sm+) */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              gap: 2.5,
            }}
          >
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(32,33,31,0.08)',
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <SectionHeader
                  icon={<AddressIcon sx={{ fontSize: 18 }} />}
                  title="Shipping address"
                />
                <Box sx={{ mt: 2, color: 'text.primary', fontSize: 13, lineHeight: 1.6 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                    {order.shippingAddress.address}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                    {order.shippingAddress.country}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(32,33,31,0.08)',
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <SectionHeader
                  icon={<PayIcon sx={{ fontSize: 18 }} />}
                  title="Payment"
                />
                <Box sx={{ mt: 2, fontSize: 13, lineHeight: 1.6 }}>
                  <Typography sx={{ fontSize: 13, color: 'text.primary' }}>
                    <Box component="span" sx={{ color: 'text.secondary' }}>
                      Method:
                    </Box>{' '}
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {order.paymentMethod}
                    </Box>
                  </Typography>
                  {order.paymentResult && (
                    <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>
                      Transaction: {order.paymentResult.id}
                    </Typography>
                  )}
                  {!order.isPaid && (
                    <Alert
                      severity="warning"
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        fontSize: 12,
                        py: 0.5,
                      }}
                    >
                      This order hasn't been paid yet.
                    </Alert>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Admin actions */}
          {isAdmin && (
            <Card
              sx={{
                borderRadius: 3,
                border: '1px dashed',
                borderColor: 'divider',
                bgcolor: 'rgba(217, 93, 57, 0.04)',
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'secondary.main',
                    mb: 1.5,
                  }}
                >
                  Admin actions
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  {!order.isPaid && (
                    <AdminAction
                      icon={<PaidIcon sx={{ fontSize: 16 }} />}
                      label={paying ? 'Marking…' : 'Mark as paid'}
                      onClick={handlePayNow}
                      disabled={paying}
                    />
                  )}
                  {order.isPaid && !order.isDelivered && (
                    <AdminAction
                      icon={<ShipIcon sx={{ fontSize: 16 }} />}
                      label="Mark as delivered"
                      onClick={() => toast.info('Mark-delivered endpoint not yet wired')}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>

        {/* RIGHT — summary */}
        <Box sx={{ position: { md: 'sticky' }, top: { md: 96 } }}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(32,33,31,0.08)',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Typography
                component="h2"
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 800,
                  fontSize: 16,
                  color: 'text.primary',
                  mb: 2,
                }}
              >
                Order summary
              </Typography>

              <Stack spacing={1.25}>
                <SummaryRow label="Items" value={formatCurrency(order.itemsPrice)} />
                {order.discountPrice > 0 && (
                  <SummaryRow
                    label={`Coupon${order.coupon?.code ? ` (${order.coupon.code})` : ''}`}
                    value={`−${formatCurrency(order.discountPrice)}`}
                    color="success.main"
                  />
                )}
                <SummaryRow label="Tax" value={formatCurrency(order.taxPrice)} />
                <SummaryRow
                  label="Shipping"
                  value={order.shippingPrice === 0 ? 'Free' : formatCurrency(order.shippingPrice)}
                />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 700,
                    fontSize: 14,
                    color: 'text.primary',
                  }}
                >
                  Total
                </Typography>
                <PriceDisplay
                  value={order.totalPrice}
                  variant="h6"
                  sx={{ fontSize: 22, fontWeight: 800, color: 'text.primary' }}
                />
              </Stack>

              {!order.isPaid && (
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={
                    paying ? <CircularProgress size={16} color="inherit" /> : <PaidIcon />
                  }
                  onClick={handlePayNow}
                  disabled={paying}
                  sx={{
                    mt: 3,
                    borderRadius: 999,
                    px: 2.75,
                    py: 1.5,
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  {paying ? 'Processing…' : 'Pay now (demo)'}
                </Button>
              )}

              {order.isPaid && !order.isDelivered && (
                <Alert
                  severity="info"
                  icon={<ShipIcon sx={{ fontSize: 18 }} />}
                  sx={{ mt: 3, borderRadius: 2, fontSize: 12 }}
                >
                  Paid and being prepared for shipment.
                </Alert>
              )}
              {order.isDelivered && (
                <Alert
                  severity="success"
                  icon={<PaidIcon sx={{ fontSize: 18 }} />}
                  sx={{ mt: 3, borderRadius: 2, fontSize: 12 }}
                >
                  Delivered. Enjoy!
                </Alert>
              )}

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{
                  mt: 2,
                  borderRadius: 999,
                  borderColor: 'divider',
                  color: 'text.primary',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 12,
                  py: 1.125,
                  '&:hover': {
                    borderColor: 'text.primary',
                    bgcolor: 'transparent',
                  },
                }}
              >
                Continue shopping
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

const SectionHeader = ({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
}) => (
  <Stack direction="row" alignItems="center" spacing={1.25}>
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: '1px solid',
        borderColor: 'divider',
        display: 'grid',
        placeItems: 'center',
        color: 'secondary.main',
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        fontFamily: '"Manrope", sans-serif',
        fontWeight: 800,
        fontSize: 14,
        color: 'text.primary',
      }}
    >
      {title}
    </Typography>
    {hint && (
      <Typography sx={{ fontSize: 12, color: 'text.secondary', ml: 'auto' }}>
        {hint}
      </Typography>
    )}
  </Stack>
);

const AdminAction = ({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <Button
    variant="contained"
    color="secondary"
    size="medium"
    startIcon={icon}
    onClick={onClick}
    disabled={disabled}
    sx={{
      borderRadius: 999,
      px: 2.25,
      py: 1.125,
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'none',
    }}
  >
    {label}
  </Button>
);

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
    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{label}</Typography>
    <Typography
      sx={{
        fontSize: 13,
        fontWeight: 600,
        color: color ?? 'text.primary',
      }}
    >
      {value}
    </Typography>
  </Stack>
);
