import { useMemo } from 'react';
import { Box, Stack, Button, Typography } from '@mui/material';
import {
  useGetAllOrdersQuery,
} from '../adminApi';
import { useGetProductsQuery } from '../../products/productApi';
import { StatCard } from '../components/StatCard';
import { useToast } from '../../../hooks/useToast';
import { fmtMoney, fmtNumber } from '../../../utils/fmt';
import { LoadingState } from '../../../components/feedback/LoadingState';
import {
  adminEmptyDescSx,
  adminEmptySx,
  adminEmptyTitleSx,
  adminPanelDescSx,
  adminPanelH2Sx,
  adminPanelHeadSx,
  adminPanelSx,
  adminTableSx,
  adminTdFirstSx,
  adminTdSx,
  adminThSx,
  adminTitleRowSx,
} from '../components/adminStyles';
import { adminH1Sx, adminSubtitleSx } from '../components/adminStyles';
import type { Order, OrderItem } from '../../orders/types';
import type { Product } from '../../products/types';

interface ProductMetric {
  product: Product;
  unitsSold: number;
  revenue: number;
}

/* Compute top products by revenue from real order data. */
const computeTopProducts = (
  orders: Order[] | undefined,
  products: Product[] | undefined,
): ProductMetric[] => {
  const map = new Map<string, ProductMetric>();
  if (!orders || !products) return [];

  const productById = new Map<string, Product>();
  for (const p of products) productById.set(p._id, p);

  for (const o of orders) {
    for (const item of o.orderItems as OrderItem[]) {
      const product = productById.get(item.product);
      if (!product) continue;
      const cur = map.get(product._id) ?? { product, unitsSold: 0, revenue: 0 };
      cur.unitsSold += item.qty;
      cur.revenue += item.qty * item.price;
      map.set(product._id, cur);
    }
  }

  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
};

const UnavailableStat = ({
  label,
  icon,
  explanation,
}: {
  label: string;
  icon: React.ReactNode;
  explanation: string;
}) => (
  <StatCard
    label={label}
    value="—"
    icon={icon}
    caption={
      <Box sx={{ mt: 0.5 }}>
        <Typography
          component="span"
          sx={{
            fontSize: 10,
            fontWeight: 700,
            color: '#50596a',
            display: 'block',
          }}
        >
          Data not available
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: 9, color: '#828b9b', display: 'block', mt: 0.25 }}
        >
          {explanation}
        </Typography>
      </Box>
    }
  />
);

export const AdminAnalyticsPage = () => {
  const toast = useToast();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrdersQuery();
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery(undefined);

  const products = productsData?.products ?? [];

  const topProducts = useMemo(
    () => computeTopProducts(orders, products),
    [orders, products],
  );

  if (ordersLoading || productsLoading) {
    return <LoadingState variant="card" count={4} />;
  }

  return (
    <>
      {/* Title row */}
      <Box sx={adminTitleRowSx}>
        <Box>
          <Typography component="h1" sx={adminH1Sx}>
            Analytics
          </Typography>
          <Typography sx={adminSubtitleSx}>
            Understand sales trends and store performance.
          </Typography>
        </Box>
        <Button
          onClick={() => toast.info('Export report preview — wire up when backend supports it.')}
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
          ↓ Export report
        </Button>
      </Box>

      {/* 4 stat cards — all show "Data not available" by design */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 1.875,
          mb: 2.25,
        }}
      >
        <UnavailableStat
          label="Conversion rate"
          icon={<Box sx={{ fontFamily: 'monospace', fontWeight: 700 }}>%</Box>}
          explanation="Conversion requires session tracking"
        />
        <UnavailableStat
          label="Sessions"
          icon={<Box sx={{ fontFamily: 'monospace', fontWeight: 700 }}>↗</Box>}
          explanation="Requires analytics integration"
        />
        <UnavailableStat
          label="Returning customers"
          icon={<Box sx={{ fontFamily: 'monospace', fontWeight: 700 }}>↻</Box>}
          explanation="No historical cohort data yet"
        />
        <UnavailableStat
          label="Refund rate"
          icon={<Box sx={{ fontFamily: 'monospace', fontWeight: 700 }}>$</Box>}
          explanation="Refunds aren't tracked by the backend"
        />
      </Box>

      {/* Top performing products */}
      <Box sx={adminPanelSx}>
        <Box sx={adminPanelHeadSx}>
          <Box>
            <Typography component="h2" sx={adminPanelH2Sx}>
              Top-performing products
            </Typography>
            <Typography sx={adminPanelDescSx}>
              Ranked by revenue from all paid orders
            </Typography>
          </Box>
        </Box>

        {topProducts.length === 0 ? (
          <Box sx={adminEmptySx}>
            <Typography sx={adminEmptyTitleSx}>No sales data yet</Typography>
            <Typography sx={adminEmptyDescSx}>
              Once customers start placing orders, top products will appear here.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={adminTableSx}>
              <Box component="thead">
                <Box component="tr">
                  {['Product', 'Units sold', 'Revenue', 'Trend'].map((h) => (
                    <Box component="th" key={h} sx={adminThSx}>
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {topProducts.map((m) => (
                  <Box component="tr" key={m.product._id}>
                    <Box component="td" sx={adminTdFirstSx}>
                      <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Box
                          sx={{
                            width: 36,
                            height: 38,
                            borderRadius: '7px',
                            bgcolor: '#f0f1ed',
                            flexShrink: 0,
                            display: 'grid',
                            placeItems: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          {m.product.image ? (
                            <Box
                              component="img"
                              src={m.product.image}
                              alt={m.product.name}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <Typography
                              sx={{ fontSize: 12, fontWeight: 700, color: '#929aaa' }}
                            >
                              {m.product.name?.[0]?.toUpperCase() ?? '?'}
                            </Typography>
                          )}
                        </Box>
                        <Box>
                          <Typography
                            component="strong"
                            sx={{ display: 'block', fontSize: 10, fontWeight: 700 }}
                          >
                            {m.product.name}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Box component="td" sx={adminTdSx}>
                      {fmtNumber(m.unitsSold)}
                    </Box>
                    <Box component="td" sx={adminTdSx}>
                      {fmtMoney(m.revenue)}
                    </Box>
                    <Box component="td" sx={adminTdSx}>
                      —
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
