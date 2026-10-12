import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
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
 *  - 24px radius, beige #dedfd5 background
 *  - 370px min-height
 *  - Eyebrow + Manrope 800 h2 + paragraph + dark pill CTA
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
        minHeight: { xs: 0, md: 370 },
        borderRadius: { xs: '18px', md: '24px' },
        overflow: 'hidden',
        bgcolor: 'rgba(222, 223, 213, 0.7)', // beige #dedfd5
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Image left */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 235, md: 370 },
          overflow: 'hidden',
          bgcolor: 'rgba(210, 215, 202, 0.6)',
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
                'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 65%)',
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
          px: { xs: 4, sm: 6, md: '12%' },
          py: { xs: 5, sm: 6, md: 0 },
        }}
      >
        <Typography
          sx={{
            fontSize: '0.625rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            '&::before': {
              content: '""',
              display: 'inline-block',
              width: 24,
              height: 1,
              bgcolor: 'currentColor',
            },
          }}
        >
          Less, chosen better
        </Typography>

        <Typography
          component="h2"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8125rem, 3.2vw, 2.625rem)',
            lineHeight: 1.12,
            letterSpacing: '-0.045em',
            color: 'text.primary',
            mt: 2,
            mb: 0,
          }}
        >
          Buy fewer things.
          <Box component="span" sx={{ display: 'block' }}>
            Love them longer.
          </Box>
        </Typography>

        <Typography
          sx={{
            fontSize: '0.8125rem',
            lineHeight: 1.8,
            color: 'text.secondary',
            maxWidth: 370,
            mt: 2.5,
            mb: 3,
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
          Why ProShop
        </Button>
      </Box>
    </Box>
  );
};
