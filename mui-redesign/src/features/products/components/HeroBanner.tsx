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
 *   Left: eyebrow accent + Manrope 800 h1 + paragraph + dark pill CTA
 *   Right: circular sage background, product image rotated -5deg,
 *          circular accent sticker rotated +10deg at bottom-right
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
        bgcolor: 'rgba(231, 232, 223, 0.55)', // sage paper #e7e8df
        minHeight: { xs: 0, sm: 420, md: 480 },
        borderRadius: { xs: '20px', md: '26px' },
        overflow: 'hidden',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.02fr 0.98fr' },
        border: '1px solid',
        borderColor: 'divider',
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
          px: { xs: 4, sm: 5, md: 0 },
          pl: { md: '7%' },
          py: { xs: 6, sm: 7, md: 0 },
          order: { xs: 1, md: 0 },
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          sx={{
            color: 'secondary.main',
            fontSize: '0.625rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            alignItems: 'center',
            mb: { xs: 2, md: 2.5 },
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 1,
              bgcolor: 'currentColor',
              display: 'inline-block',
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
            color: 'text.primary',
          }}
        >
          Good things.
          <Box component="span" sx={{ display: 'block', color: 'secondary.main' }}>
            Better everyday.
          </Box>
        </Typography>

        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: '0.875rem',
            lineHeight: 1.8,
            maxWidth: 365,
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
          color="primary"
          size="large"
          endIcon={
            <Box component="span" sx={{ fontSize: 14, lineHeight: 1 }}>
              ↗
            </Box>
          }
          sx={{
            bgcolor: 'primary.main',
            color: 'common.white',
            px: 2.75,
            py: 1.75,
            '&:hover': {
              bgcolor: 'secondary.main',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Explore the collection
        </Button>
      </Box>

      {/* Right column — artwork */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 280, sm: 360, md: 480 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          order: { xs: 2, md: 0 },
        }}
      >
        {/* Circular sage background */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            width: { xs: 220, sm: 300, md: 360 },
            height: { xs: 220, sm: 300, md: 360 },
            borderRadius: '50%',
            bgcolor: 'rgba(210, 215, 202, 0.85)',
            right: { xs: '50%', md: '8%' },
            top: { xs: '7%', md: '12%' },
            transform: { xs: 'translateX(50%)', md: 'none' },
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
              width: '88%',
              height: { xs: 275, sm: 380, md: 440 },
              objectFit: 'contain',
              transform: 'rotate(-5deg)',
              filter: 'drop-shadow(0 28px 22px rgba(35, 38, 31, 0.12))',
              mixBlendMode: 'multiply',
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
              bgcolor: 'rgba(255, 255, 255, 0.4)',
              transform: 'rotate(-5deg)',
            }}
          />
        )}

        {/* Accent sticker */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            zIndex: 2,
            right: { xs: '8%', md: '7%' },
            bottom: { xs: '8%', md: '12%' },
            width: { xs: 72, md: 92 },
            height: { xs: 72, md: 92 },
            borderRadius: '50%',
            bgcolor: 'secondary.main',
            color: 'common.white',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            fontSize: { xs: 8, md: 10 },
            lineHeight: 1.5,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
            transform: 'rotate(10deg)',
            border: '5px solid rgba(255,255,255,0.45)',
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
