import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  LocalOffer as CouponsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContainer } from '../../../components/layout/PageContainer';
import { AdminSubNav } from '../components/AdminSubNav';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
} from '../adminApi';
import { useToast } from '../../../hooks/useToast';
import { ActiveChip, InactiveChip } from '../../../components/feedback';


export const CouponListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { data: coupons, isLoading } = useGetAllCouponsQuery();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id).unwrap();
      toast.success('Coupon deleted');
      setConfirmDelete(null);
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Failed to delete coupon');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'code',
      headerName: 'Code',
      width: 160,
      renderCell: ({ value }: any) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 220,
      renderCell: ({ value }: any) => (
        <Typography variant="body2" color="text.secondary">
          {value || '—'}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: ({ row }: any) =>
        row.type === 'percentage' ? `${row.value}% off` : `$${row.value} off`,
    },
    {
      field: 'minOrderAmount',
      headerName: 'Min order',
      width: 110,
      renderCell: ({ value }: any) => (value ? `$${value}` : '—'),
    },
    {
      field: 'usageCount',
      headerName: 'Usage',
      width: 110,
      renderCell: ({ row }: any) =>
        row.usageLimit
          ? `${row.usageCount} / ${row.usageLimit}`
          : `${row.usageCount} / ∞`,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: ({ value, row }: any) => {
        const expired = row.expiresAt && new Date(row.expiresAt) < new Date();
        if (expired) return <InactiveChip label="Expired" status="error" />;
        return value ? <ActiveChip /> : <InactiveChip />;
      },
    },
    {
      field: '_id',
      headerName: 'Actions',
      type: 'actions',
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => navigate(`/admin/coupons/${row._id}/edit`)}
          sx={{ color: 'primary.main' }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => setConfirmDelete(row._id)}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Coupons"
        subtitle={`${coupons?.length ?? 0} active coupons`}
        icon={<CouponsIcon />}
        actions={
          <Button
            component={RouterLink}
            to="/admin/coupons/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create coupon
          </Button>
        }
      />

      <AdminSubNav />

      <Box sx={{ height: 620, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <DataGrid
          rows={coupons ?? []}
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

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete coupon?"
        message="This coupon will be permanently removed. Users who have already used it will keep their discount."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </PageContainer>
  );
};
