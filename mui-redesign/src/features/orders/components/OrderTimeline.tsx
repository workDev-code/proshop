import { Box, Stepper, Step, StepLabel, Typography, Stack } from '@mui/material';
import {
  ShoppingCart as PlacedIcon,
  Payment as PaidIcon,
  CheckCircle as DeliveredIcon,
} from '@mui/icons-material';
import type { Order } from '../types';
import { fmtDateTime } from '../../../utils/fmt';

interface Props {
  order: Order;
}

const STEPS = [
  { label: 'Placed', icon: <PlacedIcon /> },
  { label: 'Paid', icon: <PaidIcon /> },
  { label: 'Delivered', icon: <DeliveredIcon /> },
];

/**
 * Visual stepper showing order progress.
 *  - Placed: always
 *  - Paid: when isPaid
 *  - Delivered: when isDelivered
 */
export const OrderTimeline = ({ order }: Props) => {
  const activeStep = order.isDelivered ? 3 : order.isPaid ? 2 : 1;

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {STEPS.map((s) => (
          <Step key={s.label}>
            <StepLabel icon={s.icon}>{s.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Placed on
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {fmtDateTime(order.createdAt)}
          </Typography>
        </Box>
        {order.paidAt && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Paid on
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {new Date(order.paidAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </Typography>
          </Box>
        )}
        {order.deliveredAt && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Delivered on
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {new Date(order.deliveredAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
