import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import type { Product } from '../types';

interface Props {
  /** Up to two products to source imagery / titles from. */
  items: Product[];
}

/**
 * 2-col asymmetric grid (1.15fr / 0.85fr) of editorial cards.
 * Matches `.editorial` / `.editorial-card` / `.editorial-copy` from
 * the approved HTML prototype.
 *
 *  - Image background, dark left-to-right gradient overlay
 *  - Eyebrow + Manrope h3 + text-link in white
 *  - The whole card is a Link to /product/:id
 *
 *  Skips rendering entirely when no items are provided (no mock fallback).
 */
export const EditorialCards = ({ items }: Props) => {
  if (items.length === 0) return null;

  return (
    <Box
      component="section"
      id="journal"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
        gap: { xs: 2, md: 2.25 },
      }}
    >
      {items.map((p, i) => (
        <EditorialCard key={p._id} product={p} index={i} />
      ))}
    </Box>
  );
};

interface CardProps {
  product: Product;
  index: number;
}

const TITLES = [
  'A simpler approach to everyday style',
  'Make room for what matters',
];
const KICKERS = [
  { label: 'Style', read: '5 min read' },
  { label: 'Living', read: '3 min read' },
];

const EditorialCard = ({ product, index }: CardProps) => {
  const [imgErr, setImgErr] = useState(false);
  const src = product.image?.replace(/\.jpg$/, '.svg') ?? product.image ?? '';
  const title = TITLES[index] ?? product.name;
  const kicker = KICKERS[index] ?? { label: 'Editorial', read: '4 min read' };

  return (
    <Box
      component={RouterLink}
      to={`/product/${product._id}`}
      sx={{
        position: 'relative',
        borderRadius: { xs: '16px', md: '20px' },
        minHeight: { xs: 235, md: 270 },
        overflow: 'hidden',
        bgcolor: 'rgba(222, 223, 213, 0.7)',
        display: 'block',
        textDecoration: 'none',
        color: 'common.white',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 250ms ease, box-shadow 250ms ease',
        '&:hover': { transform: 'translateY(-2px)' },
        '&:hover .editorial-img': { transform: 'scale(1.04)' },
      }}
    >
      {src && !imgErr ? (
        <Box
          className="editorial-img"
          component="img"
          src={src}
          alt={product.name}
          onError={() => setImgErr(true)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 500ms ease',
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
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), transparent 65%)',
          }}
        />
      )}

      {/* Dark gradient overlay (left → right) */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(22,24,20,0.63) 0%, transparent 95%)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          zIndex: 2,
          left: { xs: 23, md: 30 },
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: 280,
          color: 'common.white',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            fontSize: '0.5625rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          <span>
            {kicker.label} · {kicker.read}
          </span>
        </Stack>

        <Typography
          component="h3"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 800,
            fontSize: { xs: '1.375rem', md: '1.6875rem' },
            lineHeight: 1.12,
            letterSpacing: '-0.04em',
            color: 'common.white',
            mt: 1.5,
            mb: 1.5,
            m: 0,
          }}
        >
          {title}
        </Typography>

        <Box
          component="span"
          sx={{
            display: 'inline-block',
            fontSize: '0.6875rem',
            fontWeight: 600,
            borderBottom: '1px solid rgba(255,255,255,0.7)',
            pb: 0.625,
            color: 'common.white',
          }}
        >
          Read the story ↗
        </Box>
      </Box>
    </Box>
  );
};
