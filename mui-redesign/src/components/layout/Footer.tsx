import { Box, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface Col {
  heading: string;
  links: { label: string; to: string }[];
}

const COLS: Col[] = [
  {
    heading: 'Shop',
    links: [
      { label: 'All products', to: '/' },
      { label: 'New arrivals', to: '/?sort=newest' },
      { label: 'Best sellers', to: '/?sort=top_sellers' },
      { label: 'Cart', to: '/cart' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Profile', to: '/profile' },
      { label: 'Orders', to: '/orders' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Sign in', to: '/login' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Shipping & returns', to: '/' },
      { label: 'Contact support', to: '/' },
      { label: 'FAQ', to: '/' },
    ],
  },
];

const SOCIALS = ['IG', 'FB', 'TW', 'PI'];

export const Footer = () => (
  <Box
    component="footer"
    sx={{
      mt: { xs: 6, md: 10 },
      bgcolor: 'primary.main',
      color: 'common.white',
      pt: { xs: 5, md: 6.5 },
      pb: 3,
    }}
  >
    <Box
      sx={{
        width: '100%',
        maxWidth: 1240,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: '28px' },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            md: '1.5fr 1fr 1fr 1fr',
          },
          gap: { xs: 4, md: 8.5 },
          pb: { xs: 4, md: 5.5 },
        }}
      >
        {/* Brand column */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
          <Typography
            component={RouterLink}
            to="/"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: 23,
              fontWeight: 800,
              letterSpacing: '-1.3px',
              color: 'common.white',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Pro<Box component="em" sx={{ fontStyle: 'normal', color: 'secondary.light' }}>S</Box>hop
          </Typography>
          <Typography
            sx={{
              maxWidth: 260,
              color: 'grey.500',
              fontSize: '0.75rem',
              lineHeight: 1.8,
              my: 2,
            }}
          >
            Everyday essentials, thoughtfully chosen. Curated for the
            modern boutique shopper.
          </Typography>
          <Stack direction="row" spacing={1}>
            {SOCIALS.map((s) => (
              <Box
                key={s}
                component="a"
                href="#"
                aria-label={s}
                sx={{
                  width: 32,
                  height: 32,
                  border: '1px solid #454740',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '0.625rem',
                  color: 'grey.400',
                  textDecoration: 'none',
                  transition: 'background-color 200ms ease, color 200ms ease',
                  '&:hover': { color: 'common.white', borderColor: 'grey.300' },
                }}
              >
                {s}
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Link columns */}
        {COLS.map((col) => (
          <Box key={col.heading}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                mb: 2,
                mt: '5px',
              }}
            >
              {col.heading}
            </Typography>
            <Stack spacing={1.5}>
              {col.links.map((l) => (
                <Box
                  key={l.label}
                  component={RouterLink}
                  to={l.to}
                  sx={{
                    color: 'grey.500',
                    fontSize: '0.6875rem',
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                    '&:hover': { color: 'common.white' },
                  }}
                >
                  {l.label}
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>

      {/* Bottom bar */}
      <Box
        sx={{
          borderTop: '1px solid #41423c',
          pt: 2.5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          gap: 1.5,
          color: 'grey.500',
          fontSize: '0.625rem',
          letterSpacing: '0.08em',
        }}
      >
        <Box>© {new Date().getFullYear()} ProShop. All rights reserved.</Box>
        <Box sx={{ letterSpacing: '0.12em' }}>Visa · Mastercard · Amex · PayPal</Box>
      </Box>
    </Box>
  </Box>
);
