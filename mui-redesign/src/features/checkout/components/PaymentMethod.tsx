import { Box, Stack, Typography, RadioGroup, FormControlLabel, Radio, Card, CardContent, Alert, Button } from '@mui/material';
import { Payment as PaymentIcon, CreditCard as CardIcon, LocalAtm as CashIcon } from '@mui/icons-material';
import { useCart } from '../../cart/hooks';
import type { PaymentMethod as PaymentMethodType } from '../../orders/types';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS: { value: PaymentMethodType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'PayPal',
    label: 'PayPal',
    description: 'You will be redirected to PayPal to complete payment securely.',
    icon: <PaymentIcon />,
  },
  {
    value: 'Stripe',
    label: 'Credit / Debit Card (Stripe)',
    description: 'Pay with your credit or debit card. (Demo — not wired to real Stripe yet.)',
    icon: <CardIcon />,
  },
  {
    value: 'CashOnDelivery',
    label: 'Cash on Delivery',
    description: 'Pay in cash when your order is delivered.',
    icon: <CashIcon />,
  },
];

const pillButtonSx = {
  borderRadius: 999,
  py: 1.5,
  px: 3.5,
  fontSize: 13,
  fontWeight: 600,
  textTransform: 'none' as const,
  minWidth: 160,
};

const ghostButtonSx = {
  borderRadius: 999,
  py: 1.5,
  px: 3,
  fontSize: 13,
  fontWeight: 600,
  textTransform: 'none' as const,
  color: 'text.secondary',
  '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
};

export const PaymentMethod = ({ onNext, onBack }: Props) => {
  const { paymentMethod, savePayment } = useCart();

  const handleChange = (v: PaymentMethodType) => {
    savePayment(v);
  };

  const handleContinue = () => {
    if (!paymentMethod) return;
    onNext();
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <PaymentIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: '-0.01em',
            color: 'text.primary',
          }}
        >
          Payment method
        </Typography>
      </Stack>

      <Alert
        severity="info"
        sx={{
          mb: 2.5,
          borderRadius: 2,
          fontSize: 12,
          '& .MuiAlert-message': { lineHeight: 1.5 },
        }}
      >
        Demo mode: selecting a method will mark the order paid immediately after you place it.
        No real payment provider is invoked.
      </Alert>

      <RadioGroup
        value={paymentMethod ?? ''}
        onChange={(e) => handleChange(e.target.value as PaymentMethodType)}
      >
        <Stack spacing={1.5}>
          {OPTIONS.map((opt) => (
            <Card
              key={opt.value}
              variant="outlined"
              sx={{
                borderColor: paymentMethod === opt.value ? 'secondary.main' : 'divider',
                borderWidth: paymentMethod === opt.value ? 2 : 1,
                borderRadius: 2.5,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                '&:hover': { borderColor: 'secondary.light' },
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ py: 2, px: 2, '&:last-child': { pb: 2 } }}>
                <FormControlLabel
                  value={opt.value}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: 'secondary.main',
                        '&.Mui-checked': { color: 'secondary.main' },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ ml: 0.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ color: 'text.secondary', display: 'flex' }}>{opt.icon}</Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 12 }}>
                        {opt.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', alignItems: 'flex-start', m: 0 }}
                />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </RadioGroup>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 4 }}
      >
        <Button onClick={onBack} sx={ghostButtonSx}>
          ← Back
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          disabled={!paymentMethod}
          sx={pillButtonSx}
        >
          Review order
        </Button>
      </Stack>
    </Box>
  );
};
