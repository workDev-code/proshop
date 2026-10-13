import { useState } from 'react';
import { Box } from '@mui/material';
import { ImageOutlined as ImageIcon } from '@mui/icons-material';
import type { Product } from '../types';

interface Props {
  src: string;
  alt: string;
  product?: Product;
  /** aspect ratio of the image container (default 4/5 per design spec) */
  aspectRatio?: string;
  /** When true, render full-size for detail page */
  large?: boolean;
}

/**
 * Branded product image with graceful fallback.
 *
 *  1. Tries the URL from the seed data
 *  2. If it ends in .jpg, swaps to .svg (we ship SVG assets for these products)
 *  3. If loading fails, renders a clean gradient placeholder with a generic
 *     image icon — does NOT duplicate the product name (avoids the visual
 *     bug where fallback looked like a literal mockup).
 */
export const ProductImage = ({
  src,
  alt,
  product,
  aspectRatio = '4 / 5',
}: Props) => {
  const [errored, setErrored] = useState(false);
  const finalSrc = src?.replace(/\.jpg$/, '.svg') ?? src;

  if (errored || !finalSrc) {
    return <FallbackImage product={product} alt={alt} aspectRatio={aspectRatio} />;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        aspectRatio,
        // Surface-2 base so any sub-pixel gap below the image is consistent
        // with the card surface (no gray stripe showing through).
        bgcolor: '#2F2F2C',
        overflow: 'hidden',
        width: '100%',
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
 * Gradient + image-icon placeholder. We deliberately do NOT render the
 * product name or brand inside the image (that was the "T / FIELD" bug
 * from the prototype which duplicated the info card below).
 */
const BRAND_COLORS: Record<string, [string, string]> = {
  apple: ['#1a1a2e', '#374151'],
  canon: ['#7f1d1d', '#1f2937'],
  sony: ['#0f172a', '#1e3a8a'],
  logitech: ['#18181b', '#27272a'],
  amazon: ['#0c0a1f', '#1e1b4b'],
};

const DEFAULT_COLORS: [string, string] = ['#2F2F2C', '#1C1C1A'];

const FallbackImage = ({ product, alt, aspectRatio }: FallbackProps) => {
  const brand = product?.brand?.toLowerCase() ?? '';
  const colors = BRAND_COLORS[brand] ?? DEFAULT_COLORS;

  return (
    <Box
      role="img"
      aria-label={alt}
      sx={{
        aspectRatio,
        width: '100%',
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.06), transparent 50%)',
        },
      }}
    >
      <ImageIcon
        aria-hidden
        sx={{
          fontSize: { xs: 48, md: 64 },
          color: 'rgba(255,255,255,0.18)',
          position: 'relative',
        }}
      />
    </Box>
  );
};
