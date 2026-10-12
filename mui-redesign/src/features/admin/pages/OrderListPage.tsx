// Now uses the backend's authoritative `Order.status` enum (5 values) instead
// of the old isPaid/isDelivered inference. Adds a real status filter and
// wires the new mark-shipped + mark-delivered mutations as row actions.
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  Button,
  InputBase,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  LocalShipping as DeliverIcon,
  Inventory2 as ShipIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useGetAllOrdersQuery, useMarkOrderDeliveredMutation } from '../adminApi';
import {
  useMarkOrderShippedMutation,
  useCancelOrderMutation,
} from '../../orders/orderApi';
import { StatusPill } from '../../../components/feedback/StatusPill';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { useToast } from '../../../hooks/useToast';
import { fmtDateShort, fmtMoney } from '../../../utils/fmt';
import {
  adminEmptyDescSx,
  adminEmptySx,
  adminEmptyTitleSx,
  adminFilterRowSx,
  adminH1Sx,
  adminInputSx,
  adminLinkSx,
  adminMiniCardSx,
  adminMiniGridSx,
  adminPanelDescSx,
  adminPanelH2Sx,
  adminPanelHeadSx,
  adminPanelSx,
  adminSubtitleSx,
  adminTableSx,
  adminTdFirstSx,
  adminTdSx,
  adminThSx,
  adminTitleRowSx,
} from '../components/adminStyles';
import type { PillTone } from '../../../components/feedback/StatusPill';
import type { Order, OrderStatus } from '../../orders/types';

/* ─── status → pill tone map (single source of truth) ───────────── */

const ORDER_STATUS_TONES: Record<OrderStatus, PillTone> = {
  pending: 'warning',
  paid: 'success',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

const STATUS_FILTER_OPTIONS: ReadonlyArray<{ value: 'all' | OrderStatus; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

type StatusFilter = (typeof STATUS_FILTER_OPTIONS)[number]['value'];

/**
 * Resolve the effective OrderStatus. The new backend returns `status`
 * directly, but the demo seed still only has isPaid/isDelivered, so we
 * fall back to a derived value for those legacy rows.
 */
const resolveStatus = (o: Order): OrderStatus => {
  const s = (o as { status?: string }).status as OrderStatus | undefined;
  if (s === 'pending' || s === 'paid' || s === 'shipped' || s === 'delivered' || s === 'cancelled') {
    return s;
  }
  if (o.isDelivered) return 'delivered';
  if (o.isPaid) return 'paid';
  return 'pending';
};

const orderPill = (o: Order): { label: string; tone: PillTone; status: OrderStatus } => {
  const status = resolveStatus(o);
  const labels: Record<OrderStatus, string> = {
    pending: 'Pending',
    paid: 'Paid',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return { label: labels[status], tone: ORDER_STATUS_TONES[status], status };
};

const orderCustomer = (o: Order): { name: string; email: string } =>
  o.user && typeof o.user === 'object' ? o.user : { name: 'Customer', email: '' };

const orderIdShort = (id: string) => `#PS-${id.slice(-4).toUpperCase()}`;

const matchesFilter = (o: Order, filter: StatusFilter): boolean => {
  if (filter === 'all') return true;
  return resolveStatus(o) === filter;
};

export const OrderListPage = () => {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const { data: orders, isLoading } = useGetAllOrdersQuery();
  const [markDelivered, { isLoading: markingDelivered }] = useMarkOrderDeliveredMutation();
  const [markShipped, { isLoading: markingShipped }] = useMarkOrderShippedMutation();
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();

  if (isLoading) {
    return <LoadingState variant="card" count={3} />;
  }

  const allOrders = orders ?? [];
  const awaiting = allOrders.filter((o) => {
    const s = resolveStatus(o);
    return s === 'paid' || s === 'shipped';
  }).length;

  const filtered = allOrders.filter((o) => {
    if (!matchesFilter(o, status)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const c = orderCustomer(o);
    return (
      o._id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const handleShip = async (id: string) => {
    try {
      await markShipped({ orderId: id, payload: {} }).unwrap();
      toast.success('Order marked as shipped');
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Failed to mark as shipped');
    }
  };

  const handleDeliver = async (id: string) => {
    try {
      await markDelivered(id).unwrap();
      toast.success('Order marked as delivered');
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Failed to mark as delivered');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelOrder({ orderId: id, payload: {} }).unwrap();
      toast.success('Order cancelled');
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Failed to cancel order');
    }
  };

  const anyLoading = markingDelivered || markingShipped || cancelling;

  return (
    <>
      {/* Title row */}
      <Box sx={adminTitleRowSx}>
        <Box>
          <Typography component="h1" sx={adminH1Sx}>
            Orders
          </Typography>
          <Typography sx={adminSubtitleSx}>
            Track, process, and manage customer orders.
          </Typography>
        </Box>
        <Button
          onClick={() => toast.info('Export orders preview — wire up when backend supports it.')}
          sx={{
            border: '1px solid #e1e5eb',
            bgcolor: '#fff',
            color: '#303747',
            borderRadius: '8px',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'none',
            px: 1.625,
            py: 1.125,
            '&:hover': { bgcolor: '#f7f7f9' },
          }}
        >
          ↓ Export orders
        </Button>
      </Box>

      {/* Mini cards */}
      <Box sx={adminMiniGridSx}>
        <Box sx={adminMiniCardSx}>
          <Typography sx={{ fontSize: 10, color: '#818999' }}>All orders</Typography>
          <Typography
            component="strong"
            sx={{
              display: 'block',
              fontFamily: '"Manrope", sans-serif',
              fontSize: 22,
              fontWeight: 800,
              mt: '9px',
              color: '#242b39',
            }}
          >
            {allOrders.length}
          </Typography>
        </Box>
        <Box sx={adminMiniCardSx}>
          <Typography sx={{ fontSize: 10, color: '#818999' }}>Awaiting fulfillment</Typography>
          <Typography
            component="strong"
            sx={{
              display: 'block',
              fontFamily: '"Manrope", sans-serif',
              fontSize: 22,
              fontWeight: 800,
              mt: '9px',
              color: '#242b39',
            }}
          >
            {awaiting}
          </Typography>
        </Box>
        <Box sx={adminMiniCardSx}>
          <Typography sx={{ fontSize: 10, color: '#818999' }}>Returns requested</Typography>
          <Typography
            component="strong"
            sx={{
              display: 'block',
              fontFamily: '"Manrope", sans-serif',
              fontSize: 22,
              fontWeight: 800,
              mt: '9px',
              color: '#242b39',
            }}
          >
            0
          </Typography>
          <Typography sx={{ fontSize: 9, color: '#828b9b', mt: 0.5 }}>
            Not tracked by the backend
          </Typography>
        </Box>
      </Box>

      {/* Order management */}
      <Box sx={adminPanelSx}>
        <Box sx={adminPanelHeadSx}>
          <Box>
            <Typography component="h2" sx={adminPanelH2Sx}>
              Order management
            </Typography>
            <Typography sx={adminPanelDescSx}>Review status and customer totals</Typography>
          </Box>
        </Box>

        <Stack sx={adminFilterRowSx}>
          <InputBase
            placeholder="Search order or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ ...adminInputSx, minWidth: 220 }}
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            sx={{
              ...adminInputSx,
              '& .MuiSelect-select': { p: 0 },
              minWidth: 160,
              fontSize: 10,
            }}
          >
            {STATUS_FILTER_OPTIONS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {filtered.length === 0 ? (
          <Box sx={adminEmptySx}>
            <Typography sx={adminEmptyTitleSx}>No orders match the filter</Typography>
            <Typography sx={adminEmptyDescSx}>
              Try widening the search or picking a different status.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={adminTableSx}>
              <Box component="thead">
                <Box component="tr">
                  {[
                    'Order',
                    'Customer',
                    'Date',
                    'Items',
                    'Total',
                    'Status',
                    'Action',
                  ].map((h) => (
                    <Box component="th" key={h} sx={adminThSx}>
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {filtered.map((o) => {
                  const customer = orderCustomer(o);
                  const pill = orderPill(o);
                  const items = o.orderItems?.reduce((s, i) => s + i.qty, 0) ?? 0;
                  const canShip = pill.status === 'paid';
                  const canDeliver = pill.status === 'shipped';
                  const canCancel = pill.status === 'pending' || pill.status === 'paid';
                  return (
                    <Box component="tr" key={o._id}>
                      <Box component="td" sx={adminTdFirstSx}>
                        {orderIdShort(o._id)}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {customer.name}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {fmtDateShort(o.createdAt)}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {items}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {fmtMoney(o.totalPrice)}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        <StatusPill label={pill.label} tone={pill.tone} />
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                          <Box
                            component={RouterLink}
                            to={`/orders/${o._id}`}
                            sx={adminLinkSx}
                          >
                            Details
                          </Box>
                          {canShip && (
                            <Box
                              component="button"
                              onClick={() => handleShip(o._id)}
                              disabled={anyLoading}
                              sx={{
                                ...adminLinkSx,
                                color: '#326bc4',
                                border: 0,
                                background: 'none',
                                padding: 0,
                                font: 'inherit',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <ShipIcon sx={{ fontSize: 12 }} />
                              Mark shipped
                            </Box>
                          )}
                          {canDeliver && (
                            <Box
                              component="button"
                              onClick={() => handleDeliver(o._id)}
                              disabled={anyLoading}
                              sx={{
                                ...adminLinkSx,
                                color: '#17845e',
                                border: 0,
                                background: 'none',
                                padding: 0,
                                font: 'inherit',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <DeliverIcon sx={{ fontSize: 12 }} />
                              Mark delivered
                            </Box>
                          )}
                          {canCancel && (
                            <Box
                              component="button"
                              onClick={() => handleCancel(o._id)}
                              disabled={anyLoading}
                              sx={{
                                ...adminLinkSx,
                                color: '#c84c4c',
                                border: 0,
                                background: 'none',
                                padding: 0,
                                font: 'inherit',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <CancelIcon sx={{ fontSize: 12 }} />
                              Cancel
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
