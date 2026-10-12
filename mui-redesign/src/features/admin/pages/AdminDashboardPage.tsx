import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2 as Grid,
  Stack,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Inventory2 as ProductsIcon,
  Receipt as OrdersIcon,
  AttachMoney as RevenueIcon,
  People as UsersIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { AdminSubNav } from '../components/AdminSubNav';
import { StatCard } from '../components/StatCard';
import { PriceDisplay } from '../../products/components/PriceDisplay';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { RevenueChart, OrdersChart, TopProductsChart, CategoryChart } from '../components/charts';
import {
  useGetAllOrdersQuery,
  useGetAllUsersQuery,
} from '../adminApi';
import { useGetProductsQuery, useGetTopProductsQuery } from '../../products/productApi';
import type { Product } from '../../products/types';
import { formatCurrency } from '../../cart/cartUtils';

export const AdminDashboardPage = () => {
  const { data: orders, isLoading: ordersLoading } = useGetAllOrdersQuery();
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: products, isLoading: productsLoading } = useGetProductsQuery(undefined);
  const { data: topProducts } = useGetTopProductsQuery(undefined);

  const isLoading = ordersLoading || usersLoading || productsLoading;

  // Compute stats
  const totalRevenue = orders
    ?.filter((o) => o.isPaid)
    .reduce((sum, o) => sum + o.totalPrice, 0) ?? 0;
  const paidOrders = orders?.filter((o) => o.isPaid).length ?? 0;
  const pendingOrders = orders?.filter((o) => !o.isPaid).length ?? 0;
  const outOfStock = products?.products.filter((p: any) => p.countInStock === 0).length ?? 0;
  const lowStock = products?.products.filter((p: any) => p.countInStock > 0 && p.countInStock <= 5).length ?? 0;

  const recentOrders = orders?.slice(0, 5) ?? [];
  const stockAlerts = products?.products
    .filter((p: any) => p.countInStock <= 5)
    .sort((a: any, b: any) => a.countInStock - b.countInStock)
    .slice(0, 5) ?? [];

  return (
    <Box>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of your store performance"
        icon={<AdminIcon />}
      />

      <AdminSubNav />

      {isLoading ? (
        <LoadingState variant="card" count={4} />
      ) : (
        <>
          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <StatCard
                label="Revenue"
                value={formatCurrency(totalRevenue)}
                icon={<RevenueIcon />}
                color="success.main"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <StatCard
                label="Orders"
                value={orders?.length ?? 0}
                icon={<OrdersIcon />}
                color="primary.main"
                trend={{ delta: `${paidOrders} paid · ${pendingOrders} pending`, direction: 'up' }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <StatCard
                label="Products"
                value={products?.total ?? 0}
                icon={<ProductsIcon />}
                color="info.main"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <StatCard
                label="Users"
                value={users?.length ?? 0}
                icon={<UsersIcon />}
                color="warning.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <Card sx={{ height: '100%', bgcolor: outOfStock > 0 ? 'error.lighter' : 'background.paper' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'error.lighter',
                        color: 'error.main',
                      }}
                    >
                      <WarningIcon />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                        Stock alerts
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {outOfStock} out · {lowStock} low
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <RevenueChart orders={orders} days={30} />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <CategoryChart products={products?.products ?? []} />
            </Grid>
            <Grid size={{ xs: 12, lg: 8 }}>
              <OrdersChart orders={orders} days={30} />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <TopProductsChart products={products?.products ?? []} />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Recent orders */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Recent orders
                    </Typography>
                    <Button
                      component={RouterLink}
                      to="/admin/orders"
                      size="small"
                      endIcon={<ArrowIcon />}
                    >
                      View all
                    </Button>
                  </Stack>
                  {recentOrders.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No orders yet
                    </Typography>
                  ) : (
                    <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
                      {recentOrders.map((o) => {
                        const userObj = typeof o.user === 'object' ? o.user : null;
                        return (
                          <Box
                            key={o._id}
                            component={RouterLink}
                            to={`/orders/${o._id}`}
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: '1fr auto auto',
                              gap: 2,
                              alignItems: 'center',
                              py: 1.5,
                              textDecoration: 'none',
                              color: 'text.primary',
                              '&:hover': { bgcolor: 'action.hover' },
                              px: 1,
                              borderRadius: 1,
                            }}
                          >
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                #{o._id.slice(-8).toUpperCase()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {userObj ? userObj.name : 'Unknown user'} ·{' '}
                                {new Date(o.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <PriceDisplay
                              value={o.totalPrice}
                              variant="body2"
                              color="primary.main"
                            />
                            <Chip
                              label={o.isPaid ? 'Paid' : 'Pending'}
                              color={o.isPaid ? 'success' : 'warning'}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Top products */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TrendingIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Top rated products
                      </Typography>
                    </Stack>
                    <Button
                      component={RouterLink}
                      to="/admin/products"
                      size="small"
                      endIcon={<ArrowIcon />}
                    >
                      Manage
                    </Button>
                  </Stack>
                  {!topProducts || topProducts.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No products yet
                    </Typography>
                  ) : (
                    <Stack spacing={1.5}>
                      {topProducts?.map((p: Product, i: number) => (
                        <Stack
                          key={p._id}
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          component={RouterLink}
                          to={`/admin/products/${p._id}/edit`}
                          sx={{
                            textDecoration: 'none',
                            color: 'text.primary',
                            p: 1,
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: 1,
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: 14,
                              fontWeight: 700,
                            }}
                          >
                            {i + 1}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                              {p.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {p.brand} · ⭐ {p.rating.toFixed(1)} · Stock: {p.countInStock}
                            </Typography>
                          </Box>
                          <PriceDisplay value={p.price} variant="body2" color="primary.main" />
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Stock alerts */}
            {stockAlerts.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <WarningIcon color="warning" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Low / out of stock
                        </Typography>
                      </Stack>
                      <Button
                        component={RouterLink}
                        to="/admin/products"
                        size="small"
                        endIcon={<ArrowIcon />}
                      >
                        Restock
                      </Button>
                    </Stack>
                    <Grid container spacing={1}>
                      {stockAlerts.map((p) => (
                        <Grid key={p._id} size={{ xs: 12, sm: 6, md: 4 }}>
                          <Alert
                            severity={p.countInStock === 0 ? 'error' : 'warning'}
                            icon={false}
                            sx={{ alignItems: 'center' }}
                          >
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                                  {p.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {p.brand}
                                </Typography>
                              </Box>
                              <Chip
                                label={p.countInStock === 0 ? 'OUT' : `${p.countInStock} left`}
                                color={p.countInStock === 0 ? 'error' : 'warning'}
                                size="small"
                                sx={{ fontWeight: 700, ml: 1 }}
                              />
                            </Stack>
                          </Alert>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};
