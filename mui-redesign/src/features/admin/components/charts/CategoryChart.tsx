import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { Category as CategoryIcon } from '@mui/icons-material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useMemo } from 'react';
import type { Product } from '../../../products/types';
import { productsByCategory } from './utils';

interface Props {
  products?: Product[];
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

/**
 * Pie chart of products grouped by category.
 * - Inner radius for donut style
 * - Center label shows total products
 */
export const CategoryChart = ({ products }: Props) => {
    const safeProducts = products ?? [];
  const data = useMemo(() => productsByCategory(safeProducts), [products]);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <CategoryIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Products by category
          </Typography>
        </Stack>

        <Box sx={{ width: '100%', height: 320, position: 'relative' }}>
          {data.length > 0 ? (
            <>
              <PieChart
                series={[
                  {
                    data: data.map((d, i) => ({
                      id: d.id,
                      value: d.value,
                      label: d.label,
                      color: COLORS[i % COLORS.length],
                    })),
                    innerRadius: 60,
                    outerRadius: 110,
                    paddingAngle: 2,
                    cornerRadius: 4,
                    cx: 140,
                    cy: 140,
                  },
                ]}
                height={320}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                slotProps={{ legend: { hidden: false, direction: 'column', position: { vertical: 'middle', horizontal: 'right' } } }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 140,
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                  {total}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  products
                </Typography>
              </Box>
            </>
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
