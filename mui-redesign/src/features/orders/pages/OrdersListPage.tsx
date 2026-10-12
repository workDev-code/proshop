import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Skeleton,
  Grid2 as Grid,
} from '@mui/material';
import {
  Receipt as OrdersIcon,
  ArrowForward as ArrowIcon,
  LocalShipping as ShipIcon,
  CheckCircle as DeliveredIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { PriceDisplay } from '../../products/components/PriceDisplay';
import { useGetMyOrdersQuery } from '../orderApi';
import { fmtDate } from '../../../utils/fmt';



export const OrdersListPage = () => {
  const { data: orders, isLoading } = useGetMyOrdersQuery();

  return (
    <Box>
      <PageHeader
        title="My Orders"
        subtitle="Track and view all your purchases"
        icon={<OrdersIcon />}
      />

      {isLoading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={120} />
          ))}
        </Stack>
      ) : !orders || orders.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              title="No orders yet"
              description="When you place an order, it will appear here."
              action={{
                label: 'Start shopping',
                onClick: () => (window.location.href = '/'),
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {orders.map((o) => {
            const isPaid = o.isPaid;
            const isDelivered = o.isDelivered;
            const StatusIcon = isDelivered
              ? DeliveredIcon
              : isPaid
              ? ShipIcon
              : PendingIcon;
            const statusColor = isDelivered
              ? 'success'
              : isPaid
              ? 'info'
              : 'warning';
            const statusLabel = isDelivered
              ? 'Delivered'
              : isPaid
              ? 'Shipped'
              : 'Pending payment';

            return (
              <Card
                key={o._id}
                sx={{
                  transition: 'box-shadow 200ms ease',
                  '&:hover': { boxShadow: 3 },
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Order ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace', fontWeight: 600 }}
                      >
                        #{o._id.slice(-8).toUpperCase()}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body2">{fmtDate(o.createdAt)}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Items
                      </Typography>
                      <Typography variant="body2">
                        {o.orderItems.reduce((sum, i) => sum + i.qty, 0)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Total
                      </Typography>
                      <PriceDisplay value={o.totalPrice} variant="body2" color="primary.main" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <Chip
                        icon={<StatusIcon />}
                        label={statusLabel}
                        color={statusColor}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <Button
                        component={RouterLink}
                        to={`/orders/${o._id}`}
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowIcon />}
                        fullWidth
                      >
                        View
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};
