import { Box, Typography, Tooltip } from '@mui/material';

interface Swatch {
  name: string;
  value: string;
  text?: 'light' | 'dark';
}

const SWATCHES: Swatch[] = [
  { name: 'primary',   value: '#4F46E5' },
  { name: 'secondary', value: '#EC4899' },
  { name: 'success',   value: '#10B981' },
  { name: 'warning',   value: '#F59E0B', text: 'light' },
  { name: 'error',     value: '#EF4444' },
  { name: 'info',      value: '#3B82F6' },
  { name: 'grey.500',  value: '#64748B' },
  { name: 'grey.700',  value: '#334155' },
  { name: 'grey.900',  value: '#0F172A' },
];

export const ColorPalette = () => (
  <Box
    sx={{
      display: 'grid',
      gap: 2,
      gridTemplateColumns: {
        xs: 'repeat(2, 1fr)',
        sm: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)',
      },
    }}
  >
    {SWATCHES.map((c) => (
      <Tooltip key={c.name} title={`Click to copy ${c.value}`} arrow>
        <Box
          onClick={() => navigator.clipboard?.writeText(c.value)}
          role="button"
          tabIndex={0}
          sx={{
            cursor: 'pointer',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            transition: 'transform 200ms ease',
            '&:hover': { transform: 'translateY(-2px)' },
          }}
        >
          <Box sx={{ bgcolor: c.value, height: 90 }} />
          <Box sx={{ p: 1.5, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
              {c.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
            >
              {c.value}
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    ))}
  </Box>
);
