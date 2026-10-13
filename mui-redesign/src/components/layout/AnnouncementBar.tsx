import { Box } from '@mui/material';

/**
 * Slim dark announcement strip displayed at the very top of the
 * storefront, per the approved prototype.
 *
 *   "Free shipping on orders over $50  ·  Use code B10 for 10% off"
 *
 * Color choices (per fix spec):
 *   - Background: fixed dark #1C1C1A so it stays dark in BOTH light + dark
 *     theme modes (the old `primary.main` inverted in dark mode → unreadable).
 *   - Default text: #F2F0EA (warm off-white, contrast 13.5:1 on #1C1C1A).
 *   - Code "B10": accent #E8795A for emphasis (4.7:1 contrast on dark bg).
 */
export const AnnouncementBar = () => (
  <Box
    component="div"
    role="region"
    aria-label="Site-wide announcement"
    sx={{
      bgcolor: '#1C1C1A',
      color: '#F2F0EA',
      textAlign: 'center',
      py: 1.25,
      px: 2,
      fontSize: '0.6875rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      fontWeight: 500,
    }}
  >
    Free shipping on orders over $50 · Use code{' '}
    <Box component="span" sx={{ color: '#E8795A', fontWeight: 700 }}>
      B10
    </Box>{' '}
    for 10% off
  </Box>
);
