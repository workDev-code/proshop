import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { LocalOffer as CouponIcon, Close as CloseIcon } from '@mui/icons-material';
import { couponSchema, type CouponFormValues } from '../schemas';
import { useValidateCouponMutation } from '../../orders/orderApi';
import { useCart } from '../../cart/hooks';
import { useToast } from '../../../hooks/useToast';
import type { CartCoupon } from '../../cart/types';

interface Props {
  /** Hide when cart is empty */
  disabled?: boolean;
}

export const CouponInput = ({ disabled }: Props) => {
  const toast = useToast();
  const { coupon, setCoupon, unsetCoupon, totals } = useCart();
  const [validateCoupon, { isLoading }] = useValidateCouponMutation();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (values: CouponFormValues) => {
    setError(null);
    try {
      const validated = await validateCoupon({
        code: values.code,
        subtotal: totals.itemsPrice,
      }).unwrap();
      const c: CartCoupon = {
        code: validated.code,
        description: validated.description,
        type: validated.type,
        value: validated.value,
        discount: validated.discount,
        finalSubtotal: validated.finalSubtotal,
      };
      setCoupon(c);
      toast.success(`Coupon applied! You saved $${validated.discount.toFixed(2)}`);
      reset();
    } catch (err) {
      const e = err as { data?: { message?: string } };
      const msg = e.data?.message ?? 'Invalid coupon code';
      setError(msg);
      toast.error(msg);
    }
  };

  if (coupon) {
    return (
      <Alert
        icon={<CouponIcon />}
        severity="success"
        action={
          <Chip
            label="Remove"
            onClick={() => {
              unsetCoupon();
              toast.info('Coupon removed');
            }}
            color="success"
            variant="outlined"
            size="small"
            deleteIcon={<CloseIcon />}
          />
        }
        sx={{ alignItems: 'center' }}
      >
        <Box>
          <strong>{coupon.code}</strong> applied —
          {coupon.type === 'percentage'
            ? ` ${coupon.value}% off`
            : ` $${coupon.value.toFixed(2)} off`}{' '}
          (saved ${coupon.discount.toFixed(2)})
        </Box>
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" alignItems="flex-start" spacing={1}>
        <TextField
          {...register('code')}
          placeholder="Coupon code"
          size="small"
          fullWidth
          disabled={disabled || isLoading}
          error={!!formState.errors.code || !!error}
          helperText={formState.errors.code?.message ?? error ?? ' '}
          InputProps={{
            startAdornment: (
              <CouponIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
            ),
          }}
          inputProps={{ style: { textTransform: 'uppercase' } }}
        />
        <Button
          type="submit"
          variant="outlined"
          disabled={disabled || isLoading}
          startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{ minWidth: 100 }}
        >
          {isLoading ? 'Applying' : 'Apply'}
        </Button>
      </Stack>
      <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
        Try one of the seed coupons (see backend README): WELCOME10, FREESHIP, SAVE20
      </Box>
    </Box>
  );
};
