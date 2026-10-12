// Now consumes the analytics endpoints instead of computing metrics from
// raw orders/products. The 4 stat cards read from /api/analytics/overview;
// Conversion rate uses `paidCustomerRate` (the closest metric the backend
// can derive from the order history).
import { Box, Stack, Button, Typography } from '@mui/material';
import {
  useGetOverviewQuery,
  useGetTopProductsQuery,
} from '../../analytics/analyticsApi';
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
import type { TopProduct } from '../../analytics/types';

/**
 * Renders an "available" stat card with a value + caption, or a
 * "Data not available" placeholder when the field is null.
 */
const StatSlot = ({
  label,
  value,
  icon,
  explanation,
}: {
  label: string;
  value: string | number | null | undefined;
  icon: React.ReactNode;
  explanation?: string;
}) => {
  if (value === null || value === undefined) {
    return (
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
            {explanation && (
              <Typography
                component="span"
                sx={{ fontSize: 9, color: '#828b9b', display: 'block', mt: 0.25 }}
              >
                {explanation}
              </Typography>
            )}
          </Box>
        }
      />
    );
  }
  return <StatCard label={label} value={value} icon={icon} />;
};

const TopProductsTable = ({ rows }: { rows: TopProduct[] | undefined }) => {
  if (!rows || rows.length === 0) {
    return (
      <Box sx={adminEmptySx}>
        <Typography sx={adminEmptyTitleSx}>No sales data yet</Typography>
        <Typography sx={adminEmptyDescSx}>
          Once customers start placing orders, top products will appear here.
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box component="table" sx={adminTableSx}>
        <Box component="thead">
          <Box component="tr">
            {['Product', 'Units sold', 'Revenue', 'Orders'].map((h) => (
              <Box component="th" key={h} sx={adminThSx}>
                {h}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {rows.map((row) => (
            <Box component="tr" key={row.productId}>
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
                    {row.image ? (
                      <Box
                        component="img"
                        src={row.image}
                        alt={row.name}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#929aaa' }}>
                        {row.name?.[0]?.toUpperCase() ?? '?'}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      component="strong"
                      sx={{ display: 'block', fontSize: 10, fontWeight: 700 }}
                    >
                      {row.name}
                    </Typography>
                    <Typography
                      component="small"
                      sx={{ display: 'block', color: '#929aaa', fontSize: 9, mt: '4px' }}
                    >
                      {row.category}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Box component="td" sx={adminTdSx}>
                {fmtNumber(row.unitsSold)}
              </Box>
              <Box component="td" sx={adminTdSx}>
                {fmtMoney(row.revenue)}
              </Box>
              <Box component="td" sx={adminTdSx}>
                {fmtNumber(row.ordersCount)}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export const AdminAnalyticsPage = () => {
  const toast = useToast();
  const { data: overview, isLoading: overviewLoading } = useGetOverviewQuery(30);
  const { data: topProducts, isLoading: topLoading } = useGetTopProductsQuery(10);

  if (overviewLoading || topLoading) {
    return <LoadingState variant="card" count={4} />;
  }

  // paidCustomerRate is a percentage (0-100) — show with 1 decimal.
  const conversionLabel =
    overview?.paidCustomerRate !== undefined && overview?.paidCustomerRate !== null
      ? `${overview.paidCustomerRate.toFixed(1)}%`
      : null;

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

      {/* 4 stat cards — only fields the backend can compute are real */}
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
        <StatCard
          label="Conversion rate"
          value={conversionLabel ?? '—'}
          icon={<Box sx={{ fontFamily: 'monospace', fontWeight: 700 }}>%</Box>}
          caption={
            <Box sx={{ mt: 0.5 }}>
              <Typography
                component="span"
                sx={{ fontSize: 10, fontWeight: 700, color: '#50596a', display: 'block' }}
              >
                Paid customer rate
              </Typography>
              <Typography
                component="span"
                sx={{ fontSize: 9, color: '#828b9b', display: 'block', mt: 0.25 }}
              >
                % of customers with at least one paid order
              </Typography>
            </Box>
          }
        />
        <StatSlot
          label="Sessions"
          value={null}
          icon={<Box sx={{ fontFamily: 'monospace', fontWeight: 700 }}>↗</Box>}
          explanation="Requires analytics integration"
        />
        <StatSlot
          label="Returning customers"
          value={
            overview?.repeatCustomers !== undefined
              ? fmtNumber(overview.repeatCustomers)
              : null
          }
          icon={<Box sx={{ fontFamily: 'monospace', fontWeight: 700 }}>↻</Box>}
        />
        <StatSlot
          label="Refund rate"
          value={null}
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
              Ranked by revenue from all paid orders (top 10)
            </Typography>
          </Box>
        </Box>
        <TopProductsTable rows={topProducts} />
      </Box>
    </>
  );
};
