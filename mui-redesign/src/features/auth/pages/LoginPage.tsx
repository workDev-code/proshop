import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  mode?: 'login' | 'register';
}

export const LoginPage = ({ mode = 'login' }: Props) => {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const isLogin = mode === 'login';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 100%)',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
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
            <Typography variant="body2" color="text.secondary">
              {isLogin ? 'Sign in to your ProShop account' : 'Get started with ProShop'}
            </Typography>
          </Stack>

          {!isLogin && (
            <TextField
              fullWidth
              label="Full name"
              margin="normal"
              autoComplete="name"
            />
          )}
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPw ? 'text' : 'password'}
            margin="normal"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPw((v) => !v)} edge="end" size="small">
                    {showPw ? <HideIcon fontSize="small" /> : <ViewIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {!isLogin && (
            <TextField
              fullWidth
              label="Confirm password"
              type="password"
              margin="normal"
            />
          )}

          {isLogin && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
              <Link component={RouterLink} to="#" variant="caption" underline="hover">
                Forgot password?
              </Link>
            </Box>
          )}

          <Alert severity="info" sx={{ my: 2 }}>
            <strong>Demo:</strong> john@email.com / 123456
          </Alert>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 1 }}
            onClick={() => navigate('/')}
          >
            {isLogin ? 'Sign in' : 'Create account'}
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ mb: 2 }}
          >
            Continue with Google
          </Button>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link component={RouterLink} to={isLogin ? '/register' : '/login'} underline="hover">
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
