import { useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Stack,
  TextField,
  Button,
  MenuItem,
  Switch,
  CircularProgress,
  Typography,
  Divider,
} from '@mui/material';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { useToast } from '../../../hooks/useToast';
import {
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from '../adminApi';
import {
  adminH1Sx,
  adminPanelSx,
  adminSubtitleSx,
  adminTitleRowSx,
} from '../components/adminStyles';

const couponSchema = z
  .object({
    code: z
      .string()
      .min(3, 'Code must be at least 3 chars')
      .max(30)
      .transform((s) => s.toUpperCase().trim()),
    description: z.string().max(200).optional(),
    type: z.enum(['percentage', 'fixed']),
    value: z.coerce.number().min(0.01, 'Value must be > 0'),
    minOrderAmount: z.coerce.number().min(0).default(0),
    maxDiscount: z.coerce.number().min(0).optional(),
    usageLimit: z.coerce.number().int().min(1).optional(),
    perUserLimit: z.coerce.number().int().min(1).optional(),
    startDate: z.string().optional(),
    expiresAt: z.string().optional(),
    isActive: z.boolean().default(true),
  })
  .refine(
    (d) => d.type !== 'percentage' || d.value <= 100,
    { message: 'Percentage must be ≤ 100', path: ['value'] },
  );

type CouponFormValues = z.infer<typeof couponSchema>;

/* ─── shared style tokens (admin edit pages) ─────────────────────── */

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: 13,
    bgcolor: '#fff',
  },
  '& .MuiOutlinedInput-input': {
    py: 1.375,
  },
  '& .MuiInputLabel-root': {
    fontSize: 11,
    fontWeight: 600,
  },
  '& .MuiFormHelperText-root': {
    fontSize: 10,
    mx: 0,
    mt: 0.5,
  },
};

const overlineSx = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: '#818999',
  mb: 1.5,
};

const primaryBtnSx = {
  bgcolor: '#e65f3b',
  '&:hover': { bgcolor: '#d55634' },
  borderRadius: '8px',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'none' as const,
  px: 2,
  py: 1.125,
  color: '#fff',
  whiteSpace: 'nowrap' as const,
};

const secondaryBtnSx = {
  border: '1px solid #e1e5eb',
  bgcolor: '#fff',
  color: '#303747',
  '&:hover': { bgcolor: '#f7f7f9' },
  borderRadius: '8px',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'none' as const,
  px: 2,
  py: 1.125,
  whiteSpace: 'nowrap' as const,
};

const formatPercentValue = (v: number | undefined) =>
  v === undefined || v === null || Number.isNaN(v) ? '—' : `${v}%`;

const formatMoney = (v: number | undefined) =>
  v === undefined || v === null || Number.isNaN(v) ? '—' : `$${v.toFixed(2)}`;

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const CouponEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const { data: coupon, isLoading } = useGetCouponByIdQuery(id ?? '', { skip: !isEdit });
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();

  const { register, handleSubmit, reset, control, watch, formState } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      description: '',
      type: 'percentage',
      value: 10,
      minOrderAmount: 0,
      maxDiscount: undefined,
      usageLimit: undefined,
      perUserLimit: undefined,
      startDate: '',
      expiresAt: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (coupon) {
      reset({
        code: coupon.code,
        description: coupon.description ?? '',
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount ?? 0,
        maxDiscount: coupon.maxDiscount ?? undefined,
        usageLimit: coupon.usageLimit ?? undefined,
        perUserLimit: coupon.perUserLimit ?? undefined,
        startDate: coupon.startDate?.split('T')[0] ?? '',
        expiresAt: coupon.expiresAt?.split('T')[0] ?? '',
        isActive: coupon.isActive,
      });
    }
  }, [coupon, reset]);

  const onSubmit = async (values: CouponFormValues) => {
    const payload: Record<string, unknown> = { ...values };
    // Strip empty optional fields
    if (!values.description) delete payload.description;
    if (!values.maxDiscount) delete payload.maxDiscount;
    if (!values.usageLimit) delete payload.usageLimit;
    if (!values.perUserLimit) delete payload.perUserLimit;
    if (!values.startDate) delete payload.startDate;
    if (!values.expiresAt) delete payload.expiresAt;

    try {
      if (isEdit && id) {
        await updateCoupon({ id, payload: payload as never }).unwrap();
        toast.success('Coupon updated');
      } else {
        const created = await createCoupon(payload as never).unwrap();
        toast.success('Coupon created');
        navigate(`/admin/coupons/${created._id}/edit`, { replace: true });
      }
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Save failed');
    }
  };

  if (isEdit && isLoading) return <LoadingState variant="detail" />;

  const type = watch('type');
  const isActive = watch('isActive');
  const value = watch('value');
  const minOrder = watch('minOrderAmount');
  const code = watch('code');
  const isSaving = creating || updating;

  // Sample savings preview
  const sampleOrderTotal = 100;
  const qualifies = sampleOrderTotal >= (minOrder ?? 0);
  let savings: number | null = null;
  if (qualifies) {
    if (type === 'percentage') {
      const raw = sampleOrderTotal * ((value ?? 0) / 100);
      const max = watch('maxDiscount');
      savings = max && raw > max ? max : raw;
    } else {
      savings = Math.min(value ?? 0, sampleOrderTotal);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* Title row */}
      <Box sx={adminTitleRowSx}>
        <Box>
          <Typography component="h1" sx={adminH1Sx}>
            {isEdit ? 'Edit coupon' : 'New coupon'}
          </Typography>
          <Typography sx={adminSubtitleSx}>
            {isEdit
              ? `ID: ${id} · Update discount rules and schedule.`
              : 'Create a new discount code for your customers.'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            component={RouterLink}
            to="/admin/coupons"
            variant="outlined"
            sx={secondaryBtnSx}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : null}
            sx={primaryBtnSx}
          >
            {isEdit ? 'Save changes' : 'Create coupon'}
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 8fr) minmax(0, 4fr)' },
          gap: 2.125,
        }}
      >
        {/* LEFT — form fields */}
        <Box sx={{ ...adminPanelSx, p: 0 }}>
          <Box sx={{ p: 2.5 }}>
            <Typography sx={overlineSx}>Code</Typography>
            <Stack spacing={2}>
              <TextField
                {...register('code')}
                label="Coupon code"
                fullWidth
                error={!!formState.errors.code}
                helperText={formState.errors.code?.message ?? 'Uppercase, e.g. WELCOME10'}
                inputProps={{ style: { textTransform: 'uppercase' } }}
                disabled={isEdit}
                sx={fieldSx}
              />
              <TextField
                {...register('description')}
                label="Description (optional)"
                fullWidth
                error={!!formState.errors.description}
                helperText={formState.errors.description?.message}
                sx={fieldSx}
              />
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ p: 2.5 }}>
            <Typography sx={overlineSx}>Discount</Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 1.5,
              }}
            >
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Type"
                    fullWidth
                    error={!!formState.errors.type}
                    sx={fieldSx}
                  >
                    <MenuItem value="percentage">Percentage (%)</MenuItem>
                    <MenuItem value="fixed">Fixed amount ($)</MenuItem>
                  </TextField>
                )}
              />
              <TextField
                {...register('value')}
                label={type === 'percentage' ? 'Discount %' : 'Discount $'}
                type="number"
                fullWidth
                inputProps={{ step: '0.01', min: 0 }}
                error={!!formState.errors.value}
                helperText={formState.errors.value?.message}
                sx={fieldSx}
              />
              {type === 'percentage' && (
                <TextField
                  {...register('maxDiscount')}
                  label="Max discount $ (cap)"
                  type="number"
                  fullWidth
                  inputProps={{ step: '0.01', min: 0 }}
                  helperText="Optional"
                  sx={fieldSx}
                />
              )}
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 2.5 }}>
            <Typography sx={overlineSx}>Restrictions</Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1.5,
              }}
            >
              <TextField
                {...register('minOrderAmount')}
                label="Minimum order $"
                type="number"
                fullWidth
                inputProps={{ step: '0.01', min: 0 }}
                sx={fieldSx}
              />
              <TextField
                {...register('usageLimit')}
                label="Total usage limit"
                type="number"
                fullWidth
                inputProps={{ min: 1 }}
                helperText="Leave empty for unlimited"
                sx={fieldSx}
              />
              <TextField
                {...register('perUserLimit')}
                label="Per-user limit"
                type="number"
                fullWidth
                inputProps={{ min: 1 }}
                helperText="Leave empty for unlimited"
                sx={fieldSx}
              />
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 2.5 }}>
            <Typography sx={overlineSx}>Schedule</Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1.5,
              }}
            >
              <TextField
                {...register('startDate')}
                label="Start date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
              <TextField
                {...register('expiresAt')}
                label="Expires at"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                onClick={() => navigate('/admin/coupons')}
                disabled={isSaving}
                sx={secondaryBtnSx}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSaving}
                startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : null}
                sx={primaryBtnSx}
              >
                {isEdit ? 'Save changes' : 'Create coupon'}
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* RIGHT — meta panel */}
        <Stack spacing={2.125}>
          <Box sx={adminPanelSx}>
            <Typography sx={overlineSx}>Status</Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
                py: 1,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 700,
                    fontSize: 13,
                    color: '#242b39',
                  }}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </Typography>
                <Typography sx={{ fontSize: 10, color: '#818999', mt: 0.5 }}>
                  Inactive coupons can't be applied at checkout.
                </Typography>
              </Box>
              <Switch
                {...register('isActive')}
                defaultChecked
                disabled={isSaving}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#e65f3b' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: '#e65f3b',
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={adminPanelSx}>
            <Typography sx={overlineSx}>Preview</Typography>
            <Stack spacing={1.5}>
              <Box
                sx={{
                  bgcolor: '#fafbfc',
                  border: '1px dashed #e1e5eb',
                  borderRadius: '10px',
                  p: 2,
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 800,
                    fontSize: 18,
                    letterSpacing: '0.08em',
                    color: '#e65f3b',
                    mb: 0.5,
                  }}
                >
                  {code || 'CODE'}
                </Typography>
                <Typography sx={{ fontSize: 10, color: '#818999' }}>
                  {type === 'percentage'
                    ? `${value ?? 0}% off your order`
                    : `$${(value ?? 0).toFixed(2)} off your order`}
                </Typography>
              </Box>

              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 10, color: '#818999' }}>Sample order</Typography>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#242b39' }}>
                    {formatMoney(sampleOrderTotal)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 10, color: '#818999' }}>Min. order</Typography>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#242b39' }}>
                    {formatMoney(minOrder)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 10, color: '#818999' }}>Customer saves</Typography>
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: qualifies ? '#17845e' : '#818999',
                    }}
                  >
                    {qualifies ? formatMoney(savings ?? undefined) : 'Below minimum'}
                  </Typography>
                </Box>
                {type === 'percentage' && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 10, color: '#818999' }}>Discount</Typography>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#242b39' }}>
                      {formatPercentValue(value)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Stack>
          </Box>

          {isEdit && coupon && (
            <Box sx={adminPanelSx}>
              <Typography sx={overlineSx}>Schedule</Typography>
              <Stack spacing={0.75}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 10, color: '#818999' }}>Starts</Typography>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#242b39' }}>
                    {formatDate(coupon.startDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 10, color: '#818999' }}>Expires</Typography>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#242b39' }}>
                    {formatDate(coupon.expiresAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 10, color: '#818999' }}>Usage</Typography>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#242b39' }}>
                    {coupon.usageCount}
                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ' (unlimited)'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
