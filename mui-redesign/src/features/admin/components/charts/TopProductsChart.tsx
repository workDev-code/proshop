import { Card, CardContent, Typography, Box, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useState, useMemo } from 'react';
import type { Product } from '../../../products/types';
import { topProductsBy } from './utils';

interface Props {
  products?: Product[];
}

type Metric = 'rating' | 'numReviews' | 'price';

const METRIC_LABEL: Record<Metric, string> = {
  rating: 'Top rated',
  numReviews: 'Most reviewed',
  price: 'Most expensive',
};

const METRIC_AXIS: Record<Metric, string> = {
  rating: 'Rating (★)',
  numReviews: 'Reviews',
  price: 'Price ($)',
};

/**
 * Horizontal bar chart of top N products by selected metric.
 * - Toggle between rating / numReviews / price
 * - Tooltip shows brand + value
 */
export const TopProductsChart = ({ products }: Props) => {
  const [metric, setMetric] = useState<Metric>('rating');
    const safeProducts = products ?? [];
  const data = useMemo(() => topProductsBy(safeProducts, metric, 8), [products, metric]);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <StarIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Top products
            </Typography>
          </Stack>
          <ToggleButtonGroup
            value={metric}
            exclusive
            size="small"
            onChange={(_, v) => v && setMetric(v)}
          >
            {(Object.keys(METRIC_LABEL) as Metric[]).map((m) => (
              <ToggleButton key={m} value={m} sx={{ px: 1.5, fontSize: '0.75rem' }}>
                {METRIC_LABEL[m]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Box sx={{ width: '100%', height: 320 }}>
          {data.length > 0 ? (
            <BarChart
              xAxis={[{ label: METRIC_AXIS[metric] }]}
              yAxis={[{ data: data.map((d) => d.name), scaleType: 'band', tickLabelStyle: { fontSize: 11 } }]}
              series={[
                {
                  data: data.map((d) => d.value),
                  label: METRIC_AXIS[metric],
                  color: '#4F46E5',
                },
              ]}
              layout="horizontal"
              height={320}
              margin={{ top: 16, right: 16, bottom: 48, left: 100 }}
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
              No products yet
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
