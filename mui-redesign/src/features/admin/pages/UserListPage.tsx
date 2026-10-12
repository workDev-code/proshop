import { useState, useMemo } from 'react';
import {
  Box,
  Stack,
  InputBase,
  Typography,
  Avatar,
} from '@mui/material';
import { useGetAllUsersQuery } from '../adminApi';
import { useGetAllOrdersQuery } from '../adminApi';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { fmtDate, fmtMoney } from '../../../utils/fmt';
import {
  adminEmptyDescSx,
  adminEmptySx,
  adminEmptyTitleSx,
  adminFilterRowSx,
  adminH1Sx,
  adminInputSx,
  adminMiniCardSx,
  adminMiniGridSx,
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
import type { Order } from '../../orders/types';
import type { User } from '../../auth/types';

const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/** Extract the user id from an order regardless of `user` shape. */
const orderUserId = (o: Order): string | null => {
  if (typeof o.user === 'string') return o.user;
  if (o.user && typeof o.user === 'object') return (o.user as { _id?: string })._id ?? null;
  return null;
};

interface CustomerStats {
  ordersCount: number;
  totalSpent: number;
}

const computeCustomerStats = (orders: Order[] | undefined) => {
  const map = new Map<string, CustomerStats>();
  if (!orders) return map;
  for (const o of orders) {
    const id = orderUserId(o);
    if (!id) continue;
    const cur = map.get(id) ?? { ordersCount: 0, totalSpent: 0 };
    cur.ordersCount += 1;
    cur.totalSpent += o.totalPrice;
    map.set(id, cur);
  }
  return map;
};

export const UserListPage = () => {
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: orders } = useGetAllOrdersQuery();
  const [search, setSearch] = useState('');

  const statsByUser = useMemo(() => computeCustomerStats(orders), [orders]);

  if (usersLoading) {
    return <LoadingState variant="card" count={3} />;
  }

  const allUsers = users ?? [];
  const totalCustomers = allUsers.length;

  // "New this month" — derived from `createdAt` if the backend returns it.
  // If the user model doesn't expose createdAt, fall back to "Data not
  // available" rendering for that card.
  const now = new Date();
  const newThisMonth = allUsers.filter((u) => {
    const u2 = u as User & { createdAt?: string };
    if (!u2.createdAt) return false;
    const d = new Date(u2.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const filtered = allUsers.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <>
      {/* Title row */}
      <Box sx={adminTitleRowSx}>
        <Box>
          <Typography component="h1" sx={adminH1Sx}>
            Customers
          </Typography>
          <Typography sx={adminSubtitleSx}>
            Understand your audience and customer activity.
          </Typography>
        </Box>
      </Box>

      {/* Mini cards */}
      <Box sx={adminMiniGridSx}>
        <Box sx={adminMiniCardSx}>
          <Typography sx={{ fontSize: 10, color: '#818999' }}>Total customers</Typography>
          <Typography
            component="strong"
            sx={{
              display: 'block',
              fontFamily: '"Manrope", sans-serif',
              fontSize: 22,
              fontWeight: 800,
              mt: '9px',
              color: '#242b39',
            }}
          >
            {totalCustomers}
          </Typography>
        </Box>
        <Box sx={adminMiniCardSx}>
          <Typography sx={{ fontSize: 10, color: '#818999' }}>New this month</Typography>
          {allUsers.length > 0 && (allUsers[0] as User & { createdAt?: string }).createdAt ? (
            <Typography
              component="strong"
              sx={{
                display: 'block',
                fontFamily: '"Manrope", sans-serif',
                fontSize: 22,
                fontWeight: 800,
                mt: '9px',
                color: '#242b39',
              }}
            >
              {newThisMonth}
            </Typography>
          ) : (
            <>
              <Typography
                component="strong"
                sx={{
                  display: 'block',
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  mt: '9px',
                  color: '#50596a',
                }}
              >
                Data not available
              </Typography>
              <Typography sx={{ fontSize: 9, color: '#828b9b', mt: 0.5 }}>
                Join dates aren't returned by the backend
              </Typography>
            </>
          )}
        </Box>
        <Box sx={adminMiniCardSx}>
          <Typography sx={{ fontSize: 10, color: '#818999' }}>Repeat purchase rate</Typography>
          <Typography
            component="strong"
            sx={{
              display: 'block',
              fontFamily: '"Manrope", sans-serif',
              fontSize: 16,
              fontWeight: 700,
              mt: '9px',
              color: '#50596a',
            }}
          >
            Data not available
          </Typography>
          <Typography sx={{ fontSize: 9, color: '#828b9b', mt: 0.5 }}>
            Requires a dedicated analytics endpoint
          </Typography>
        </Box>
      </Box>

      {/* Customer directory */}
      <Box sx={adminPanelSx}>
        <Box sx={adminPanelHeadSx}>
          <Box>
            <Typography component="h2" sx={adminPanelH2Sx}>
              Customer directory
            </Typography>
            <Typography sx={adminPanelDescSx}>
              Customer accounts registered to your store
            </Typography>
          </Box>
        </Box>

        <Stack sx={adminFilterRowSx}>
          <InputBase
            placeholder="Search customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ ...adminInputSx, minWidth: 220 }}
          />
        </Stack>

        {filtered.length === 0 ? (
          <Box sx={adminEmptySx}>
            <Typography sx={adminEmptyTitleSx}>No customers found</Typography>
            <Typography sx={adminEmptyDescSx}>
              Try adjusting the search.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={adminTableSx}>
              <Box component="thead">
                <Box component="tr">
                  {['Customer', 'Email', 'Orders', 'Total spent', 'Joined'].map((h) => (
                    <Box component="th" key={h} sx={adminThSx}>
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {filtered.map((u) => {
                  const stats = statsByUser.get(u._id);
                  const uWithDate = u as User & { createdAt?: string };
                  return (
                    <Box component="tr" key={u._id}>
                      <Box component="td" sx={adminTdFirstSx}>
                        <Stack direction="row" alignItems="center" spacing={1.25}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: u.isAdmin ? '#fff0eb' : '#eaf2ff',
                              color: u.isAdmin ? '#dc6241' : '#326bc4',
                              fontSize: 11,
                              fontWeight: 800,
                            }}
                          >
                            {initialsOf(u.name)}
                          </Avatar>
                          <Typography
                            component="strong"
                            sx={{ display: 'block', fontSize: 10, fontWeight: 700 }}
                          >
                            {u.name}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {u.email}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {stats ? stats.ordersCount : 0}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {stats ? fmtMoney(stats.totalSpent) : '$0.00'}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {uWithDate.createdAt ? fmtDate(uWithDate.createdAt) : '—'}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
