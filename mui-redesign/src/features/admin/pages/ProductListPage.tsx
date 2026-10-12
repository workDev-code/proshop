import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  Button,
  InputBase,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useGetProductsQuery } from '../../products/productApi';
import { useDeleteProductMutation } from '../adminApi';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusPill } from '../../../components/feedback/StatusPill';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { useToast } from '../../../hooks/useToast';
import { fmtMoney, fmtNumber } from '../../../utils/fmt';
import {
  adminEmptyDescSx,
  adminEmptySx,
  adminEmptyTitleSx,
  adminFilterRowSx,
  adminH1Sx,
  adminInputSx,
  adminLinkSx,
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
import type { PillTone } from '../../../components/feedback/StatusPill';
import type { Product } from '../../products/types';

const stockPill = (p: Product): { label: string; tone: PillTone } => {
  if (p.countInStock === 0) return { label: 'Out of stock', tone: 'error' };
  if (p.countInStock <= 5) return { label: 'Low stock', tone: 'warning' };
  return { label: 'In stock', tone: 'success' };
};

export const ProductListPage = () => {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { data, isLoading } = useGetProductsQuery(undefined);
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  if (isLoading) {
    return <LoadingState variant="card" count={3} />;
  }

  const products = data?.products ?? [];
  const total = data?.total ?? products.length;
  const active = products.filter((p) => p.countInStock > 0).length;
  const lowStock = products.filter((p) => p.countInStock > 0 && p.countInStock <= 5).length;

  const filtered = products.filter((p) => {
    if (category && p.category !== category) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

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

  return (
    <>
      {/* Title row */}
      <Box sx={adminTitleRowSx}>
        <Box>
          <Typography component="h1" sx={adminH1Sx}>
            Products
          </Typography>
          <Typography sx={adminSubtitleSx}>
            Manage your catalog, stock levels, and product visibility.
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/admin/products/new"
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 14 }} />}
          sx={{
            bgcolor: '#e65f3b',
            '&:hover': { bgcolor: '#d55634' },
            borderRadius: '8px',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'none',
            px: 1.625,
            py: 1.125,
            whiteSpace: 'nowrap',
            color: '#fff',
          }}
        >
          + Add product
        </Button>
      </Box>

      {/* Mini cards */}
      <Box sx={adminMiniGridSx}>
        <Box sx={adminMiniCardSx}>
          <Typography sx={{ fontSize: 10, color: '#818999' }}>Total products</Typography>
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
            {fmtNumber(total)}
          </Typography>
        </Box>
        <Box sx={adminMiniCardSx}>
          <Typography sx={{ fontSize: 10, color: '#818999' }}>Active products</Typography>
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
            {fmtNumber(active)}
          </Typography>
        </Box>
        <Box sx={adminMiniCardSx}>
          <Typography sx={{ fontSize: 10, color: '#818999' }}>Low stock items</Typography>
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
            {fmtNumber(lowStock)}
          </Typography>
        </Box>
      </Box>

      {/* All products */}
      <Box sx={adminPanelSx}>
        <Box sx={adminPanelHeadSx}>
          <Box>
            <Typography component="h2" sx={adminPanelH2Sx}>
              All products
            </Typography>
            <Typography sx={adminPanelDescSx}>Product catalog</Typography>
          </Box>
          <Button
            onClick={() => toast.info('Export preview — wire up when the backend supports it.')}
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
            ↓ Export
          </Button>
        </Box>

        <Stack sx={adminFilterRowSx}>
          <InputBase
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={adminInputSx}
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as string)}
            displayEmpty
            sx={{
              ...adminInputSx,
              '& .MuiSelect-select': { p: 0 },
              minWidth: 160,
              fontSize: 10,
            }}
          >
            <MenuItem value="">All categories</MenuItem>
            {data?.facets?.categories?.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
          <Select
            value=""
            displayEmpty
            sx={{
              ...adminInputSx,
              '& .MuiSelect-select': { p: 0 },
              minWidth: 140,
              fontSize: 10,
            }}
          >
            <MenuItem value="">All status</MenuItem>
            <MenuItem value="active">In stock</MenuItem>
            <MenuItem value="low">Low stock</MenuItem>
            <MenuItem value="out">Out of stock</MenuItem>
          </Select>
        </Stack>

        {filtered.length === 0 ? (
          <Box sx={adminEmptySx}>
            <Typography sx={adminEmptyTitleSx}>No products found</Typography>
            <Typography sx={adminEmptyDescSx}>
              Try adjusting the search or category filter.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={adminTableSx}>
              <Box component="thead">
                <Box component="tr">
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Action'].map((h) => (
                    <Box component="th" key={h} sx={adminThSx}>
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {filtered.map((p) => {
                  const pill = stockPill(p);
                  return (
                    <Box component="tr" key={p._id}>
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
                            {p.image ? (
                              <Box
                                component="img"
                                src={p.image}
                                alt={p.name}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: '#929aaa',
                                }}
                              >
                                {p.name?.[0]?.toUpperCase() ?? '?'}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              component="strong"
                              sx={{ display: 'block', fontSize: 10, fontWeight: 700 }}
                            >
                              {p.name}
                            </Typography>
                            <Typography
                              component="small"
                              sx={{ display: 'block', color: '#929aaa', fontSize: 9, mt: '4px' }}
                            >
                              {p.brand}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {p.category}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {fmtMoney(p.price)}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {fmtNumber(p.countInStock)}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        <StatusPill label={pill.label} tone={pill.tone} />
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box
                            component={RouterLink}
                            to={`/admin/products/${p._id}/edit`}
                            sx={adminLinkSx}
                          >
                            Edit
                          </Box>
                          <Box
                            component="button"
                            onClick={() => setConfirmDelete(p._id)}
                            sx={{
                              ...adminLinkSx,
                              color: '#c84c4c',
                              border: 0,
                              background: 'none',
                              padding: 0,
                              font: 'inherit',
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </Box>
                        </Stack>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete product?"
        message="This product will be permanently removed from your store."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
};
