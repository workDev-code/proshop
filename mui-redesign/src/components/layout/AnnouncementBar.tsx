import { Box } from '@mui/material';

/**
 * Slim black announcement strip displayed at the very top of the
 * storefront, per the approved prototype:
 *
 *   "Free shipping on orders over $50  ·  Use code B10 for 10% off"
 */
export const AnnouncementBar = () => (
  <Box
    component="div"
    sx={{
      bgcolor: 'primary.main',
      color: 'common.white',
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
    <Box component="span" sx={{ color: 'secondary.light' }}>
      B10
    </Box>{' '}
    for 10% off
  </Box>
);
