import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Skeleton,
} from '@mui/material';
import {
  ShoppingBag as BagIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { StatusPill, type PillTone } from '../../../components/feedback/StatusPill';
import { PriceDisplay } from '../../products/components/PriceDisplay';
import { useGetMyOrdersQuery } from '../orderApi';
import { fmtDate } from '../../../utils/fmt';
import type { Order } from '../types';

/**
 * Purchase history — flat list of order rows.
 *
 * Each row is a Card with:
 *   - Order # + date
 *   - Items count
 *   - Total (PriceDisplay)
 *   - StatusPill (success/warning/info)
 *   - "View" pill button
 *
 * Status tone mapping (matches the order lifecycle):
 *   delivered  → success
 *   paid+shipped → info
 *   paid (not shipped) → success (paid)
 *   unpaid     → warning (pending)
 */
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
  pending: 'Pending payment',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export const OrdersListPage = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useGetMyOrdersQuery();

  return (
    <Box sx={{ pt: { xs: 2, md: 3.5 } }}>
      {/* Editorial header */}
      <Box sx={{ mb: { xs: 3, md: 4.5 } }}>
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
          Purchase history
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
          My orders
        </Typography>
        {orders && orders.length > 0 && (
          <Typography sx={{ mt: 1.25, fontSize: 13, color: 'text.secondary' }}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} on file
          </Typography>
        )}
      </Box>

      {/* Body */}
      {isLoading ? (
        <Stack spacing={1.5}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={104}
              sx={{ borderRadius: 3 }}
            />
          ))}
        </Stack>
      ) : !orders || orders.length === 0 ? (
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid rgba(32,33,31,0.08)',
            bgcolor: 'background.paper',
            py: { xs: 6, sm: 8 },
          }}
        >
          <EmptyState
            icon={<BagIcon sx={{ fontSize: 28 }} />}
            title="No orders yet"
            description="When you place an order, it will appear here with live status updates."
            action={{
              label: 'Start shopping',
              onClick: () => navigate('/'),
              icon: <ArrowIcon sx={{ fontSize: 16 }} />,
            }}
          />
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {orders.map((o) => {
            const status = orderStatus(o);
            const itemsCount = o.orderItems.reduce((sum, i) => sum + i.qty, 0);

            return (
              <Card
                key={o._id}
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(32,33,31,0.08)',
                  boxShadow: 'none',
                  transition: 'border-color 200ms ease, transform 200ms ease',
                  '&:hover': {
                    borderColor: 'rgba(32,33,31,0.18)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr auto',
                        sm: '1.4fr 1fr 0.8fr 0.9fr auto',
                      },
                      columnGap: 3,
                      rowGap: 2,
                      alignItems: 'center',
                    }}
                  >
                    {/* Order id + date */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Order
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          fontSize: 13,
                          color: 'text.primary',
                          mt: 0.5,
                        }}
                      >
                        #{o._id.slice(-8).toUpperCase()}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', fontSize: 11, mt: 0.25, display: 'block' }}
                      >
                        {fmtDate(o.createdAt)}
                      </Typography>
                    </Box>

                    {/* Items */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Items
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: 'text.primary', mt: 0.5 }}>
                        {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                      </Typography>
                    </Box>

                    {/* Total */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Total
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <PriceDisplay
                          value={o.totalPrice}
                          variant="body2"
                          sx={{ fontSize: 14, fontWeight: 700 }}
                        />
                      </Box>
                    </Box>

                    {/* Status */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Status
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <StatusPill label={STATUS_LABEL[status]} tone={STATUS_TONE[status]} />
                      </Box>
                    </Box>

                    {/* View button + status on mobile */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-end', sm: 'center' },
                        justifyContent: 'flex-end',
                        gap: 1.5,
                        gridColumn: { xs: '1 / -1', sm: 'auto' },
                      }}
                    >
                      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        <StatusPill label={STATUS_LABEL[status]} tone={STATUS_TONE[status]} />
                      </Box>
                      <Button
                        component={RouterLink}
                        to={`/orders/${o._id}`}
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          borderRadius: 999,
                          borderColor: 'divider',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: 12,
                          px: 2,
                          py: 0.875,
                          color: 'text.primary',
                          '&:hover': {
                            borderColor: 'text.primary',
                            bgcolor: 'transparent',
                          },
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};
