import { useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Grid2 as Grid,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Typography,
  Divider,
} from '@mui/material';
import { ArrowBack as BackIcon, LocalOffer as CouponsIcon } from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { AdminSubNav } from '../components/AdminSubNav';
import { LoadingState } from '../../../components/feedback/LoadingState';
import {
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from '../adminApi';
import { useToast } from '../../../hooks/useToast';

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
    const payload: any = { ...values };
    // Strip empty optional fields
    if (!values.description) delete payload.description;
    if (!values.maxDiscount) delete payload.maxDiscount;
    if (!values.usageLimit) delete payload.usageLimit;
    if (!values.perUserLimit) delete payload.perUserLimit;
    if (!values.startDate) delete payload.startDate;
    if (!values.expiresAt) delete payload.expiresAt;

    try {
      if (isEdit && id) {
        await updateCoupon({ id, payload }).unwrap();
        toast.success('Coupon updated');
      } else {
        const created = await createCoupon(payload).unwrap();
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

  return (
    <Box>
      <Button
        component={RouterLink}
        to="/admin/coupons"
        startIcon={<BackIcon />}
        size="small"
        sx={{ mb: 2 }}
      >
        Back to coupons
      </Button>

      <PageHeader
        title={isEdit ? 'Edit coupon' : 'New coupon'}
        icon={<CouponsIcon />}
      />

      <AdminSubNav />

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  Coupon details
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    {...register('code')}
                    label="Code"
                    fullWidth
                    error={!!formState.errors.code}
                    helperText={formState.errors.code?.message ?? 'Uppercase, e.g. WELCOME10'}
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                    disabled={isEdit}
                  />
                  <TextField
                    {...register('description')}
                    label="Description (optional)"
                    fullWidth
                    error={!!formState.errors.description}
                    helperText={formState.errors.description?.message}
                  />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
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
                          >
                            <MenuItem value="percentage">Percentage (%)</MenuItem>
                            <MenuItem value="fixed">Fixed amount ($)</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        {...register('value')}
                        label={type === 'percentage' ? 'Discount %' : 'Discount $'}
                        type="number"
                        fullWidth
                        inputProps={{ step: '0.01', min: 0 }}
                        error={!!formState.errors.value}
                        helperText={formState.errors.value?.message}
                      />
                    </Grid>
                    {type === 'percentage' && (
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          {...register('maxDiscount')}
                          label="Max discount $ (cap)"
                          type="number"
                          fullWidth
                          inputProps={{ step: '0.01', min: 0 }}
                          helperText="Optional"
                        />
                      </Grid>
                    )}
                  </Grid>
                  <Divider />
                  <Typography variant="overline" color="text.secondary">
                    Restrictions
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        {...register('minOrderAmount')}
                        label="Minimum order $"
                        type="number"
                        fullWidth
                        inputProps={{ step: '0.01', min: 0 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        {...register('usageLimit')}
                        label="Total usage limit"
                        type="number"
                        fullWidth
                        inputProps={{ min: 1 }}
                        helperText="Leave empty for unlimited"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        {...register('perUserLimit')}
                        label="Per-user limit"
                        type="number"
                        fullWidth
                        inputProps={{ min: 1 }}
                        helperText="Leave empty for unlimited"
                      />
                    </Grid>
                  </Grid>
                  <Divider />
                  <Typography variant="overline" color="text.secondary">
                    Schedule
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        {...register('startDate')}
                        label="Start date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        {...register('expiresAt')}
                        label="Expires at"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
                <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button onClick={() => navigate('/admin/coupons')} disabled={creating || updating}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={creating || updating}
                    startIcon={creating || updating ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    {isEdit ? 'Save changes' : 'Create coupon'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  Status
                </Typography>
                <FormControlLabel
                  control={<Switch {...register('isActive')} defaultChecked color="primary" />}
                  label={watch('isActive') ? 'Active' : 'Inactive'}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Inactive coupons cannot be applied at checkout but remain in the system.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
