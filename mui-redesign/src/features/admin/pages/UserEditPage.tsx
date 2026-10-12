// Adds two new fields to the admin user edit form:
//   - `phone`   : text input
//   - `avatar`  : URL input + live preview thumbnail
// Both are kept in the local form state and submitted via the existing
// updateUser mutation. The backend's PUT /api/users/:id accepts arbitrary
// fields (admin override), so the extra keys are passed through transparently.
import { useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Switch,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../adminApi';
import { useToast } from '../../../hooks/useToast';
import {
  adminH1Sx,
  adminPanelSx,
  adminSubtitleSx,
  adminTitleRowSx,
} from '../components/adminStyles';

const userSchema = z.object({
  name: z.string().min(2, 'Name is required').max(50),
  email: z.string().email('Invalid email'),
  isAdmin: z.boolean(),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone is too long')
    .optional()
    .or(z.literal('')),
  avatar: z
    .string()
    .trim()
    .url('Must be a valid URL')
    .max(500, 'Avatar URL is too long')
    .optional()
    .or(z.literal('')),
});
type UserFormValues = z.infer<typeof userSchema>;

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

export const UserEditPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: user, isLoading } = useGetUserByIdQuery(id);
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      isAdmin: false,
      phone: '',
      avatar: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone ?? '',
        avatar: user.avatar ?? '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      // Strip empty optional strings so the backend stores `undefined` instead
      // of an empty string for fields the admin didn't fill in.
      const payload = {
        name: values.name,
        email: values.email,
        isAdmin: values.isAdmin,
        ...(values.phone ? { phone: values.phone } : {}),
        ...(values.avatar ? { avatar: values.avatar } : {}),
      };
      await updateUser({ id, payload }).unwrap();
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
  const avatarValue = watch('avatar') || '';
  const initials = (user.name ?? '')
    .trim()
    .split(/\s+/)
    .map((p) => p[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* Title row */}
      <Box sx={adminTitleRowSx}>
        <Box>
          <Typography component="h1" sx={adminH1Sx}>
            Edit user
          </Typography>
          <Typography sx={adminSubtitleSx}>
            ID: {id} · Update account details and role.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            component={RouterLink}
            to="/admin/users"
            variant="outlined"
            sx={secondaryBtnSx}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updating}
            startIcon={updating ? <CircularProgress size={14} color="inherit" /> : null}
            sx={primaryBtnSx}
          >
            Save changes
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
            <Typography sx={overlineSx}>User details</Typography>
            <Stack spacing={2}>
              <TextField
                {...register('name')}
                label="Full name"
                fullWidth
                error={!!formState.errors.name}
                helperText={formState.errors.name?.message}
                disabled={updating}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#818999',
                        pr: 1,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 18 }} />
                    </Box>
                  ),
                }}
              />
              <TextField
                {...register('email')}
                label="Email"
                type="email"
                fullWidth
                error={!!formState.errors.email}
                helperText={formState.errors.email?.message}
                disabled={updating}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#818999',
                        pr: 1,
                      }}
                    >
                      <EmailIcon sx={{ fontSize: 18 }} />
                    </Box>
                  ),
                }}
              />
              <TextField
                {...register('phone')}
                label="Phone"
                fullWidth
                error={!!formState.errors.phone}
                helperText={formState.errors.phone?.message ?? 'Optional'}
                disabled={updating}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#818999',
                        pr: 1,
                      }}
                    >
                      <PhoneIcon sx={{ fontSize: 18 }} />
                    </Box>
                  ),
                }}
              />
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ p: 2.5 }}>
            <Typography sx={overlineSx}>Avatar</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  border: '1px dashed #d4d8e0',
                  bgcolor: '#f7f8fa',
                  display: 'grid',
                  placeItems: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {avatarValue ? (
                  <Box
                    component="img"
                    src={avatarValue}
                    alt={user.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      // graceful fallback if the URL 404s
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon sx={{ fontSize: 22, color: '#b6bcc8' }} />
                )}
              </Box>
              <TextField
                {...register('avatar')}
                label="Avatar URL"
                placeholder="https://…"
                fullWidth
                error={!!formState.errors.avatar}
                helperText={
                  formState.errors.avatar?.message ?? 'Paste an image URL (https://…)'
                }
                disabled={updating}
                sx={fieldSx}
              />
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ p: 2.5 }}>
            <Typography sx={overlineSx}>Permissions</Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                py: 1,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AdminIcon sx={{ fontSize: 16, color: isAdminValue ? '#e65f3b' : '#818999' }} />
                  <Typography
                    sx={{
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                      color: '#242b39',
                    }}
                  >
                    Administrator
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: 10, color: '#818999', mt: 0.5 }}>
                  Admins can manage products, orders, users, and coupons.
                </Typography>
              </Box>
              <Switch
                {...register('isAdmin')}
                defaultChecked={user.isAdmin}
                disabled={updating}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#e65f3b' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: '#e65f3b',
                  },
                }}
              />
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                onClick={() => navigate('/admin/users')}
                disabled={updating}
                sx={secondaryBtnSx}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={updating}
                startIcon={updating ? <CircularProgress size={14} color="inherit" /> : null}
                sx={primaryBtnSx}
              >
                Save changes
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* RIGHT — meta panel */}
        <Stack spacing={2.125}>
          <Box sx={adminPanelSx}>
            <Typography sx={overlineSx}>Profile</Typography>
            <Stack alignItems="center" spacing={1.5} sx={{ py: 1.5 }}>
              <Avatar
                src={user.avatar}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: isAdminValue ? '#e65f3b' : '#5e6057',
                  fontSize: 28,
                  fontWeight: 800,
                  fontFamily: '"Manrope", sans-serif',
                }}
              >
                {initials || '?'}
              </Avatar>
              <Stack alignItems="center" spacing={0.25}>
                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#242b39',
                  }}
                >
                  {user.name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#818999' }}>
                  {user.email}
                </Typography>
                {user.phone && (
                  <Typography sx={{ fontSize: 11, color: '#818999' }}>
                    {user.phone}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Box>

          <Box sx={adminPanelSx}>
            <Typography sx={overlineSx}>Role</Typography>
            <Stack spacing={1.25}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 11, color: '#5e6057' }}>Status</Typography>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#242b39' }}>
                  {isAdminValue ? 'Administrator' : 'Customer'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 11, color: '#5e6057' }}>User ID</Typography>
                <Typography
                  sx={{
                    fontSize: 10,
                    fontFamily: 'monospace',
                    color: '#5e6057',
                    maxWidth: 180,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user._id}
                </Typography>
              </Box>
              <Divider />
              <Typography sx={{ fontSize: 10, color: '#818999' }}>
                Save to apply role changes immediately.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
