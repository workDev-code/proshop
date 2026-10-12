import { useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Typography,
  Grid2 as Grid,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { ArrowBack as BackIcon, Group as UsersIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContainer } from '../../../components/layout/PageContainer';
import { AdminSubNav } from '../components/AdminSubNav';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../adminApi';
import { useToast } from '../../../hooks/useToast';

const userSchema = z.object({
  name: z.string().min(2, 'Name is required').max(50),
  email: z.string().email('Invalid email'),
  isAdmin: z.boolean(),
});
type UserFormValues = z.infer<typeof userSchema>;

export const UserEditPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: user, isLoading } = useGetUserByIdQuery(id);
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const { register, handleSubmit, reset, watch, formState } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', isAdmin: false },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email, isAdmin: user.isAdmin });
    }
  }, [user, reset]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      await updateUser({ id, payload: values }).unwrap();
      toast.success('User updated');
      navigate('/admin/users');
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Failed to update user');
    }
  };

  if (isLoading) return <LoadingState variant="detail" />;
  if (!user) return <Alert severity="error">User not found</Alert>;

  const isAdminValue = watch('isAdmin');
  const initials = (user.name ?? '')
    .trim()
    .split(/\s+/)
    .map((p) => p[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <PageContainer>
      <Button
        component={RouterLink}
        to="/admin/users"
        startIcon={<BackIcon />}
        size="small"
        sx={{ mb: 2 }}
      >
        Back to users
      </Button>

      <PageHeader
        title="Edit user"
        subtitle={`ID: ${id}`}
        icon={<UsersIcon />}
      />

      <AdminSubNav />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack alignItems="center" spacing={2} sx={{ py: 2 }}>
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    bgcolor: isAdminValue ? 'primary.main' : 'secondary.main',
                    fontSize: 36,
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </Avatar>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6">{user.name}</Typography>
                  {isAdminValue && <AdminIcon color="primary" />}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  User details
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    {...register('name')}
                    label="Full name"
                    fullWidth
                    error={!!formState.errors.name}
                    helperText={formState.errors.name?.message}
                    disabled={updating}
                  />
                  <TextField
                    {...register('email')}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!formState.errors.email}
                    helperText={formState.errors.email?.message}
                    disabled={updating}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        {...register('isAdmin')}
                        defaultChecked={user.isAdmin}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Administrator
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Admins can manage products, orders, users, and coupons.
                        </Typography>
                      </Box>
                    }
                  />
                </Stack>
                <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button onClick={() => navigate('/admin/users')} disabled={updating}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={updating}
                    startIcon={updating ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    Save changes
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};
