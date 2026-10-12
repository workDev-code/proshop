import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  LocalShipping as ShipIcon,
  Payment as PayIcon,
  Receipt as ReviewIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { ShippingForm } from '../components/ShippingForm';
import { PaymentMethod } from '../components/PaymentMethod';
import { OrderReview } from '../components/OrderReview';
import { useCart } from '../../cart/hooks';

const STEPS = [
  { label: 'Shipping', icon: <ShipIcon /> },
  { label: 'Payment', icon: <PayIcon /> },
  { label: 'Review', icon: <ReviewIcon /> },
];

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
    <Box>
      <PageHeader title="Checkout" subtitle="Complete your purchase" />

      <Stepper activeStep={active} sx={{ mb: 4 }} alternativeLabel>
        {STEPS.map((s, i) => (
          <Step key={s.label} completed={active > i}>
            <StepLabel icon={s.icon}>{s.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          {active === 0 && <ShippingForm onNext={() => setActive(1)} />}
          {active === 1 && <PaymentMethod onBack={() => setActive(0)} onNext={() => setActive(2)} />}
          {active === 2 && <OrderReview onBack={() => setActive(1)} />}
        </CardContent>
      </Card>

      <Box sx={{ mt: 2 }}>
        <Button onClick={() => navigate('/cart')} size="small">
          ← Back to cart
        </Button>
      </Box>
    </Box>
  );
};
