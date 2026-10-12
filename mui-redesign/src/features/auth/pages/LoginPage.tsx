import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
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
  FlashOn as FlashIcon,
  LocalShipping as ShipIcon,
  FavoriteBorder as WishlistIcon,
  Headphones as SupportIcon,
} from '@mui/icons-material';
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from '../schemas';
import { useLoginMutation, useRegisterMutation } from '../authApi';
import { useCurrentUser } from '../hooks';
import { useToast } from '../../../hooks/useToast';
import {
  DEMO_ACCOUNTS,
  BACKEND_ACCOUNTS,
  DEMO_PASSWORD,
  type DemoCredential,
} from '../../../demo/demoCredentials';

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

const TrustLine = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <Stack direction="row" alignItems="center" spacing={1.25}>
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
        '& svg': { fontSize: 16 },
      }}
    >
      {icon}
    </Box>
    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{label}</Typography>
  </Stack>
);

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 999,
    fontSize: 14,
    bgcolor: 'background.paper',
  },
  '& .MuiOutlinedInput-input': {
    py: 1.5,
  },
};

const fieldErrorSx = {
  '& .MuiOutlinedInput-root.Mui-error': {
    borderColor: 'error.main',
  },
  '& .MuiFormHelperText-root.Mui-error': {
    ml: 2,
    fontSize: 11,
  },
};

/**
 * Login / Register page.
 *
 * Layout: editorial 2-col on desktop (left = brand + trust signals,
 * right = form card), single column on mobile. All visual language
 * matches the new storefront system (Manrope h1, pill buttons,
 * cream background, terracotta accent).
 */
export const LoginPage = ({ mode = 'login' }: Props) => {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const [loginMutate, loginState] = useLoginMutation();
  const [registerMutate, registerState] = useRegisterMutation();
  const [showPw, setShowPw] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Use mock credentials when demo mode is on, otherwise show the
  // real backend's seed users. VITE_DEMO_MODE is set in .env / .env.demo.
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  const demoAccounts: DemoCredential[] = isDemoMode ? DEMO_ACCOUNTS : BACKEND_ACCOUNTS;

  // If already logged in, bounce to home (or to where the user came from)
  useEffect(() => {
    if (!userLoading && isAuthenticated) {
      const from = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(from, { replace: true });
    }
  }, [userLoading, isAuthenticated, location.state, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const isSubmitting = isLogin ? loginState.isLoading : registerState.isLoading;

  const onLogin = async (values: LoginFormValues) => {
    setApiError(null);
    try {
      await loginMutate(values).unwrap();
      toast.success('Welcome back!');
      const from = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(extractError(err));
    }
  };

  const onRegister = async (values: RegisterFormValues) => {
    setApiError(null);
    try {
      await registerMutate({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap();
      toast.success('Account created — welcome!');
      const from = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(extractError(err));
    }
  };

  const fillDemoCredentials = (acc: DemoCredential) => {
    if (isLogin) {
      loginForm.setValue('email', acc.email);
      loginForm.setValue('password', DEMO_PASSWORD);
    } else {
      registerForm.setValue('email', acc.email);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
        alignItems: 'stretch',
      }}
    >
      {/* LEFT — editorial panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { md: 5, lg: 7 },
          bgcolor: (t) =>
            t.palette.mode === 'dark'
              ? 'rgba(34,35,31,0.5)'
              : 'rgba(231, 232, 223, 0.45)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Brand */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: '-1.6px',
            color: 'text.primary',
            textDecoration: 'none',
            width: 'fit-content',
            '& em': { fontStyle: 'normal', color: 'secondary.main' },
          }}
        >
          Pro<em>S</em>hop
        </Box>

        {/* Editorial copy */}
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 460 }}>
          <Box
            sx={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'secondary.main',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            <Box sx={{ width: 24, height: 1, bgcolor: 'currentColor' }} />
            {isLogin ? 'Welcome back' : 'Join the community'}
          </Box>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2.25rem, 4.2vw, 3.25rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: 'text.primary',
              mb: 2.5,
            }}
          >
            {isLogin ? (
              <>
                Your bag of
                <Box component="span" sx={{ display: 'block', color: 'secondary.main' }}>
                  everyday favorites.
                </Box>
              </>
            ) : (
              <>
                Start your
                <Box component="span" sx={{ display: 'block', color: 'secondary.main' }}>
                  ProShop journey.
                </Box>
              </>
            )}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 14, lineHeight: 1.7, maxWidth: 380 }}>
            {isLogin
              ? 'Sign in to continue your order, save your wishlist, and pick up where you left off.'
              : 'Save your wishlist, track every order, and check out faster — all in one place.'}
          </Typography>
        </Box>

        {/* Trust signals */}
        <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'text.disabled',
            }}
          >
            What you get
          </Typography>
          <Stack spacing={1.5}>
            <TrustLine icon={<ShipIcon />} label="Free shipping on orders over $50" />
            <TrustLine icon={<WishlistIcon />} label="Save items to your wishlist" />
            <TrustLine icon={<SupportIcon />} label="Real human support, 7 days a week" />
          </Stack>
        </Stack>

        {/* Decorative circle */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            right: -120,
            top: '40%',
            width: 360,
            height: 360,
            borderRadius: '50%',
            bgcolor: 'rgba(210, 215, 202, 0.55)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      </Box>

      {/* RIGHT — form */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 5, md: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile brand */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: { xs: 'block', md: 'none' },
              fontFamily: '"Manrope", sans-serif',
              fontSize: 23,
              fontWeight: 800,
              letterSpacing: '-1.4px',
              color: 'text.primary',
              textDecoration: 'none',
              mb: 4,
              '& em': { fontStyle: 'normal', color: 'secondary.main' },
            }}
          >
            Pro<em>S</em>hop
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 800,
                fontSize: { xs: 24, sm: 28 },
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: 'text.primary',
                mb: 0.75,
              }}
            >
              {isLogin ? 'Sign in' : 'Create your account'}
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
              {isLogin
                ? 'Welcome back — enter your details to continue.'
                : 'It takes less than 30 seconds.'}
            </Typography>
          </Box>

          {isLogin ? (
            <Box component="form" onSubmit={loginForm.handleSubmit(onLogin)} noValidate>
              <TextField
                {...loginForm.register('email')}
                fullWidth
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                autoFocus
                error={!!loginForm.formState.errors.email}
                helperText={loginForm.formState.errors.email?.message}
                disabled={isSubmitting}
                sx={{ ...fieldSx, ...fieldErrorSx, mb: 1.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 0.5, pr: 1 }}>
                      <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                {...loginForm.register('password')}
                fullWidth
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                error={!!loginForm.formState.errors.password}
                helperText={loginForm.formState.errors.password?.message}
                disabled={isSubmitting}
                sx={{ ...fieldSx, ...fieldErrorSx, mb: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 0.5, pr: 1 }}>
                      <LockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Link
                  component={RouterLink}
                  to="#"
                  underline="hover"
                  sx={{ fontSize: 12, color: 'text.secondary' }}
                >
                  Forgot password?
                </Link>
              </Box>

              {apiError && (
                <Alert
                  severity="error"
                  sx={{ mb: 2, borderRadius: 2, fontSize: 13 }}
                >
                  {apiError}
                </Alert>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
                sx={{ py: 1.5, borderRadius: 999, fontSize: 13, fontWeight: 600 }}
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>

              {/* Demo accounts (only in dev / demo builds) */}
              {import.meta.env.DEV || isDemoMode ? (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: (t) =>
                      t.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(32,33,31,0.025)',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'text.disabled',
                      }}
                    >
                      {isDemoMode ? 'Demo accounts (mock backend)' : 'Seeded accounts (live backend)'}
                    </Typography>
                    {isDemoMode && (
                      <Typography
                        sx={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'secondary.main',
                          bgcolor: 'rgba(217,93,57,0.08)',
                          borderRadius: 999,
                          px: 0.75,
                          py: 0.25,
                        }}
                      >
                        Mock
                      </Typography>
                    )}
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {demoAccounts.map((acc) => (
                      <Button
                        key={acc.email}
                        size="small"
                        variant="outlined"
                        startIcon={<FlashIcon sx={{ fontSize: 14 }} />}
                        onClick={() => fillDemoCredentials(acc)}
                        sx={{ borderRadius: 999, fontSize: 11, py: 0.5, px: 1.5 }}
                      >
                        {acc.label}
                      </Button>
                    ))}
                  </Stack>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 1 }}>
                    Password for both: <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{DEMO_PASSWORD}</Box>
                  </Typography>
                  {!isDemoMode && (
                    <Typography sx={{ fontSize: 10, color: 'text.disabled', mt: 0.5 }}>
                      Tip: copy <code style={{ fontFamily: 'monospace' }}>mui-redesign/.env.demo</code> to <code style={{ fontFamily: 'monospace' }}>.env</code> to use in-memory mock data.
                    </Typography>
                  )}
                </Box>
              ) : null}
            </Box>
          ) : (
            <Box component="form" onSubmit={registerForm.handleSubmit(onRegister)} noValidate>
              <TextField
                {...registerForm.register('name')}
                fullWidth
                placeholder="Full name"
                autoComplete="name"
                autoFocus
                error={!!registerForm.register('name').name}
                helperText={registerForm.formState.errors.name?.message}
                disabled={isSubmitting}
                sx={{ ...fieldSx, ...fieldErrorSx, mb: 1.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 0.5, pr: 1 }}>
                      <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                {...registerForm.register('email')}
                fullWidth
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                error={!!registerForm.formState.errors.email}
                helperText={registerForm.formState.errors.email?.message}
                disabled={isSubmitting}
                sx={{ ...fieldSx, ...fieldErrorSx, mb: 1.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 0.5, pr: 1 }}>
                      <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                {...registerForm.register('password')}
                fullWidth
                type={showPw ? 'text' : 'password'}
                placeholder="Password (min. 6 characters)"
                autoComplete="new-password"
                error={!!registerForm.formState.errors.password}
                helperText={registerForm.formState.errors.password?.message ?? 'At least 6 characters'}
                disabled={isSubmitting}
                sx={{ ...fieldSx, ...fieldErrorSx, mb: 1.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 0.5, pr: 1 }}>
                      <LockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
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
                type={showPw ? 'text' : 'password'}
                placeholder="Confirm password"
                autoComplete="new-password"
                error={!!registerForm.formState.errors.confirmPassword}
                helperText={registerForm.formState.errors.confirmPassword?.message}
                disabled={isSubmitting}
                sx={{ ...fieldSx, ...fieldErrorSx, mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 0.5, pr: 1 }}>
                      <LockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {apiError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: 13 }}>
                  {apiError}
                </Alert>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
                sx={{ py: 1.5, borderRadius: 999, fontSize: 13, fontWeight: 600 }}
              >
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </Button>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="caption" color="text.secondary" sx={{ px: 2, letterSpacing: '0.16em' }}>
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
              sx={{ fontWeight: 700, color: 'secondary.main' }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
