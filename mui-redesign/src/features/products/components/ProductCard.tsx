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
 *  - Image container: aspect-ratio 0.86, beige background, image centered
 *    with `mix-blend-mode: multiply`, hover scale 1.06
 *  - Tag (top-left, white pill) — reserved
 *  - Wishlist heart (top-right, 34px round white button)
 *  - Quick-add button (bottom, full width, dark pill) appears on card hover
 *  - Below: meta row (brand · rating), title, price
 *  - Clicking the card navigates to /product/:id
 */
export const ProductCard = ({ product }: Props) => {
  const { _id, name, image, brand, price, rating, numReviews, countInStock, category } = product;
  const outOfStock = countInStock === 0;
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
      className="product-card-root"
      component="article"
      sx={{
        minWidth: 0,
        position: 'relative',
        '&:hover .product-card-quickadd, &:focus-within .product-card-quickadd': {
          opacity: 1,
          transform: 'translateY(0)',
        },
      }}
    >
      {/* Image wrapper */}
      <Box
        component={RouterLink}
        to={`/product/${_id}`}
        sx={{
          display: 'block',
          position: 'relative',
          bgcolor: 'rgba(228, 229, 220, 0.55)',
          aspectRatio: '0.86',
          borderRadius: '15px',
          overflow: 'hidden',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <ProductImage src={image} alt={name} product={product} aspectRatio="100% / 100%" />

        {/* Wishlist heart (top-right) */}
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
          <WishlistButton productId={_id} size="small" />
        </Box>

        {/* Out of stock badge (top-left) */}
        {outOfStock && (
          <Box
            sx={{
              position: 'absolute',
              top: 13,
              left: 13,
              zIndex: 2,
              px: 1.125,
              py: 0.75,
              bgcolor: 'background.paper',
              borderRadius: 999,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'text.primary',
            }}
          >
            Out of stock
          </Box>
        )}

        {/* Quick add (bottom, hover-revealed) */}
        {!outOfStock && (
          <Button
            className="product-card-quickadd"
            onClick={handleQuickAdd}
            startIcon={<BagIcon sx={{ fontSize: 14 }} />}
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              zIndex: 2,
              borderRadius: 999,
              bgcolor: 'rgba(32, 33, 31, 0.94)',
              color: 'common.white',
              py: 1.25,
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'none',
              letterSpacing: '0.02em',
              opacity: 0,
              transform: 'translateY(8px)',
              transition: 'opacity 220ms ease, transform 220ms ease, background-color 200ms ease',
              '&:hover': { bgcolor: 'secondary.main' },
            }}
          >
            Quick add
          </Button>
        )}
      </Box>

      {/* Info */}
      <Box sx={{ pt: 1.875, px: 0.375, pb: 0.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1.25}
          sx={{ color: 'text.secondary', fontSize: 10, mb: 0.875 }}
        >
          <Box component="span" sx={{ textTransform: 'capitalize' }}>
            {brand || category}
          </Box>
          <ProductRating value={rating} numReviews={numReviews} size="small" />
        </Stack>

        <Typography
          component={RouterLink}
          to={`/product/${_id}`}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: 'text.primary',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.45,
            mb: 1.25,
            minHeight: '2.6em',
          }}
        >
          {name}
        </Typography>

        <PriceDisplay
          value={price}
          variant="body2"
          sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}
        />
      </Box>
    </Box>
  );
};
