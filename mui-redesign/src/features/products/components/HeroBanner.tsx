import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack, Typography, Button } from '@mui/material';
import type { Product } from '../types';

interface Props {
  /** The featured product used for the right-side artwork. */
  product?: Product;
}

/**
 * Editorial hero banner — 2-column panel (1.02fr / 0.98fr) on desktop,
 * single column on mobile. Matches `.hero-panel` / `.hero-copy` / `.hero-art`
 * from the approved HTML prototype.
 *
 *   Left: small accent square + Manrope 800 h1 + paragraph + dark pill CTA
 *   Right: solid art panel, product image rotated -4deg,
 *          circular accent sticker at bottom-right
 *
 * Fix notes (per UI review):
 *   - Panel bg: SOLID #262624 (was rgba(231,232,223,.55) → washed-out gray
 *     on dark page).
 *   - Eyebrow marker: 10x10 square (was 24x1 line).
 *   - Hero copy: padding-top 48px on desktop, 56px bottom (was 0).
 *   - Body copy: 18px, line-height 1.6, max-width 480px, #B8B5AD.
 *   - CTA: orange #E8795A bg + dark text (was cream+white → invisible).
 *     Added focus-visible outline + hover lift + shadow.
 *   - Art: -4deg (was -5), removed mixBlendMode, added border-radius,
 *     safe-zone padding 24px.
 *   - Sticker: bottom/right in px (was %), zIndex 3 above image.
 */
export const HeroBanner = ({ product }: Props) => {
  const [imgErr, setImgErr] = useState(false);
  const featuredLink = product?._id ? `/product/${product._id}` : '#featured';
  const heroSrc = product?.image?.replace(/\.jpg$/, '.svg') ?? product?.image ?? '';

  return (
    <Box
      component="section"
      aria-label="Hero"
      sx={{
        bgcolor: '#262624', // solid dark — replaces washed-out sage overlay
        minHeight: { xs: 0, sm: 460, md: 520 },
        borderRadius: { xs: '20px', md: '26px' },
        overflow: 'hidden',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.02fr 0.98fr' },
        border: '1px solid',
        borderColor: 'rgba(255,255,255,0.06)',
        // Respect users who prefer less motion
        '@media (prefers-reduced-motion: reduce)': {
          '& *': { transition: 'none !important', animation: 'none !important' },
        },
      }}
    >
      {/* Left column — copy */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          // 48px top padding so the eyebrow label breathes away from card edge
          pt: { xs: 6, sm: 7, md: 6 },
          // 56px bottom padding so the CTA never sits flush against the edge
          pb: { xs: 6, sm: 7, md: 7 },
          px: { xs: 4, sm: 5, md: 0 },
          pl: { md: '7%' },
          pr: { md: '5%' },
          order: { xs: 1, md: 0 },
        }}
      >
        {/* Eyebrow — small square + uppercase label, properly aligned */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            color: '#E8795A',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            mb: { xs: 2, md: 2.5 },
          }}
        >
          <Box
            aria-hidden
            sx={{
              width: 10,
              height: 10,
              bgcolor: 'currentColor',
              borderRadius: '2px',
              flexShrink: 0,
            }}
          />
          The considered collection
        </Stack>

        <Typography
          component="h1"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2.625rem, 5.1vw, 4.25rem)',
            lineHeight: 1.04,
            letterSpacing: '-0.055em',
            mb: { xs: 1.5, md: 2 },
            maxWidth: 510,
            // "Good things." in warm off-white #F5F3EE (was text.primary which
            // was already light in dark mode but inconsistent across themes).
            color: '#F5F3EE',
          }}
        >
          Good things.
          <Box component="span" sx={{ display: 'block', color: '#E8795A' }}>
            Better everyday.
          </Box>
        </Typography>

        <Typography
          sx={{
            // Body copy — 18px (was 14px), line-height 1.6 (was 1.8),
            // max-width 480 (was 365), #B8B5AD for ≥4.5:1 contrast on #262624.
            color: '#B8B5AD',
            fontSize: { xs: 16, md: 18 },
            lineHeight: 1.6,
            maxWidth: 480,
            mb: { xs: 3, md: 3.625 },
          }}
        >
          Thoughtful design, everyday utility. Meet the pieces made to earn
          their place in your routine.
        </Typography>

        <Button
          component={RouterLink}
          to={featuredLink}
          variant="contained"
          size="large"
          endIcon={
            <Box component="span" sx={{ fontSize: 14, lineHeight: 1 }}>
              ↗
            </Box>
          }
          sx={{
            // Orange CTA — bg #E8795A, dark text #1C1C1A (was cream+white →
            // invisible). Pill shape, hover lift + shadow, focus ring.
            bgcolor: '#E8795A',
            color: '#1C1C1A',
            px: 3.5,    // 28px
            py: 2,      // 16px
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 14,
            textTransform: 'none',
            letterSpacing: 0,
            boxShadow: '0 6px 18px rgba(232,121,90,0.28)',
            transition:
              'transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease',
            '&:hover': {
              bgcolor: '#d96a4b',
              transform: 'translateY(-2px)',
              boxShadow: '0 10px 24px rgba(232,121,90,0.38)',
            },
            '&:focus-visible': {
              outline: '2px solid #F5F3EE',
              outlineOffset: 3,
            },
            '&:active': { transform: 'translateY(0)' },
          }}
        >
          Explore the collection
        </Button>
      </Box>

      {/* Right column — artwork */}
      <Box
        sx={{
          position: 'relative',
          // Safe-zone padding so artwork never touches card edge
          p: { xs: 3, md: 3.5 },
          minHeight: { xs: 280, sm: 360, md: 520 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          order: { xs: 2, md: 0 },
        }}
      >
        {/* Soft sage backdrop — solid (no overlay) so it doesn't wash out */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            width: { xs: 220, sm: 300, md: 360 },
            height: { xs: 220, sm: 300, md: 360 },
            borderRadius: '50%',
            bgcolor: 'rgba(210, 215, 202, 0.18)', // muted sage on dark
            right: { xs: '50%', md: 24 },
            top: { xs: '7%', md: '50%' },
            transform: { xs: 'translateX(50%)', md: 'translateY(-50%)' },
          }}
        />

        {/* Product image */}
        {product && heroSrc && !imgErr ? (
          <Box
            component="img"
            src={heroSrc}
            alt={product.name}
            onError={() => setImgErr(true)}
            sx={{
              position: 'relative',
              zIndex: 1,
              width: { xs: '78%', md: '82%' },
              maxHeight: { xs: 260, sm: 360, md: 420 },
              objectFit: 'contain',
              // Reduced rotation (was -5deg) + border-radius + no blend mode
              // so the image stays crisp on dark surface.
              transform: 'rotate(-4deg)',
              borderRadius: 3,
              filter: 'drop-shadow(0 28px 22px rgba(0, 0, 0, 0.35))',
              display: 'block',
            }}
          />
        ) : (
          <Box
            aria-hidden
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '70%',
              height: { xs: 220, sm: 320, md: 380 },
              borderRadius: 4,
              bgcolor: 'rgba(255, 255, 255, 0.06)',
              border: '1px dashed rgba(255,255,255,0.15)',
              transform: 'rotate(-4deg)',
            }}
          />
        )}

        {/* Accent sticker — fixed px position so it never clips */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            zIndex: 3, // above image (zIndex 1) and backdrop
            right: { xs: 16, md: 24 },
            bottom: { xs: 16, md: 24 },
            width: { xs: 76, md: 96 },
            height: { xs: 76, md: 96 },
            borderRadius: '50%',
            bgcolor: '#E8795A',
            color: '#1C1C1A',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            fontSize: { xs: 8.5, md: 10 },
            lineHeight: 1.45,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 700,
            transform: 'rotate(8deg)',
            border: '5px solid rgba(28,28,26,0.85)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
          }}
        >
          <span>
            Made for
            <br />
            real life
            <br />
            ✳
          </span>
        </Box>
      </Box>
    </Box>
  );
};
