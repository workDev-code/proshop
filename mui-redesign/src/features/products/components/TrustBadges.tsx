import { Box, Stack, Typography } from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Replay as ReturnsIcon,
  VerifiedUser as CheckoutIcon,
  SupportAgent as SupportIcon,
} from '@mui/icons-material';

interface Badge {
  icon: React.ReactNode;
  label: string;
  detail: string;
}

/**
 * 4-col trust strip rendered just below the hero banner.
 * Matches `.trust` / `.trust-item` / `.trust-icon` from the approved HTML.
 *
 *  - 38px round outlined icon (secondary color)
 *  - Bold label + small supporting text
 *  - Subtle 1px border-bottom divider on the outer wrapper
 */
export const TrustBadges = () => {
  const items: Badge[] = [
    {
      icon: <ShippingIcon sx={{ fontSize: 18 }} />,
      label: 'Free shipping',
      detail: 'On orders over $75',
    },
    {
      icon: <ReturnsIcon sx={{ fontSize: 18 }} />,
      label: 'Easy returns',
      detail: '30 days to decide',
    },
    {
      icon: <CheckoutIcon sx={{ fontSize: 18 }} />,
      label: 'Secure checkout',
      detail: 'Encrypted every step',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 18 }} />,
      label: '24/7 support',
      detail: 'We&rsquo;re here to help',
    },
  ];

  return (
    <Box
      component="section"
      aria-label="Trust badges"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: { xs: 2, md: 2.5 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: { xs: 3, md: 3.5 },
        mt: { xs: 4, md: 6 },
        mb: { xs: 4, md: 6 },
      }}
    >
      {items.map((it) => (
        <Stack
          key={it.label}
          direction="row"
          spacing={{ xs: 1.125, md: 1.625 }}
          alignItems="center"
          sx={{ px: { xs: 0, md: 1.25 } }}
        >
          <Box
            sx={{
              width: { xs: 33, md: 38 },
              height: { xs: 33, md: 38 },
              flexShrink: 0,
              borderRadius: '50%',
              border: '1px solid',
              borderColor: 'divider',
              display: 'grid',
              placeItems: 'center',
              color: 'secondary.main',
            }}
          >
            {it.icon}
          </Box>
          <Box>
            <Typography
              sx={{
                display: 'block',
                fontSize: { xs: '0.6875rem', md: '0.75rem' },
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              {it.label}
            </Typography>
            <Typography
              component="small"
              sx={{
                display: 'block',
                color: 'text.secondary',
                fontSize: { xs: '0.625rem', md: '0.6875rem' },
              }}
            >
              {it.detail}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Box>
  );
};
