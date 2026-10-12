import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  Box,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import type { Product } from '../types';
import { PriceDisplay } from './PriceDisplay';
import { ProductRating } from './ProductRating';
import { ProductImage } from './ProductImage';
import { WishlistButton } from '../../wishlist/components/WishlistButton';

interface Props {
  product: Product;
}

/**
 * Product card for grid display.
 * - Click → navigates to /product/:id
 * - Image, name, brand, rating, price, stock badge
 */
export const ProductCard = ({ product }: Props) => {
  const { _id, name, image, brand, price, rating, numReviews, countInStock } = product;
  const outOfStock = countInStock === 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/product/${_id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {/* Image */}
        <Box sx={{ position: 'relative' }}>
          <ProductImage src={image} alt={name} product={product} />
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
            <WishlistButton productId={_id} size="small" />
          </Box>
          {outOfStock && (
            <Chip
              label="Out of stock"
              color="error"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontWeight: 600,
                zIndex: 1,
              }}
            />
          )}
        </Box>

        {/* Content */}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}
          >
            {brand}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.6em',
            }}
          >
            {name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <ProductRating value={rating} numReviews={numReviews} size="small" />
          </Stack>
          <PriceDisplay value={price} variant="h6" color="primary.main" />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
