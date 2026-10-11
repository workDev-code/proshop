import { Box, Stack, Typography, Chip } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
}

export const Section = ({ id, title, subtitle, badge, children }: Props) => (
  <Box component="section" id={id} sx={{ mb: 6, scrollMarginTop: 96 }}>
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {badge && <Chip label={badge} size="small" color="primary" variant="outlined" />}
    </Stack>
    {subtitle && (
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {subtitle}
      </Typography>
    )}
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      {children}
    </Box>
  </Box>
);
