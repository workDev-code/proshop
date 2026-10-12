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
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <PaymentIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Payment method
        </Typography>
      </Stack>

      <Alert severity="info" sx={{ mb: 2 }}>
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
                borderColor: paymentMethod === opt.value ? 'primary.main' : 'divider',
                borderWidth: paymentMethod === opt.value ? 2 : 1,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                '&:hover': { borderColor: 'primary.light' },
              }}
            >
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <FormControlLabel
                  value={opt.value}
                  control={<Radio />}
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {opt.icon}
                        <Typography sx={{ fontWeight: 600 }}>{opt.label}</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack} size="large">
          Back
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          disabled={!paymentMethod}
        >
          Review order
        </Button>
      </Box>
    </Box>
  );
};
