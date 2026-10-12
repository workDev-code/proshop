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
import { useGetAllOrdersQuery, useGetAllUsersQuery } from '../adminApi';
import { useGetProductsQuery } from '../../products/productApi';
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
import type { PillTone } from '../../../components/feedback/StatusPill';
import type { Order } from '../../orders/types';

/* ─── helpers ────────────────────────────────────────────────────────── */

const todayLabel = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

/** Map an order to the matching status pill. */
const orderPill = (o: Order): { label: string; tone: PillTone } => {
  if (o.isDelivered) return { label: 'Delivered', tone: 'success' };
  if (o.isPaid) return { label: 'Shipped', tone: 'info' };
  return { label: 'Pending', tone: 'warning' };
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

/* ─── revenue bar chart (CSS-only, mirrors the prototype) ────────────── */

interface MonthlyRevenue {
  label: string;
  thisYear: number;
  lastYear: number;
}

const buildMonthlyRevenue = (orders: Order[] | undefined): MonthlyRevenue[] => {
  const now = new Date();
  const buckets: MonthlyRevenue[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      thisYear: 0,
      lastYear: 0,
    });
  }
  if (!orders) return buckets;

  const monthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
  const byKey = new Map<string, number>();
  for (const o of orders) {
    if (!o.isPaid) continue;
    const dt = new Date(o.createdAt);
    byKey.set(monthKey(dt), (byKey.get(monthKey(dt)) ?? 0) + o.totalPrice);
  }

  buckets.forEach((b, idx) => {
    const target = new Date(now.getFullYear(), now.getMonth() - (6 - idx), 1);
    const v = byKey.get(monthKey(target));
    if (v !== undefined) b.thisYear = v;
  });
  return buckets;
};

const RevenueBarChart = ({ orders }: { orders?: Order[] }) => {
  const data = buildMonthlyRevenue(orders);
  const hasData = data.some((d) => d.thisYear > 0);
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
  const max = Math.max(...data.map((d) => d.thisYear)) || 1;

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
                gap: '4px',
              }}
            >
              <Box
                sx={{
                  width: '32%',
                  maxWidth: 22,
                  height: `${(d.lastYear / max) * 100}%`,
                  borderRadius: '5px 5px 1px 1px',
                  bgcolor: '#f2b8a7',
                  minHeight: 0,
                  visibility: d.lastYear > 0 ? 'visible' : 'hidden',
                }}
              />
              <Box
                sx={{
                  width: '32%',
                  maxWidth: 22,
                  height: `${(d.thisYear / max) * 100}%`,
                  borderRadius: '5px 5px 1px 1px',
                  bgcolor: '#e36342',
                  minHeight: d.thisYear > 0 ? 4 : 0,
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
          This year
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: '#f2b8a7',
              display: 'inline-block',
            }}
          />
          Last year
        </Stack>
      </Stack>
    </>
  );
};

/* ─── Sales by channel panel (always empty, by design) ───────────────── */

const ChannelPanel = () => (
  <Panel>
    <PanelHead title="Sales by channel" description="Where your customers find you" />
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <Typography sx={adminEmptyTitleSx}>Data not available</Typography>
      <Typography sx={adminEmptyDescSx}>
        Channel attribution isn't tracked by the backend yet.
      </Typography>
    </Box>
  </Panel>
);

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
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery(undefined);

  const paidOrders = orders?.filter((o) => o.isPaid) ?? [];
  const totalRevenue = paidOrders.reduce((s, o) => s + o.totalPrice, 0);

  const isLoading = ordersLoading || usersLoading || productsLoading;

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

      {/* 4 stat cards */}
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
          value={fmtMoney(totalRevenue)}
          icon={<RevenueIcon />}
          caption={
            <>
              <b>↗ Paid orders</b> · {fmtNumber(paidOrders.length)} this period
            </>
          }
        />
        <StatCard
          label="Orders"
          value={fmtNumber(orders?.length ?? 0)}
          icon={<OrdersIcon />}
          caption={
            <>
              <b>{fmtNumber(paidOrders.length)} paid</b> ·{' '}
              {fmtNumber((orders?.length ?? 0) - paidOrders.length)} pending
            </>
          }
        />
        <StatCard
          label="Products"
          value={fmtNumber(productsData?.total ?? 0)}
          icon={<ProductsIcon />}
          caption={<>In your catalog</>}
        />
        <StatCard
          label="Customers"
          value={fmtNumber(users?.length ?? 0)}
          icon={<CustomersIcon />}
          caption={<>Registered accounts</>}
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
          <RevenueBarChart orders={orders} />
        </Panel>
        <ChannelPanel />
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
