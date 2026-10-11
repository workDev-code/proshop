import { Box, Typography, Divider } from '@mui/material';

export const TypographyScale = () => (
  <Box>
    {[
      { variant: 'h1' as const, label: 'h1 · Display 49px / 700 / -0.02em' },
      { variant: 'h2' as const, label: 'h2 · Section 35px / 700 / -0.01em' },
      { variant: 'h3' as const, label: 'h3 · Subsection 28px / 600' },
      { variant: 'h4' as const, label: 'h4 · Title 21px / 600' },
      { variant: 'h5' as const, label: 'h5 · Sub Title 17.5px / 500' },
      { variant: 'h6' as const, label: 'h6 · Small Heading 15.75px / 500' },
      { variant: 'subtitle1' as const, label: 'subtitle1 · 16px / 500' },
      { variant: 'body1' as const, label: 'body1 · Body 16px / 400' },
      { variant: 'body2' as const, label: 'body2 · 14px / 400' },
      { variant: 'caption' as const, label: 'CAPTION · 12PX · UPPERCASE · 0.02EM' },
    ].map((row, i) => (
      <Box key={row.variant}>
        {i > 0 && <Divider sx={{ my: 1 }} />}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '220px 1fr' },
            gap: 2,
            alignItems: 'baseline',
            py: 1,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            {row.label}
          </Typography>
          <Typography variant={row.variant}>The quick brown fox jumps over the lazy dog</Typography>
        </Box>
      </Box>
    ))}
  </Box>
);
