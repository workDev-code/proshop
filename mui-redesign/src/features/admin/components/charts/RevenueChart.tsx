import { Card, CardContent, Typography, Box, Stack, Chip } from '@mui/material';
import { TrendingUp as TrendingIcon } from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo } from 'react';
import type { Order } from '../../../orders/types';
import { revenueByDay } from './utils';

interface Props {
  orders?: Order[];
  days?: number;
}

/**
 * Revenue line chart for the last N days (default 30).
 * - Single series: revenue per day
 * - Markers on, smooth curve off
 * - Empty state when no paid orders
 */
export const RevenueChart = ({ orders, days = 30 }: Props) => {
    const safeOrders = orders ?? [];
  const data = useMemo(() => revenueByDay(safeOrders, days), [orders, days]);
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orderCount, 0);
  const avgPerDay = totalRevenue / days;
  const hasData = totalRevenue > 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TrendingIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Revenue ({days} days)
            </Typography>
          </Stack>
          {hasData && (
            <Stack direction="row" spacing={1}>
              <Chip label={`$${totalRevenue.toFixed(0)} total`} color="success" size="small" />
              <Chip label={`$${avgPerDay.toFixed(0)}/day avg`} variant="outlined" size="small" />
              <Chip label={`${totalOrders} orders`} variant="outlined" size="small" />
            </Stack>
          )}
        </Stack>

        <Box sx={{ width: '100%', height: 280 }}>
          {hasData ? (
            <LineChart
              xAxis={[
                {
                  data: data.map((d) => d.label),
                  scaleType: 'point',
                  tickLabelStyle: { fontSize: 11 },
                },
              ]}
              series={[
                {
                  data: data.map((d) => d.revenue),
                  label: 'Revenue ($)',
                  color: '#d95d39',
                  area: true,
                  showMark: true,
                  curve: 'monotoneX',
                },
              ]}
              height={280}
              margin={{ top: 16, right: 16, bottom: 36, left: 56 }}
              grid={{ horizontal: true }}
              sx={{
                '& .MuiAreaElement-series-Revenue': {
                  fillOpacity: 0.15,
                },
              }}
            />
          ) : (
            <EmptyChart label="No paid orders in the selected period" />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const EmptyChart = ({ label }: { label: string }) => (
  <Box
    sx={{
      height: '100%',
      display: 'grid',
      placeItems: 'center',
      color: 'text.secondary',
      fontSize: 14,
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: 2,
    }}
  >
    {label}
  </Box>
);
