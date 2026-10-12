import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Stack,
  Grid2 as Grid,
  CircularProgress,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Receipt as OrdersIcon,
  AdminPanelSettings as AdminIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { profileSchema, type ProfileFormValues } from '../schemas';
import { useCurrentUser } from '../../auth/hooks';
import { useGetMyOrdersQuery } from '../../orders/orderApi';
import { useUpdateProfileMutation } from '../../auth/authApi';
import { useToast } from '../../../hooks/useToast';
import { PriceDisplay } from '../../products/components/PriceDisplay';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { fmtDate } from '../../../utils/fmt';



export const ProfilePage = () => {
  const toast = useToast();
  const { user } = useCurrentUser();
  const [tab, setTab] = useState(0);

  if (!user) return null;

  return (
    <Box>
      <PageHeader
        title="My Profile"
        subtitle="Manage your account and view your order history"
        icon={<PersonIcon />}
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: 'primary.main',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {user.name
                .trim()
                .split(/\s+/)
                .map((p) => p[0] ?? '')
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {user.name}
                </Typography>
                {user.isAdmin && (
                  <Chip
                    label="Admin"
                    color="primary"
                    size="small"
                    icon={<AdminIcon />}
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab icon={<PersonIcon />} iconPosition="start" label="Profile" />
          <Tab icon={<OrdersIcon />} iconPosition="start" label="Orders" />
        </Tabs>

        <CardContent>
          {tab === 0 && <ProfileTab userId={user._id} name={user.name} email={user.email} onSaved={() => toast.success('Profile updated')} />}
          {tab === 1 && <OrdersTab />}
        </CardContent>
      </Card>
    </Box>
  );
};

const ProfileTab = ({
  userId: _userId,
  name,
  email,
  onSaved,
}: {
  userId: string;
  name: string;
  email: string;
  onSaved: () => void;
}) => {
  const toast = useToast();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const { register, handleSubmit, formState, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name, email, password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const payload: { name: string; email: string; password?: string } = {
        name: values.name,
        email: values.email,
      };
      if (values.password && values.password.length > 0) {
        payload.password = values.password;
      }
      await updateProfile(payload).unwrap();
      reset({ name: values.name, email: values.email, password: '', confirmPassword: '' });
      onSaved();
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Failed to update profile');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        Edit profile
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('name')}
            label="Full name"
            fullWidth
            error={!!formState.errors.name}
            helperText={formState.errors.name?.message}
            disabled={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('email')}
            label="Email"
            type="email"
            fullWidth
            error={!!formState.errors.email}
            helperText={formState.errors.email?.message}
            disabled={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }}>
            <Chip label="Change password (optional)" size="small" />
          </Divider>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('password')}
            label="New password"
            type="password"
            fullWidth
            autoComplete="new-password"
            error={!!formState.errors.password}
            helperText={formState.errors.password?.message ?? 'Leave empty to keep current password'}
            disabled={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('confirmPassword')}
            label="Confirm new password"
            type="password"
            fullWidth
            autoComplete="new-password"
            error={!!formState.errors.confirmPassword}
            helperText={formState.errors.confirmPassword?.message}
            disabled={isLoading}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isLoading ? 'Saving…' : 'Save changes'}
        </Button>
      </Box>
    </Box>
  );
};

const OrdersTab = () => {
  const { data: orders, isLoading } = useGetMyOrdersQuery();

  if (isLoading) return <LoadingState variant="list" count={3} />;
  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="When you place an order, it will appear here."
        action={{
          label: 'Start shopping',
          onClick: () => (window.location.href = '/'),
        }}
      />
    );
  }

  return (
    <Box>
      <Stack spacing={1.5}>
        {orders.slice(0, 5).map((o) => (
          <Card key={o._id} variant="outlined">
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    Order
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    #{o._id.slice(-8).toUpperCase()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body2">{fmtDate(o.createdAt)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Total
                  </Typography>
                  <PriceDisplay value={o.totalPrice} variant="body2" color="primary.main" />
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body2">
                    {o.isDelivered ? 'Delivered' : o.isPaid ? 'Paid' : 'Pending'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <Button
                    component={RouterLink}
                    to={`/orders/${o._id}`}
                    variant="outlined"
                    size="small"
                    endIcon={<ArrowIcon />}
                    fullWidth
                  >
                    View
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>
      {orders.length > 5 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button component={RouterLink} to="/orders" variant="text">
            View all orders →
          </Button>
        </Box>
      )}
    </Box>
  );
};

