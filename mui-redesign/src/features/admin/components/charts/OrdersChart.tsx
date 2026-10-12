import { Card, CardContent, Typography, Box, Stack, Chip } from '@mui/material';
import { Receipt as OrdersIcon } from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';
import type { Order } from '../../../orders/types';
import { revenueByDay } from './utils';

interface Props {
  orders?: Order[];
  days?: number;
}

/**
 * Orders-per-day bar chart for the last N days.
 *  - Stacks paid vs pending so admin can see health
 *  - Tooltip shows total for that day
 */
export const OrdersChart = ({ orders, days = 30 }: Props) => {
    const safeOrders = orders ?? [];
  const data = useMemo(() => {
    const keys = revenueByDay([], days); // for date scaffold
    const map = new Map<string, { paid: number; pending: number }>();
    keys.forEach((k) => map.set(k.date, { paid: 0, pending: 0 }));

    for (const o of safeOrders) {
      const k = new Date(o.createdAt).toISOString().slice(0, 10);
      const bucket = map.get(k);
      if (bucket) {
        if (o.isPaid) bucket.paid += 1;
        else bucket.pending += 1;
      }
    }
    return keys.map((k) => ({
      label: k.label,
      paid: map.get(k.date)?.paid ?? 0,
      pending: map.get(k.date)?.pending ?? 0,
    }));
  }, [orders, days]);

  const totalPaid = data.reduce((s, d) => s + d.paid, 0);
  const totalPending = data.reduce((s, d) => s + d.pending, 0);
  const hasData = totalPaid + totalPending > 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <OrdersIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Orders trend ({days} days)
            </Typography>
          </Stack>
          {hasData && (
            <Stack direction="row" spacing={1}>
              <Chip label={`${totalPaid} paid`} color="success" size="small" />
              <Chip label={`${totalPending} pending`} color="warning" size="small" />
            </Stack>
          )}
        </Stack>

        <Box sx={{ width: '100%', height: 280 }}>
          {hasData ? (
            <BarChart
              xAxis={[{ data: data.map((d) => d.label), scaleType: 'band', tickLabelStyle: { fontSize: 11 } }]}
              series={[
                { data: data.map((d) => d.paid), label: 'Paid', color: '#10B981', stack: 'a' },
                { data: data.map((d) => d.pending), label: 'Pending', color: '#F59E0B', stack: 'a' },
              ]}
              height={280}
              margin={{ top: 16, right: 16, bottom: 36, left: 48 }}
              grid={{ horizontal: true }}
            />
          ) : (
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
              No orders in the selected period
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
