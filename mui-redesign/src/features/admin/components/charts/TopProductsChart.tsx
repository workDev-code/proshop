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
  rating: 'Rating',
  numReviews: 'Reviews',
  price: 'Price',
};

const METRIC_AXIS: Record<Metric, string> = {
  rating: 'Rating (★)',
  numReviews: 'Reviews',
  price: 'Price ($)',
};

/** Truncate a product name to fit narrow y-axis labels. */
const truncate = (s: string, max = 22) =>
  s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`;

/**
 * Horizontal bar chart of top N products by selected metric.
 * - Toggle between rating / numReviews / price
 * - Tooltip shows brand + value
 * - Truncated product names so they fit narrow columns
 */
export const TopProductsChart = ({ products }: Props) => {
  const [metric, setMetric] = useState<Metric>('rating');
  const safeProducts = products ?? [];
  const data = useMemo(() => topProductsBy(safeProducts, metric, 6), [safeProducts, metric]);
  const truncated = useMemo(() => data.map((d) => truncate(d.name, 20)), [data]);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 1.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <StarIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Top products
            </Typography>
          </Stack>
          <ToggleButtonGroup
            value={metric}
            exclusive
            size="small"
            onChange={(_, v) => v && setMetric(v)}
            sx={{
              '& .MuiToggleButton-root': {
                px: 1.25,
                py: 0.25,
                fontSize: '0.7rem',
                textTransform: 'none',
                fontWeight: 600,
              },
            }}
          >
            {(Object.keys(METRIC_LABEL) as Metric[]).map((m) => (
              <ToggleButton key={m} value={m}>
                {METRIC_LABEL[m]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Box sx={{ width: '100%', height: 280 }}>
          {data.length > 0 ? (
            <BarChart
              xAxis={[{ label: METRIC_AXIS[metric] }]}
              yAxis={[
                {
                  data: truncated,
                  scaleType: 'band',
                  tickLabelStyle: { fontSize: 11 },
                },
              ]}
              series={[
                {
                  data: data.map((d) => d.value),
                  label: METRIC_AXIS[metric],
                  color: '#d95d39',
                },
              ]}
              layout="horizontal"
              height={280}
              margin={{ top: 16, right: 16, bottom: 44, left: 110 }}
              grid={{ horizontal: true }}
              slotProps={{ legend: { hidden: true } }}
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
