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
 *  - Solid --surface panel so it does not wash out on dark.
 *  - BOTTOM-only gradient overlay (transparent → rgba(0,0,0,0.65))
 *    so the white copy sits on a darkened band, image stays full color
 *    on top half.
 *  - 1-card mode: the only card spans both columns (no empty half).
 *  - Kicker 12px, title 24-28px, "Read the story" 14px underlined.
 *  - Card hover: image scale(1.03), accent-tinted border.
 *  - focus-visible outline accent for keyboard users.
 *
 *  Skips rendering entirely when no items are provided.
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
        gap: { xs: 2.25, md: 2.25 },
      }}
    >
      {items.map((p, i) => (
        <Box
          key={p._id}
          sx={{
            // If only one editorial item, let it span the full width
            gridColumn: items.length === 1 ? { md: '1 / -1' } : 'auto',
          }}
        >
          <EditorialCard product={p} index={i} />
        </Box>
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
      aria-label={`${title} — read the story`}
      sx={{
        position: 'relative',
        display: 'block',
        borderRadius: { xs: '16px', md: '20px' },
        minHeight: { xs: 240, md: 320 },
        height: '100%',
        overflow: 'hidden',
        bgcolor: '#262624',
        border: '1px solid #3A3A36',
        textDecoration: 'none',
        color: '#F5F3EE',
        transition:
          'transform 280ms ease, box-shadow 280ms ease, border-color 280ms ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 18px 40px rgba(0, 0, 0, 0.35)',
          borderColor: 'rgba(232, 121, 90, 0.40)',
        },
        '&:hover .editorial-img': { transform: 'scale(1.03)' },
        '&:focus-visible': {
          outline: '2px solid #E8795A',
          outlineOffset: 3,
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
        },
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
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
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

      {/* Bottom-only gradient: transparent on top half, dark on bottom half.
          This keeps the image visible while the copy band stays legible. */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.78) 100%)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          zIndex: 2,
          left: { xs: 24, md: 32 },
          right: { xs: 24, md: 32 },
          bottom: { xs: 24, md: 32 },
          color: '#F5F3EE',
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          sx={{
            color: '#B8B5AD',
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 600,
            mb: 1.5,
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
            fontSize: { xs: 22, md: 28 },
            lineHeight: 1.12,
            letterSpacing: '-0.04em',
            color: '#F5F3EE',
            m: 0,
            mb: 2,
            maxWidth: 480,
          }}
        >
          {title}
        </Typography>

        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: 14,
            fontWeight: 600,
            color: '#F5F3EE',
            borderBottom: '1px solid rgba(245, 243, 238, 0.7)',
            pb: 0.75,
            transition: 'color 200ms ease, border-color 200ms ease',
            '.parent:hover &': {
              color: '#E8795A',
              borderColor: '#E8795A',
            },
          }}
        >
          Read the story ↗
        </Box>
      </Box>
    </Box>
  );
};
