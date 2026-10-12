import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Link,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from '../schemas';
import { useLoginMutation, useRegisterMutation } from '../authApi';
import { useCurrentUser } from '../hooks';
import { useToast } from '../../../hooks/useToast';

interface Props {
  mode?: 'login' | 'register';
}

const extractError = (err: unknown): string => {
  if (typeof err === 'object' && err !== null) {
    const e = err as { data?: { message?: string }; error?: string };
    return e.data?.message ?? e.error ?? 'Something went wrong. Please try again.';
  }
  return 'Network error. Please check your connection.';
};

export const LoginPage = ({ mode = 'login' }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated, isLoading } = useCurrentUser();
  const isLogin = mode === 'login';
  const [showPw, setShowPw] = useState(false);

  // If already logged in, redirect away from auth pages
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, location.state, navigate]);

  // === LOGIN FORM ===
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const [loginMutate, loginState] = useLoginMutation();

  // === REGISTER FORM ===
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });
  const [registerMutate, registerState] = useRegisterMutation();

  const isSubmitting = loginState.isLoading || registerState.isLoading;
  const apiError = (loginState.error || registerState.error) as
    | { data?: { message?: string } }
    | null;

  const onLogin = async (values: LoginFormValues) => {
    try {
      await loginMutate(values).unwrap();
      toast.success('Welcome back!');
      const from = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  const onRegister = async (values: RegisterFormValues) => {
    try {
      const { confirmPassword: _confirm, ...payload } = values;
      await registerMutate(payload).unwrap();
      toast.success('Account created. Welcome!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: (t) =>
          t.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)'
            : 'linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 100%)',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 440, width: '100%' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: '1.25rem',
              }}
            >
              P
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {isLogin
                ? 'Sign in to your ProShop account'
                : 'Get started with ProShop — it takes 30 seconds'}
            </Typography>
          </Stack>

          {/* ============== LOGIN FORM ============== */}
          {isLogin ? (
            <Box component="form" onSubmit={loginForm.handleSubmit(onLogin)} noValidate>
              <TextField
                {...loginForm.register('email')}
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                autoComplete="email"
                autoFocus
                error={!!loginForm.formState.errors.email}
                helperText={loginForm.formState.errors.email?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                {...loginForm.register('password')}
                fullWidth
                label="Password"
                type={showPw ? 'text' : 'password'}
                margin="normal"
                autoComplete="current-password"
                error={!!loginForm.formState.errors.password}
                helperText={loginForm.formState.errors.password?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPw((v) => !v)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                        aria-label="toggle password visibility"
                      >
                        {showPw ? (
                          <ViewIcon fontSize="small" />
                        ) : (
                          <HideIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="#"
                  variant="caption"
                  underline="hover"
                >
                  Forgot password?
                </Link>
              </Box>

              {apiError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {apiError.data?.message ?? 'Login failed'}
                </Alert>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>

              <Alert severity="info" sx={{ mt: 2 }} icon={false}>
                <Typography variant="caption" component="div">
                  <strong>Demo accounts:</strong>
                </Typography>
                <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
                  admin@email.com / 123456
                </Typography>
                <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
                  john@email.com / 123456
                </Typography>
              </Alert>
            </Box>
          ) : (
            /* ============== REGISTER FORM ============== */
            <Box
              component="form"
              onSubmit={registerForm.handleSubmit(onRegister)}
              noValidate
            >
              <TextField
                {...registerForm.register('name')}
                fullWidth
                label="Full name"
                margin="normal"
                autoComplete="name"
                autoFocus
                error={!!registerForm.formState.errors.name}
                helperText={registerForm.formState.errors.name?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                {...registerForm.register('email')}
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                autoComplete="email"
                error={!!registerForm.formState.errors.email}
                helperText={registerForm.formState.errors.email?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                {...registerForm.register('password')}
                fullWidth
                label="Password"
                type={showPw ? 'text' : 'password'}
                margin="normal"
                autoComplete="new-password"
                error={!!registerForm.formState.errors.password}
                helperText={
                  registerForm.formState.errors.password?.message ??
                  'At least 6 characters'
                }
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPw((v) => !v)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                        aria-label="toggle password visibility"
                      >
                        {showPw ? <ViewIcon fontSize="small" /> : <HideIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                {...registerForm.register('confirmPassword')}
                fullWidth
                label="Confirm password"
                type={showPw ? 'text' : 'password'}
                margin="normal"
                autoComplete="new-password"
                error={!!registerForm.formState.errors.confirmPassword}
                helperText={registerForm.formState.errors.confirmPassword?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              {apiError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {apiError.data?.message ?? 'Registration failed'}
                </Alert>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </Button>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <Typography variant="body2" color="text.secondary" align="center">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link
              component={RouterLink}
              to={isLogin ? '/register' : '/login'}
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
