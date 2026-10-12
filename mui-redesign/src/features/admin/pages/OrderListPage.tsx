import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Receipt as OrdersIcon,
  Visibility as ViewIcon,
  LocalShipping as DeliverIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContainer } from '../../../components/layout/PageContainer';
import { AdminSubNav } from '../components/AdminSubNav';
import { PriceDisplay } from '../../products/components/PriceDisplay';
import {
  useGetAllOrdersQuery,
  useMarkOrderDeliveredMutation,
} from '../adminApi';
import { useToast } from '../../../hooks/useToast';
import { PaidChip, PendingChip, DeliveredChip } from '../../../components/feedback';
import { fmtDate } from '../../../utils/fmt';


export const OrderListPage = () => {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const { data: orders, isLoading } = useGetAllOrdersQuery();
  const [markDelivered, { isLoading: marking }] = useMarkOrderDeliveredMutation();

  const filtered = orders?.filter((o) => {
    const s = search.toLowerCase();
    const userObj = typeof o.user === 'object' ? o.user : null;
    return (
      o._id.toLowerCase().includes(s) ||
      userObj?.name?.toLowerCase().includes(s) ||
      userObj?.email?.toLowerCase().includes(s)
    );
  });

  const handleDeliver = async (id: string) => {
    try {
      await markDelivered(id).unwrap();
      toast.success('Order marked as delivered');
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Failed to mark as delivered');
    }
  };

  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: 'Order ID',
      width: 160,
      renderCell: ({ value }) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          #{value.slice(-8).toUpperCase()}
        </Typography>
      ),
    },
    {
      field: 'user',
      headerName: 'Customer',
      flex: 1,
      minWidth: 180,
      renderCell: ({ value }) => {
        const userObj = typeof value === 'object' ? value : null;
        if (!userObj) return <Typography variant="body2">Unknown</Typography>;
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {userObj.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {userObj.email}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 140,
      renderCell: ({ value }) => (
        <Typography variant="body2">{fmtDate(value)}</Typography>
      ),
    },
    {
      field: 'totalPrice',
      headerName: 'Total',
      width: 120,
      renderCell: ({ value }) => <PriceDisplay value={value} variant="body2" color="primary.main" />,
    },
    {
      field: 'isPaid',
      headerName: 'Paid',
      width: 100,
      renderCell: ({ value }: any) => (value ? <PaidChip /> : <PendingChip />),
    },
    {
      field: 'isDelivered',
      headerName: 'Delivered',
      width: 120,
      renderCell: ({ value, row }: any) => {
        if (value) return <DeliveredChip />;
        if (!row.isPaid) return <PendingChip label="Awaiting payment" />;
        return <DeliveredChip label="Ready to ship" />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 120,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="view"
          icon={<ViewIcon />}
          label="View"
          component={RouterLink as any}
          // @ts-expect-error - typing inline
          to={`/orders/${row._id}`}
          sx={{ color: 'primary.main' }}
        />,
        row.isPaid && !row.isDelivered ? (
          <GridActionsCellItem
            key="deliver"
            icon={<DeliverIcon />}
            label="Mark delivered"
            onClick={() => handleDeliver(row._id)}
            disabled={marking}
            sx={{ color: 'success.main' }}
          />
        ) : null,
      ].filter(Boolean) as any,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Orders"
        subtitle={`${orders?.length ?? 0} total orders`}
        icon={<OrdersIcon />}
      />

      <AdminSubNav />

      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Search by order ID, customer name, or email…"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: '100%', sm: 400 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ height: 620, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <DataGrid
          rows={filtered ?? []}
          columns={columns}
          getRowId={(r) => r._id}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-row:hover': { bgcolor: 'action.hover' },
          }}
        />
      </Box>
    </PageContainer>
  );
};
