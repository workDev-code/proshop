import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { ShippingForm } from '../components/ShippingForm';
import { PaymentMethod } from '../components/PaymentMethod';
import { OrderReview } from '../components/OrderReview';
import { useCart } from '../../cart/hooks';

/* ─── Step indicator (editorial thin style) ─────────────────────── */

const STEPS = [
  { num: 1, label: 'Shipping' },
  { num: 2, label: 'Payment' },
  { num: 3, label: 'Review' },
] as const;

const StepIndicator = ({ active }: { active: number }) => (
  <Stack
    direction="row"
    alignItems="flex-start"
    justifyContent="center"
    spacing={0}
    sx={{ width: '100%', maxWidth: 720, mx: 'auto', mb: { xs: 4, md: 5 } }}
  >
    {STEPS.map((s, i) => {
      const isCompleted = active > s.num - 1;
      const isCurrent = active === s.num - 1;
      const isLast = i === STEPS.length - 1;
      const size = isCurrent ? 36 : 28;
      return (
        <Box
          key={s.num}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: isLast ? '0 0 auto' : 1,
            minWidth: 0,
          }}
        >
          {/* Label + circle column */}
          <Stack
            alignItems="center"
            spacing={1}
            sx={{ flex: '0 0 auto' }}
          >
            <Box
              sx={{
                width: size,
                height: size,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor: isCompleted
                  ? 'secondary.main'
                  : isCurrent
                    ? 'secondary.main'
                    : 'transparent',
                border: '1.5px solid',
                borderColor: isCompleted || isCurrent
                  ? 'secondary.main'
                  : 'divider',
                color: isCompleted || isCurrent ? '#fff' : 'text.disabled',
                fontSize: isCurrent ? 12 : 11,
                fontWeight: 700,
                fontFamily: '"Manrope", sans-serif',
                transition: 'all 200ms ease',
                flexShrink: 0,
              }}
            >
              {isCompleted ? <CheckIcon sx={{ fontSize: 14 }} /> : s.num}
            </Box>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color:
                  isCompleted || isCurrent ? 'text.primary' : 'text.disabled',
                whiteSpace: 'nowrap',
              }}
            >
              {s.label}
            </Typography>
          </Stack>

          {/* Connector line */}
          {!isLast && (
            <Box
              aria-hidden
              sx={{
                flex: 1,
                height: 2,
                mx: 1.5,
                mt: 1.625,
                bgcolor: isCompleted ? 'secondary.main' : 'divider',
                borderRadius: 999,
                minWidth: 24,
              }}
            />
          )}
        </Box>
      );
    })}
  </Stack>
);

/* ─── Page ──────────────────────────────────────────────────────── */

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isEmpty, shippingAddress, paymentMethod } = useCart();
  const [active, setActive] = useState(0);

  // If user lands here with no items, send back to cart
  useEffect(() => {
    if (isEmpty) navigate('/cart', { replace: true });
  }, [isEmpty, navigate]);

  // Restore position based on saved state
  useEffect(() => {
    if (paymentMethod && shippingAddress) setActive(2);
    else if (shippingAddress) setActive(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isEmpty) return null;

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        py: { xs: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1240,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Editorial header */}
        <Box sx={{ mb: { xs: 4, md: 5 } }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'secondary.main',
              mb: 2,
            }}
          >
            <Box sx={{ width: 24, height: 1, bgcolor: 'currentColor' }} />
            Almost there
          </Stack>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 800,
              fontSize: { xs: 32, sm: 40, md: 48 },
              lineHeight: 1.04,
              letterSpacing: '-0.04em',
              color: 'text.primary',
              mb: 1.5,
            }}
          >
            Checkout
          </Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            Complete your purchase
          </Typography>
        </Box>

        {/* Step indicator */}
        <StepIndicator active={active} />

        {/* Step content card */}
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <Card
            sx={{
              border: '1px solid rgba(32,33,31,0.08)',
              borderRadius: 3,
              boxShadow: 'none',
              bgcolor: 'background.paper',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5, md: 4 } }}>
              {active === 0 && <ShippingForm onNext={() => setActive(1)} />}
              {active === 1 && (
                <PaymentMethod
                  onBack={() => setActive(0)}
                  onNext={() => setActive(2)}
                />
              )}
              {active === 2 && <OrderReview onBack={() => setActive(1)} />}
            </CardContent>
          </Card>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 3 }}
          >
            <Button
              onClick={() => navigate('/cart')}
              sx={{
                color: 'text.secondary',
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'none',
                px: 1,
                '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
              }}
            >
              ← Back to cart
            </Button>
            {active < 2 && (
              <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
                Step {active + 1} of 3
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
