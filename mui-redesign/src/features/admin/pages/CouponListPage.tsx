import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  Button,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
} from '../adminApi';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusPill } from '../../../components/feedback/StatusPill';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { useToast } from '../../../hooks/useToast';
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
import type { Coupon } from '../types';

const couponPill = (c: Coupon): { label: string; tone: PillTone } => {
  if (c.expiresAt && new Date(c.expiresAt) < new Date()) {
    return { label: 'Expired', tone: 'error' };
  }
  return c.isActive
    ? { label: 'Active', tone: 'success' }
    : { label: 'Inactive', tone: 'neutral' };
};

export const CouponListPage = () => {
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { data: coupons, isLoading } = useGetAllCouponsQuery();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();

  if (isLoading) {
    return <LoadingState variant="card" count={2} />;
  }

  const all = coupons ?? [];

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

  return (
    <>
      <Box sx={adminTitleRowSx}>
        <Box>
          <Typography component="h1" sx={adminH1Sx}>
            Coupons
          </Typography>
          <Typography sx={adminSubtitleSx}>
            Manage discount codes and promotional campaigns.
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/admin/coupons/new"
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
          + Create coupon
        </Button>
      </Box>

      <Box sx={adminPanelSx}>
        <Box sx={adminPanelHeadSx}>
          <Box>
            <Typography component="h2" sx={adminPanelH2Sx}>
              All coupons
            </Typography>
            <Typography sx={adminPanelDescSx}>
              Active and inactive discount codes
            </Typography>
          </Box>
        </Box>

        {all.length === 0 ? (
          <Box sx={adminEmptySx}>
            <Typography sx={adminEmptyTitleSx}>No coupons yet</Typography>
            <Typography sx={adminEmptyDescSx}>
              Create your first coupon to offer discounts at checkout.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={adminTableSx}>
              <Box component="thead">
                <Box component="tr">
                  {['Code', 'Description', 'Type', 'Min order', 'Usage', 'Status', 'Action'].map(
                    (h) => (
                      <Box component="th" key={h} sx={adminThSx}>
                        {h}
                      </Box>
                    ),
                  )}
                </Box>
              </Box>
              <Box component="tbody">
                {all.map((c) => {
                  const pill = couponPill(c);
                  return (
                    <Box component="tr" key={c._id}>
                      <Box component="td" sx={adminTdFirstSx}>
                        <Typography
                          component="strong"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: 1,
                            fontSize: 10,
                          }}
                        >
                          {c.code}
                        </Typography>
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {c.description || '—'}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {c.type === 'percentage' ? `${c.value}% off` : `$${c.value} off`}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {c.minOrderAmount ? `$${c.minOrderAmount}` : '—'}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        {c.usageLimit
                          ? `${c.usageCount} / ${c.usageLimit}`
                          : `${c.usageCount} / ∞`}
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        <StatusPill label={pill.label} tone={pill.tone} />
                      </Box>
                      <Box component="td" sx={adminTdSx}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box
                            component={RouterLink}
                            to={`/admin/coupons/${c._id}/edit`}
                            sx={adminLinkSx}
                          >
                            Edit
                          </Box>
                          <Box
                            component="button"
                            onClick={() => setConfirmDelete(c._id)}
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
        title="Delete coupon?"
        message="This coupon will be permanently removed. Users who have already used it keep their discount."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
};
