import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack, TextField, Button, Typography, Grid2 as Grid } from '@mui/material';
import { LocalShipping as ShippingIcon } from '@mui/icons-material';
import { shippingSchema, type ShippingFormValues } from '../schemas';
import { useCart } from '../../cart/hooks';
import { useToast } from '../../../hooks/useToast';

interface Props {
  onNext: () => void;
}

export const ShippingForm = ({ onNext }: Props) => {
  const toast = useToast();
  const { shippingAddress, saveShipping } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shippingAddress ?? {
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
  });

  const onSubmit = (values: ShippingFormValues) => {
    saveShipping(values);
    toast.success('Shipping address saved');
    onNext();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <ShippingIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Shipping address
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            {...register('address')}
            label="Street address"
            fullWidth
            autoComplete="street-address"
            error={!!errors.address}
            helperText={errors.address?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('city')}
            label="City"
            fullWidth
            autoComplete="address-level2"
            error={!!errors.city}
            helperText={errors.city?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('postalCode')}
            label="Postal code"
            fullWidth
            autoComplete="postal-code"
            error={!!errors.postalCode}
            helperText={errors.postalCode?.message}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            {...register('country')}
            label="Country"
            fullWidth
            autoComplete="country-name"
            error={!!errors.country}
            helperText={errors.country?.message}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          Continue to payment
        </Button>
      </Box>
    </Box>
  );
};
