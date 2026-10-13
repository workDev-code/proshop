import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Stack, Button } from '@mui/material';
import { ShoppingBag as BagIcon } from '@mui/icons-material';
import type { Product } from '../types';
import { PriceDisplay } from './PriceDisplay';
import { ProductRating } from './ProductRating';
import { ProductImage } from './ProductImage';
import { WishlistButton } from '../../wishlist/components/WishlistButton';
import { useCart } from '../../cart/hooks';
import { useToast } from '../../../hooks/useToast';

interface Props {
  product: Product;
}

/**
 * Product card matching `.product-card` from the approved HTML prototype.
 *
 *  - Image container: aspect-ratio 4/5, surface-2 fill, image `object-fit: cover`
 *  - Sale pill (top-left): brand orange #E8795A + dark text
 *  - Wishlist heart (top-right): 36x36 round, rgba(0,0,0,0.5) bg, active = accent
 *  - Quick-add button (bottom, full width, dark pill) appears on
 *    card hover OR focus-within OR on touch devices (always visible)
 *  - Below: meta row (brand · rating), title, price
 *  - Sale: current price in accent + strikethrough compareAtPrice in muted
 *  - Card hover: translateY(-4px) + soft shadow
 */
export const ProductCard = ({ product }: Props) => {
  const { _id, name, image, brand, price, compareAtPrice, rating, numReviews, countInStock, category } =
    product;
  const outOfStock = countInStock === 0;
  const onSale = typeof compareAtPrice === 'number' && compareAtPrice > price;
  const { addItem } = useCart();
  const toast = useToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem({ product, qty: 1 });
    toast.success(`Added ${name} to bag`);
  };

  return (
    <Box
      component="article"
      aria-label={name}
      sx={{
        minWidth: 0,
        position: 'relative',
        bgcolor: '#262624',        // --surface
        border: '1px solid #3A3A36', // --border
        borderRadius: '16px',
        overflow: 'hidden',
        transition:
          'transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease',
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 18px 40px rgba(0, 0, 0, 0.35)',
          borderColor: 'rgba(232, 121, 90, 0.35)',
        },
        '&:focus-within': {
          borderColor: '#E8795A',
        },
        // Reveal Quick add on hover, focus-within, OR touch devices
        '& .product-card-quickadd': {
          opacity: 0,
          transform: 'translateY(8px)',
          pointerEvents: 'none',
        },
        '&:hover .product-card-quickadd, &:focus-within .product-card-quickadd': {
          opacity: 1,
          transform: 'translateY(0)',
          pointerEvents: 'auto',
        },
        '@media (hover: none)': {
          '& .product-card-quickadd': {
            opacity: 1,
            transform: 'none',
            pointerEvents: 'auto',
          },
        },
      }}
    >
      {/* Image wrapper */}
      <Box
        component={RouterLink}
        to={`/product/${_id}`}
        aria-label={`View ${name}`}
        sx={{
          display: 'block',
          position: 'relative',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <ProductImage src={image} alt={name} product={product} aspectRatio="4 / 5" />

        {/* Wishlist heart (top-right) */}
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
          <WishlistButton productId={_id} size="small" />
        </Box>

        {/* On sale pill (top-left) */}
        {onSale && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
              px: 1.25,
              py: 0.5,
              bgcolor: '#E8795A',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#1C1C1A',
            }}
          >
            Sale
          </Box>
        )}

        {/* Out of stock badge (top-left) — takes priority when both apply */}
        {outOfStock && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
              px: 1.25,
              py: 0.5,
              bgcolor: '#1C1C1A',
              border: '1px solid #3A3A36',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#F5F3EE',
            }}
          >
            Out of stock
          </Box>
        )}

        {/* Quick add (bottom, hover/focus/touch-revealed) */}
        {!outOfStock && (
          <Button
            className="product-card-quickadd"
            onClick={handleQuickAdd}
            aria-label={`Quick add ${name} to bag`}
            startIcon={<BagIcon sx={{ fontSize: 16 }} />}
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              zIndex: 2,
              borderRadius: 999,
              bgcolor: 'rgba(28, 28, 26, 0.94)',
              color: '#F5F3EE',
              py: 1.25,
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'none',
              letterSpacing: '0.02em',
              transition:
                'opacity 220ms ease, transform 220ms ease, background-color 200ms ease',
              '&:hover': { bgcolor: '#E8795A', color: '#1C1C1A' },
              '&:focus-visible': {
                outline: '2px solid #E8795A',
                outlineOffset: 2,
              },
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
              },
            }}
          >
            Quick add
          </Button>
        )}
      </Box>

      {/* Info block — 16px padding all around */}
      <Box sx={{ p: 2 }}>
        {/* Row 1: brand + rating count */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 0.75, minHeight: 20 }}
        >
          <Box
            component="span"
            sx={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#B8B5AD',
            }}
          >
            {brand || category}
          </Box>
          <ProductRating value={rating} numReviews={numReviews} size="small" />
        </Stack>

        {/* Row 2: product name — 16px, 2 lines max */}
        <Typography
          component={RouterLink}
          to={`/product/${_id}`}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: '#F5F3EE',
            textDecoration: 'none',
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.35,
            minHeight: '2.7em',
            '&:hover': { color: '#E8795A' },
          }}
        >
          {name}
        </Typography>

        {/* Row 3: price — 8px gap from name */}
        <Stack
          direction="row"
          alignItems="baseline"
          spacing={1}
          sx={{ mt: 1 }}
        >
          <PriceDisplay
            value={price}
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: onSale ? '#E8795A' : '#F5F3EE',
            }}
          />
          {onSale && (
            <Typography
              component="span"
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: '#B8B5AD',
                textDecoration: 'line-through',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}
            >
              ${compareAtPrice!.toFixed(2)}
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
