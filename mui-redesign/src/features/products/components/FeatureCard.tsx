import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import type { Product } from '../types';

interface Props {
  /** A product used to source the right-hand imagery. */
  product?: Product;
}

/**
 * 2-col editorial feature panel (1fr / 1fr) — image left, copy right.
 * Matches `.feature-panel` / `.feature-image` / `.feature-copy` from
 * the approved HTML prototype.
 *
 *  - 24px radius, SOLID --surface (#262624) background (was rgba beige
 *    that washed out to gray on dark)
 *  - 460px min-height
 *  - Eyebrow: 10x10 accent square + uppercase "Less, chosen better"
 *  - Manrope 800 h2 + paragraph (#B8B5AD 16-18px lh 1.6) + orange CTA
 *  - Padding 40-48px on content; CTA never flush against edge
 */
export const FeatureCard = ({ product }: Props) => {
  const [imgErr, setImgErr] = useState(false);
  const src = product?.image?.replace(/\.jpg$/, '.svg') ?? product?.image ?? '';
  const link = product?._id ? `/product/${product._id}` : '#';

  return (
    <Box
      component="section"
      id="story"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        minHeight: { xs: 0, md: 460 },
        borderRadius: { xs: '18px', md: '24px' },
        overflow: 'hidden',
        bgcolor: '#262624',           // --surface
        border: '1px solid #3A3A36',  // --border
      }}
    >
      {/* Image left */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 240, md: 460 },
          overflow: 'hidden',
          // Deep neutral so any sub-pixel gap below the image stays dark
          bgcolor: '#1C1C1A',
        }}
      >
        {product && src && !imgErr ? (
          <Box
            component="img"
            src={src}
            alt={product.name}
            onError={() => setImgErr(true)}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), transparent 65%)',
            }}
          />
        )}
      </Box>

      {/* Copy right */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          // 40-48px padding all around (was 0 on desktop Y axis)
          px: { xs: 4, sm: 5, md: 6 },
          py: { xs: 5, sm: 6, md: 6 },
        }}
      >
        {/* Eyebrow: 10x10 accent square + uppercase label, flex + gap 10 */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{
            color: '#E8795A',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            mb: 2,
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
          Less, chosen better
        </Stack>

        <Typography
          component="h2"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8125rem, 3.2vw, 2.625rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.045em',
            color: '#F5F3EE',
            m: 0,
            mb: 2.5,
          }}
        >
          Buy fewer things.
          <Box component="span" sx={{ display: 'block' }}>
            Love them longer.
          </Box>
        </Typography>

        <Typography
          sx={{
            color: '#B8B5AD',
            fontSize: { xs: 16, md: 18 },
            lineHeight: 1.6,
            maxWidth: 460,
            mb: 4,
          }}
        >
          We believe the best products don&rsquo;t need to shout. We look for
          considered details, honest materials and everyday usefulness — so you
          can choose with confidence.
        </Typography>

        <Button
          component={RouterLink}
          to={link}
          variant="contained"
          size="large"
          endIcon={
            <Box component="span" sx={{ fontSize: 14, lineHeight: 1 }}>
              ↗
            </Box>
          }
          sx={{
            // Orange CTA — was primary.main cream + white (invisible)
            bgcolor: '#E8795A',
            color: '#1C1C1A',
            px: 3,            // 24px
            py: 1.75,         // 14px
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: 0,
            boxShadow: '0 6px 18px rgba(232, 121, 90, 0.28)',
            transition:
              'transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease',
            '&:hover': {
              bgcolor: '#d96a4b',
              transform: 'translateY(-2px)',
              boxShadow: '0 10px 24px rgba(232, 121, 90, 0.38)',
            },
            '&:focus-visible': {
              outline: '2px solid #F5F3EE',
              outlineOffset: 3,
            },
            '&:active': { transform: 'translateY(0)' },
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
          }}
        >
          Why ProShop
        </Button>
      </Box>
    </Box>
  );
};
