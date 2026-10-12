// Now wired to the new analytics endpoints. The 4 KPI cards, the top-products
// table and the revenue chart all read from /api/analytics/* rather than
// being computed client-side from the raw orders/users/products lists.
// "Sales by channel" is honestly empty because the backend can't derive it.
import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  ReceiptLong as OrdersIcon,
  Inventory2 as ProductsIcon,
  Group as CustomersIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { StatCard } from '../components/StatCard';
import { StatusPill } from '../../../components/feedback/StatusPill';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { useGetAllOrdersQuery } from '../adminApi';
import {
  useGetOverviewQuery,
  useGetTopProductsQuery,
  useGetRevenueByMonthQuery,
} from '../../analytics/analyticsApi';
import { fmtDate, fmtMoney, fmtNumber } from '../../../utils/fmt';
import {
  adminEmptyDescSx,
  adminEmptySx,
  adminEmptyTitleSx,
  adminH1Sx,
  adminLinkSx,
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
import type { RevenueByMonth, TopProduct } from '../../analytics/types';
import type { PillTone } from '../../../components/feedback/StatusPill';
import type { Order, OrderStatus } from '../../orders/types';

/* ─── helpers ────────────────────────────────────────────────────────── */

const todayLabel = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

/** Resolve the effective status, falling back to isPaid/isDelivered for
 *  the legacy demo seed. */
const resolveStatus = (o: Order): OrderStatus => {
  const s = (o as { status?: string }).status as OrderStatus | undefined;
  if (s === 'pending' || s === 'paid' || s === 'shipped' || s === 'delivered' || s === 'cancelled') {
    return s;
  }
  if (o.isDelivered) return 'delivered';
  if (o.isPaid) return 'paid';
  return 'pending';
};

const ORDER_STATUS_TONES: Record<OrderStatus, PillTone> = {
  pending: 'warning',
  paid: 'success',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

const orderPill = (o: Order): { label: string; tone: PillTone } => {
  const status = resolveStatus(o);
  const labels: Record<OrderStatus, string> = {
    pending: 'Pending',
    paid: 'Paid',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return { label: labels[status], tone: ORDER_STATUS_TONES[status] };
};

const orderCustomer = (o: Order): { name: string; email: string } =>
  o.user && typeof o.user === 'object' ? o.user : { name: 'Customer', email: '' };

const orderIdShort = (id: string) => `#PS-${id.slice(-4).toUpperCase()}`;

/* ─── small page bits ───────────────────────────────────────────────── */

const DatePill = () => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1,
      fontSize: 11,
      color: '#70798b',
      bgcolor: '#fff',
      border: '1px solid #e5e8ee',
      borderRadius: '8px',
      px: 1.5,
      py: 1.125,
      whiteSpace: 'nowrap',
    }}
  >
    <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
    {todayLabel()} · Last 30 days
  </Box>
);

const TitleRow = ({
  title,
  description,
  date,
}: {
  title: string;
  description: string;
  date?: boolean;
}) => (
  <Box sx={adminTitleRowSx}>
    <Box>
      <Typography component="h1" sx={adminH1Sx}>
        {title}
      </Typography>
      <Typography sx={adminSubtitleSx}>{description}</Typography>
    </Box>
    {date && <DatePill />}
  </Box>
);

const PanelHead = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <Box sx={adminPanelHeadSx}>
    <Box>
      <Typography component="h2" sx={adminPanelH2Sx}>
        {title}
      </Typography>
      <Typography sx={adminPanelDescSx}>{description}</Typography>
    </Box>
    {action}
  </Box>
);

const Panel = ({ children }: { children: React.ReactNode }) => (
  <Box sx={adminPanelSx}>{children}</Box>
);

/* ─── revenue bar chart (CSS-only) ─────────────────────────────── */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const buildMonthlyBars = (rows: RevenueByMonth[] | undefined) => {
  const now = new Date();
  const buckets: { label: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ label: MONTHS[d.getMonth()], revenue: 0 });
  }
  if (!rows) return buckets;
  // Build a lookup of all months that have data, then map them onto the
  // trailing 7-month window so older buckets don't appear.
  for (const row of rows) {
    const rowDate = new Date(row.year, row.month - 1, 1);
    const monthsAgo =
      (now.getFullYear() - row.year) * 12 + (now.getMonth() - row.month);
    if (monthsAgo < 0 || monthsAgo > 6) continue;
    const idx = 6 - monthsAgo;
    if (buckets[idx]) buckets[idx].revenue = row.revenue;
    void rowDate;
  }
  return buckets;
};

const RevenueBarChart = ({ rows }: { rows: RevenueByMonth[] | undefined }) => {
  const data = buildMonthlyBars(rows);
  const hasData = data.some((d) => d.revenue > 0);
  if (!hasData) {
    return (
      <Box
        sx={{
          height: 205,
          display: 'grid',
          placeItems: 'center',
          color: '#828b9b',
          fontSize: 12,
        }}
      >
        Data not available
      </Box>
    );
  }
  const max = Math.max(...data.map((d) => d.revenue)) || 1;

  return (
    <>
      <Box
        sx={{
          height: 205,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1.5,
          pt: 1.875,
          px: 0.625,
          borderBottom: '1px solid #edf0f4',
          background:
            'repeating-linear-gradient(to bottom, transparent 0, transparent 49px, #f0f2f6 50px)',
          position: 'relative',
        }}
      >
        {data.map((d) => (
          <Box
            key={d.label}
            sx={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '9px',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: 'calc(100% - 20px)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: '38%',
                  maxWidth: 28,
                  height: `${(d.revenue / max) * 100}%`,
                  borderRadius: '5px 5px 1px 1px',
                  bgcolor: '#e36342',
                  minHeight: d.revenue > 0 ? 4 : 0,
                }}
              />
            </Box>
            <Typography
              component="span"
              sx={{ fontSize: 9, color: '#8b93a2', lineHeight: 1 }}
            >
              {d.label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Stack
        direction="row"
        spacing={2.125}
        sx={{ mt: 1.75, color: '#7d8695', fontSize: 10 }}
      >
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: '#e36342',
              display: 'inline-block',
            }}
          />
          Revenue
        </Stack>
      </Stack>
    </>
  );
};

/* ─── Sales by channel panel (always empty, by design) ───────────────── */

const ChannelPanel = ({ whyMessage }: { whyMessage: string }) => (
  <Panel>
    <PanelHead title="Sales by channel" description="Where your customers find you" />
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <Typography sx={adminEmptyTitleSx}>Data not available</Typography>
      <Typography sx={adminEmptyDescSx}>{whyMessage}</Typography>
      <Typography
        sx={{
          fontSize: 9,
          color: '#9aa3b3',
          mt: 1,
          fontStyle: 'italic',
        }}
      >
        Why? overview.unavailable.salesByChannel is null
      </Typography>
    </Box>
  </Panel>
);

/* ─── top performing products table ──────────────────────────────── */

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
            {['Product', 'Units sold', 'Revenue', 'Trend'].map((h) => (
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
                —
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

/* ─── recent orders table ────────────────────────────────────────────── */

const RecentOrdersTable = ({ orders }: { orders?: Order[] }) => {
  const rows = (orders ?? []).slice(0, 4);
  if (rows.length === 0) {
    return (
      <Box sx={adminEmptySx}>
        <Typography sx={adminEmptyTitleSx}>No recent orders</Typography>
        <Typography sx={adminEmptyDescSx}>
          Orders will appear here as soon as customers check out.
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box component="table" sx={adminTableSx}>
        <Box component="thead">
          <Box component="tr">
            {['Order', 'Customer', 'Date', 'Total', 'Status'].map((h) => (
              <Box component="th" key={h} sx={adminThSx}>
                {h}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {rows.map((o) => {
            const customer = orderCustomer(o);
            const pill = orderPill(o);
            return (
              <Box component="tr" key={o._id}>
                <Box component="td" sx={adminTdFirstSx}>
                  {orderIdShort(o._id)}
                </Box>
                <Box component="td" sx={adminTdSx}>
                  {customer.name}
                </Box>
                <Box component="td" sx={adminTdSx}>
                  {fmtDate(o.createdAt)}
                </Box>
                <Box component="td" sx={adminTdSx}>
                  {fmtMoney(o.totalPrice)}
                </Box>
                <Box component="td" sx={adminTdSx}>
                  <StatusPill label={pill.label} tone={pill.tone} />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

/* ─── page ───────────────────────────────────────────────────────────── */

export const AdminDashboardPage = () => {
  const { data: orders, isLoading: ordersLoading } = useGetAllOrdersQuery();
  const { data: overview, isLoading: overviewLoading } = useGetOverviewQuery(30);
  const { data: topProducts, isLoading: topLoading } = useGetTopProductsQuery(5);
  const { data: revenueByMonth, isLoading: revenueLoading } = useGetRevenueByMonthQuery(7);

  const isLoading = ordersLoading || overviewLoading || topLoading || revenueLoading;

  if (isLoading) {
    return (
      <>
        <TitleRow title="Overview" description="Snapshot of your store performance" date />
        <LoadingState variant="card" count={4} />
      </>
    );
  }

  return (
    <>
      <TitleRow title="Overview" description="Snapshot of your store performance" date />

      {/* 4 stat cards — all sourced from /api/analytics/overview */}
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
          label="Revenue"
          value={fmtMoney(overview?.revenue ?? 0)}
          icon={<RevenueIcon />}
          caption={
            <>
              <b>↗ Last 30 days</b> · AOV {fmtMoney(overview?.aov ?? 0)}
            </>
          }
        />
        <StatCard
          label="Orders"
          value={fmtNumber(overview?.ordersCount ?? 0)}
          icon={<OrdersIcon />}
          caption={
            <>
              <b>{fmtNumber(overview?.paidOrdersCount ?? 0)} paid</b> · in this period
            </>
          }
        />
        <StatCard
          label="Products"
          value={fmtNumber(overview?.products.total ?? 0)}
          icon={<ProductsIcon />}
          caption={
            <>
              <b>{fmtNumber(overview?.products.lowStock ?? 0)} low</b> ·{' '}
              {fmtNumber(overview?.products.outOfStock ?? 0)} out of stock
            </>
          }
        />
        <StatCard
          label="Customers"
          value={fmtNumber(overview?.totalCustomers ?? 0)}
          icon={<CustomersIcon />}
          caption={
            <>
              <b>{fmtNumber(overview?.newCustomers ?? 0)} total</b> · paid rate{' '}
              {fmtNumber(overview?.paidCustomerRate ?? 0)}%
            </>
          }
        />
      </Box>

      {/* Revenue + channel */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1.45fr) minmax(270px, 0.85fr)' },
          gap: 2.125,
          mb: 2.25,
        }}
      >
        <Panel>
          <PanelHead
            title="Revenue overview"
            description="Revenue performance across the last 7 months"
          />
          <RevenueBarChart rows={revenueByMonth} />
        </Panel>
        <ChannelPanel whyMessage="Channel attribution isn't tracked by the backend yet." />
      </Box>

      {/* Top performing products */}
      <Box sx={{ mb: 2.25 }}>
        <Panel>
          <PanelHead
            title="Top performing products"
            description="Ranked by revenue from all paid orders (last 30 days)"
          />
          <TopProductsTable rows={topProducts} />
        </Panel>
      </Box>

      {/* Recent orders */}
      <Panel>
        <PanelHead
          title="Recent orders"
          description="Latest orders from your store"
          action={
            <Box component={RouterLink} to="/admin/orders" sx={adminLinkSx}>
              View all orders ↗
            </Box>
          }
        />
        <RecentOrdersTable orders={orders} />
      </Panel>
    </>
  );
};
