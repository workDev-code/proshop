import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon,
  ShoppingBag as OrdersIcon,
  People as CustomersIcon,
  AttachMoney as RevenueIcon,
  Inventory2 as ProductsIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';

const STATS = [
  {
    label: 'Revenue (30d)',
    value: '$48,290',
    delta: '+12.4%',
    trend: 'up' as const,
    icon: <RevenueIcon />,
    color: 'success.main',
  },
  {
    label: 'Orders (30d)',
    value: '1,284',
    delta: '+8.2%',
    trend: 'up' as const,
    icon: <OrdersIcon />,
    color: 'primary.main',
  },
  {
    label: 'Customers',
    value: '892',
    delta: '+3.1%',
    trend: 'up' as const,
    icon: <CustomersIcon />,
    color: 'info.main',
  },
  {
    label: 'Avg order value',
    value: '$37.61',
    delta: '-1.8%',
    trend: 'down' as const,
    icon: <ProductsIcon />,
    color: 'warning.main',
  },
];

const RECENT_ORDERS = [
  { id: '#1029', name: 'Sarah Johnson', total: '$129.99', status: 'Paid' },
  { id: '#1028', name: 'Mike Williams', total: '$45.50',  status: 'Shipped' },
  { id: '#1027', name: 'Emma Davis',    total: '$248.00', status: 'Delivered' },
  { id: '#1026', name: 'Alex Chen',     total: '$89.99',  status: 'Pending' },
  { id: '#1025', name: 'Lisa Park',     total: '$15.00',  status: 'Paid' },
];

const STATUS_COLOR: Record<string, 'success' | 'info' | 'primary' | 'warning'> = {
  Paid: 'success',
  Shipped: 'info',
  Delivered: 'primary',
  Pending: 'warning',
};

export const DashboardPage = () => (
  <>
    <PageHeader
      title="Dashboard"
      subtitle="Overview of your store performance"
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Dashboard' }]}
    />

    {/* Stat cards */}
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        mb: 3,
      }}
    >
      {STATS.map((s) => (
        <Card key={s.label}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Avatar sx={{ bgcolor: s.color, color: 'common.white', width: 40, height: 40 }}>
                {s.icon}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {s.label}
              </Typography>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {s.value}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
              {s.trend === 'up' ? (
                <TrendUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
              ) : (
                <TrendDownIcon sx={{ color: 'error.main', fontSize: 16 }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: s.trend === 'up' ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {s.delta}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                vs last period
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>

    <Alert severity="info" sx={{ mb: 3 }}>
      📊 Chart components (LineChart, BarChart) will land in <strong>Phase 6</strong> via{' '}
      <code>@mui/x-charts</code>. This MVP focuses on the layout + theme.
    </Alert>

    {/* Layout split */}
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
      }}
    >
      {/* Recent orders */}
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent orders
            </Typography>
            <Chip label="Live" color="success" size="small" variant="outlined" />
          </Stack>
          <Divider sx={{ mb: 1 }} />
          <List disablePadding>
            {RECENT_ORDERS.map((o, i) => (
              <Box key={o.id}>
                {i > 0 && <Divider />}
                <ListItem disableGutters>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                      {o.name.split(' ').map((n) => n[0]).join('')}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle2">{o.name}</Typography>
                        <Chip
                          label={o.status}
                          size="small"
                          color={STATUS_COLOR[o.status]}
                          variant="outlined"
                        />
                      </Stack>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Order {o.id}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {o.total}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              </Box>
            ))}
          </List>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <IconButton size="small" color="primary">
              <ArrowIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Stock alerts */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Stock alerts
          </Typography>
          <Stack spacing={2}>
            {[
              { name: 'iPhone 13 Pro',     stock: 7,  total: 25 },
              { name: 'Sony PS5',          stock: 11, total: 30 },
              { name: 'Logitech Mouse',    stock: 7,  total: 50 },
              { name: 'Cannon EOS',        stock: 5,  total: 20 },
            ].map((p) => {
              const pct = (p.stock / p.total) * 100;
              return (
                <Box key={p.name}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {p.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {p.stock}/{p.total}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    color={pct < 30 ? 'error' : pct < 60 ? 'warning' : 'primary'}
                    sx={{ height: 6, borderRadius: 4 }}
                  />
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  </>
);

// keep IconButton used
