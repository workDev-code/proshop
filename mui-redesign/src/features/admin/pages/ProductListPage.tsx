import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Stack,
  TextField,
  Chip,
  InputAdornment,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory2 as ProductsIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContainer } from '../../../components/layout/PageContainer';
import { AdminSubNav } from '../components/AdminSubNav';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PriceDisplay } from '../../products/components/PriceDisplay';
import { OutOfStockChip, LowStockChip, InStockChip } from '../../../components/feedback';
import { useGetProductsQuery } from '../../products/productApi';
import { useDeleteProductMutation } from '../adminApi';
import { useToast } from '../../../hooks/useToast';


export const ProductListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { data, isLoading } = useGetProductsQuery(undefined);
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const filtered = data?.products.filter((p) =>
    [p.name, p.brand, p.category].some((f) =>
      f.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted');
      setConfirmDelete(null);
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Failed to delete product');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Product',
      flex: 2,
      minWidth: 240,
      renderCell: ({ row }: any) => (
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              bgcolor: 'action.hover',
              display: 'grid',
              placeItems: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: 'text.secondary',
              flexShrink: 0,
            }}
          >
            {row.name[0]?.toUpperCase()}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.brand} · {row.category}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderCell: ({ value }: any) => <PriceDisplay value={value} variant="body2" color="primary.main" />,
    },
    {
      field: 'countInStock',
      headerName: 'Stock',
      width: 140,
      renderCell: ({ value }: any) => value === 0 ? <OutOfStockChip /> : value <= 5 ? <LowStockChip label={`${value} left`} /> : <InStockChip />,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 110,
      renderCell: ({ row }: any) => (
        <Chip
          label={`⭐ ${row.rating.toFixed(1)} (${row.numReviews})`}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: '_id',
      headerName: 'Actions',
      type: 'actions',
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Edit product">
              <EditIcon />
            </Tooltip>
          }
          label="Edit"
          onClick={() => navigate(`/admin/products/${row._id}/edit`)}
          sx={{ color: 'primary.main' }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={
            <Tooltip title="Delete product">
              <DeleteIcon />
            </Tooltip>
          }
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
        title="Products"
        subtitle={`${data?.products.length ?? 0} products in catalog`}
        icon={<ProductsIcon />}
        actions={
          <Button
            component={RouterLink}
            to="/admin/products/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add product
          </Button>
        }
      />

      <AdminSubNav />

      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Search by name, brand, or category…"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: '100%', sm: 360 } }}
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
          }}
        />
      </Box>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete product?"
        message="This product will be permanently removed from your store. Any order history referencing this product will keep the snapshot data but the live link will break."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </PageContainer>
  );
};
