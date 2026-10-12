import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  trend?: { delta: string; direction: 'up' | 'down' };
}

export const StatCard = ({ label, value, icon, color = 'primary.main', trend }: Props) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Stack direction="row" alignItems="flex-start" spacing={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: 'action.hover',
            color,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
            {value}
          </Typography>
          {trend && (
            <Typography
              variant="caption"
              sx={{
                color: trend.direction === 'up' ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {trend.delta}
            </Typography>
          )}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);
