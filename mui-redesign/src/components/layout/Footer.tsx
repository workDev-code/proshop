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

/**
 * Storefront footer.
 *  - Container max-width 1200px (same as rest of site) centered
 *  - 4-col grid: brand 2fr + 3 link columns 1fr
 *  - mobile: 2-col, then 1-col stacked
 *  - gap 48px
 *  - Body text 14px (no font <12px anywhere)
 *  - Link hit-area ≥32px via minHeight + flex centering
 *  - safe-area-inset-bottom for iOS notches
 */
export const Footer = () => (
  <Box
    component="footer"
    sx={{
      mt: { xs: 8, md: 12 },
      bgcolor: '#1C1C1A',
      color: '#F5F3EE',
      pt: { xs: 5, md: 7 },
      // safe-area for iOS notch + at least 32px cushion
      pb: { xs: 4, md: 5 },
      paddingBottom: {
        xs: 'calc(32px + env(safe-area-inset-bottom))',
        md: 'calc(40px + env(safe-area-inset-bottom))',
      },
    }}
  >
    <Box
      sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: '24px' },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr 1fr',
            sm: '1fr 1fr 1fr',
            md: '2fr 1fr 1fr 1fr',
          },
          gap: { xs: 4, sm: 5, md: '48px' },
          pb: { xs: 4, md: 6 },
        }}
      >
        {/* Brand column */}
        <Box
          sx={{
            gridColumn: {
              xs: '1 / -1',
              sm: '1 / -1',
              md: 'auto',
            },
          }}
        >
          <Typography
            component={RouterLink}
            to="/"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: 23,
              fontWeight: 800,
              letterSpacing: '-1.3px',
              color: '#F5F3EE',
              textDecoration: 'none',
              display: 'inline-block',
              '&:hover': { color: '#E8795A' },
              '&:focus-visible': {
                outline: '2px solid #E8795A',
                outlineOffset: 4,
                borderRadius: 1,
              },
            }}
          >
            Pro<Box component="em" sx={{ fontStyle: 'normal', color: '#E8795A' }}>S</Box>hop
          </Typography>
          <Typography
            component="p"
            sx={{
              maxWidth: 280,
              color: '#B8B5AD',
              fontSize: 14,
              lineHeight: 1.6,
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
                  width: 36,
                  height: 36,
                  border: '1px solid #3A3A36',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#B8B5AD',
                  textDecoration: 'none',
                  transition:
                    'background-color 200ms ease, color 200ms ease, border-color 200ms ease',
                  '&:hover': {
                    color: '#E8795A',
                    borderColor: '#E8795A',
                    bgcolor: 'rgba(232, 121, 90, 0.10)',
                  },
                  '&:focus-visible': {
                    outline: '2px solid #E8795A',
                    outlineOffset: 2,
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none',
                  },
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
              component="h3"
              sx={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#F5F3EE',
                mb: 2,
                mt: '6px',
              }}
            >
              {col.heading}
            </Typography>
            <Stack spacing={0}>
              {col.links.map((l) => (
                <Box
                  key={l.label}
                  component={RouterLink}
                  to={l.to}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: 32, // hit-area ≥32px per design spec
                    color: '#B8B5AD',
                    fontSize: 14,
                    lineHeight: 1.5,
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                    '&:hover': {
                      color: '#F5F3EE',
                      textDecoration: 'underline',
                      textUnderlineOffset: 3,
                    },
                    '&:focus-visible': {
                      outline: '2px solid #E8795A',
                      outlineOffset: 2,
                      borderRadius: 1,
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                      transition: 'none',
                    },
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
          borderTop: '1px solid #3A3A36',
          pt: 3,
          pb: 1,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1.5,
          color: '#B8B5AD',
          fontSize: 12,
          letterSpacing: '0.04em',
        }}
      >
        <Box>
          © {new Date().getFullYear()} ProShop. All rights reserved.
        </Box>
        <Box sx={{ letterSpacing: '0.08em' }}>
          Visa · Mastercard · Amex · PayPal
        </Box>
      </Box>
    </Box>
  </Box>
);
