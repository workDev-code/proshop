import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import {
  Receipt as OrdersIcon,
  FavoriteBorder as WishlistIcon,
  Logout as LogoutIcon,
  ArrowForward as ArrowIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { profileSchema, type ProfileFormValues } from '../schemas';
import { useCurrentUser } from '../../auth/hooks';
import { useUpdateProfileMutation, useLogoutMutation } from '../../auth/authApi';
import { useToast } from '../../../hooks/useToast';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 999,
    fontSize: 14,
    bgcolor: 'background.paper',
  },
  '& .MuiOutlinedInput-input': {
    py: 1.5,
  },
  '& .MuiInputLabel-root': {
    fontSize: 13,
  },
};

const fieldErrorSx = {
  '& .MuiOutlinedInput-root.Mui-error': { borderColor: 'error.main' },
  '& .MuiFormHelperText-root.Mui-error': { ml: 2, fontSize: 11 },
};

/**
 * Profile / account page.
 *
 * Layout (matches editorial 2-col pattern):
 *   [editorial header — kicker "Account" + h1 "Your profile"]
 *   [LEFT card — profile form (name, email, password, confirm)]
 *   [RIGHT card — quick links (orders, wishlist, sign out)]
 */
export const ProfilePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useCurrentUser();
  const [logout] = useLogoutMutation();

  if (!user) return null;

  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((p) => p[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.info('Signed out');
      navigate('/login', { replace: true });
    } catch {
      // server may not be reachable; navigate anyway
      toast.info('Signed out');
      navigate('/login', { replace: true });
    }
  };

  return (
    <Box sx={{ pt: { xs: 2, md: 3.5 } }}>
      {/* Editorial header */}
      <Box sx={{ mb: { xs: 3, md: 4.5 } }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.25,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'secondary.main',
            mb: 1.25,
          }}
        >
          <Box sx={{ width: 24, height: 1, bgcolor: 'currentColor' }} />
          Account
        </Box>
        <Typography
          component="h1"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.75rem, 3vw, 2.375rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            color: 'text.primary',
            m: 0,
          }}
        >
          Your profile
        </Typography>
        <Typography sx={{ mt: 1.25, fontSize: 13, color: 'text.secondary' }}>
          {user.email}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.6fr) minmax(0, 1fr)' },
          gap: { xs: 2.5, md: 3 },
          alignItems: 'flex-start',
        }}
      >
        {/* LEFT — profile form */}
        <Card
          sx={{
            borderRadius: 3,
            border: '1px solid rgba(32,33,31,0.08)',
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <ProfileForm
              name={user.name}
              email={user.email}
              onSaved={() => toast.success('Profile updated')}
              onError={(m) => toast.error(m)}
            />
          </CardContent>
        </Card>

        {/* RIGHT — side panel */}
        <Stack spacing={2.5}>
          {/* Account summary */}
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(32,33,31,0.08)',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: 'secondary.main',
                    color: 'common.white',
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {initials || '?'}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {user.name}
                    </Typography>
                    {user.isAdmin && (
                      <Chip
                        icon={<AdminIcon sx={{ fontSize: 12 }} />}
                        label="Admin"
                        size="small"
                        sx={{
                          bgcolor: 'secondary.main',
                          color: 'common.white',
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          height: 20,
                          '& .MuiChip-icon': { color: 'common.white' },
                        }}
                      />
                    )}
                  </Stack>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: 12,
                      mt: 0.25,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(32,33,31,0.08)',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
              <Box
                sx={{
                  px: 2,
                  pt: 1.5,
                  pb: 0.5,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                }}
              >
                Quick links
              </Box>
              <QuickLink
                to="/orders"
                icon={<OrdersIcon sx={{ fontSize: 18 }} />}
                label="My orders"
                hint="Track and view all purchases"
              />
              <QuickLink
                to="/wishlist"
                icon={<WishlistIcon sx={{ fontSize: 18 }} />}
                label="Wishlist"
                hint="Items you've saved for later"
              />
              <Divider sx={{ my: 0.5 }} />
              <Box
                component="button"
                type="button"
                onClick={handleLogout}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  border: 'none',
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'text.secondary',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'background-color 160ms ease, color 160ms ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'error.main',
                  },
                }}
              >
                <LogoutIcon sx={{ fontSize: 18 }} />
                Sign out
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};

const QuickLink = ({
  to,
  icon,
  label,
  hint,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) => (
  <Box
    component={RouterLink}
    to={to}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      px: 2,
      py: 1.5,
      borderRadius: 2,
      textDecoration: 'none',
      color: 'text.primary',
      transition: 'background-color 160ms ease',
      '&:hover': { bgcolor: 'action.hover' },
    }}
  >
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        border: '1px solid',
        borderColor: 'divider',
        display: 'grid',
        placeItems: 'center',
        color: 'secondary.main',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25 }}>
        {hint}
      </Typography>
    </Box>
    <ArrowIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
  </Box>
);

interface ProfileFormProps {
  name: string;
  email: string;
  onSaved: () => void;
  onError: (msg: string) => void;
}

const ProfileForm = ({ name, email, onSaved, onError }: ProfileFormProps) => {
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
      onError(e.data?.message ?? 'Failed to update profile');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <Typography
          component="h2"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 800,
            fontSize: 18,
            color: 'text.primary',
          }}
        >
          Edit profile
        </Typography>
      </Stack>

      <Stack spacing={2}>
        <TextField
          {...register('name')}
          label="Full name"
          fullWidth
          error={!!formState.errors.name}
          helperText={formState.errors.name?.message}
          disabled={isLoading}
          sx={{ ...fieldSx, ...fieldErrorSx }}
        />
        <TextField
          {...register('email')}
          label="Email"
          type="email"
          fullWidth
          error={!!formState.errors.email}
          helperText={formState.errors.email?.message}
          disabled={isLoading}
          sx={{ ...fieldSx, ...fieldErrorSx }}
        />

        <Box sx={{ pt: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <LockIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'text.secondary',
              }}
            >
              Change password (optional)
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <TextField
              {...register('password')}
              label="New password"
              type="password"
              fullWidth
              autoComplete="new-password"
              error={!!formState.errors.password}
              helperText={
                formState.errors.password?.message ?? 'Leave empty to keep your current password'
              }
              disabled={isLoading}
              sx={{ ...fieldSx, ...fieldErrorSx }}
            />
            <TextField
              {...register('confirmPassword')}
              label="Confirm new password"
              type="password"
              fullWidth
              autoComplete="new-password"
              error={!!formState.errors.confirmPassword}
              helperText={formState.errors.confirmPassword?.message}
              disabled={isLoading}
              sx={{ ...fieldSx, ...fieldErrorSx }}
            />
          </Stack>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth
          size="large"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            mt: 1,
            borderRadius: 999,
            px: 2.75,
            py: 1.5,
            fontSize: 13,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { bgcolor: 'secondary.dark' },
          }}
        >
          {isLoading ? 'Saving…' : 'Save changes'}
        </Button>
      </Stack>
    </Box>
  );
};
