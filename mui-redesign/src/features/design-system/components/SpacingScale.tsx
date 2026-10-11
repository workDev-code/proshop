import { Box, Typography } from '@mui/material';

const STEPS = [
  { token: 0, px: 0,   use: 'reset' },
  { token: 0.5, px: 4, use: 'badge' },
  { token: 1, px: 8,   use: 'tight' },
  { token: 1.5, px: 12, use: 'icon gap' },
  { token: 2, px: 16,  use: 'form input' },
  { token: 3, px: 24,  use: 'card padding' },
  { token: 4, px: 32,  use: 'section gap' },
  { token: 6, px: 48,  use: 'page padding' },
  { token: 8, px: 64,  use: 'hero gap' },
];

export const SpacingScale = () => (
  <Box
    sx={{
      display: 'grid',
      gap: 1.5,
      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
    }}
  >
    {STEPS.map((s) => (
      <Box
        key={s.token}
        sx={{
          p: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
        }}
      >
        <Box
          sx={{
            width: s.px || 4,
            height: s.px || 4,
            bgcolor: 'primary.main',
            borderRadius: 0.5,
            mb: 1,
          }}
        />
        <Typography variant="subtitle2" sx={{ fontSize: '0.8125rem' }}>
          spacing({s.token})
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
          {s.px}px
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
          {s.use}
        </Typography>
      </Box>
    ))}
  </Box>
);

// keep Stack import used
