import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { Product } from '../types';

interface Props {
  src: string;
  alt: string;
  product?: Product;
  /** aspect ratio of the image container (default 1/1) */
  aspectRatio?: string;
  /** When true, render full-size for detail page */
  large?: boolean;
}

/**
 * Branded product image with graceful fallback.
 *
 *  1. Tries the URL from the seed data
 *  2. If it ends in .jpg, swaps to .svg (we ship SVG assets for these products)
 *  3. If loading fails, renders a clean branded placeholder with brand color
 *     and the first letter of the product name
 */
export const ProductImage = ({
  src,
  alt,
  product,
  aspectRatio = '1 / 1',
}: Props) => {
  const [errored, setErrored] = useState(false);
  // Map .jpg → .svg for the products we ship SVG versions of
  const finalSrc = src?.replace(/\.jpg$/, '.svg') ?? src;

  if (errored || !finalSrc) {
    return <FallbackImage product={product} alt={alt} aspectRatio={aspectRatio} />;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        aspectRatio,
        bgcolor: 'action.hover',
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={finalSrc}
        alt={alt}
        loading="lazy"
        onError={() => setErrored(true)}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </Box>
  );
};

interface FallbackProps {
  product?: Product;
  alt: string;
  aspectRatio: string;
}

/**
 * Branded placeholder shown when the real image fails to load.
 * - Gradient background based on brand initial (deterministic color)
 * - Big product initial letter
 * - Product name + brand below
 */
const BRAND_COLORS: Record<string, [string, string]> = {
  apple: ['#1a1a2e', '#374151'],
  canon: ['#7f1d1d', '#1f2937'],
  sony: ['#0f172a', '#1e3a8a'],
  logitech: ['#18181b', '#27272a'],
  amazon: ['#0c0a1f', '#1e1b4b'],
};

const DEFAULT_COLORS: [string, string] = ['#1e293b', '#0f172a'];

const FallbackImage = ({ product, alt, aspectRatio }: FallbackProps) => {
  const brand = product?.brand?.toLowerCase() ?? '';
  const colors = BRAND_COLORS[brand] ?? DEFAULT_COLORS;
  const initial = (product?.name?.[0] ?? alt?.[0] ?? '?').toUpperCase();

  return (
    <Box
      role="img"
      aria-label={alt}
      sx={{
        aspectRatio,
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 50%)',
        },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '4rem', sm: '5rem', md: '6rem' },
          fontWeight: 800,
          color: 'rgba(255,255,255,0.15)',
          lineHeight: 1,
          letterSpacing: '-0.05em',
          userSelect: 'none',
        }}
      >
        {initial}
      </Typography>
      {product && (
        <Box sx={{ mt: 2, textAlign: 'center', position: 'relative' }}>
          <Typography
            sx={{
              fontSize: { xs: '0.625rem', sm: '0.75rem' },
              fontWeight: 700,
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            {product.brand}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              color: 'rgba(255,255,255,0.5)',
              mt: 0.5,
              maxWidth: '80%',
              mx: 'auto',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
