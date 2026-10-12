import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Grid2 as Grid,
  Chip,
  Button,
  IconButton,
  TextField,
  Divider,
  Card,
  CardContent,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Store as BrandIcon,
  Category as CategoryIcon,
  FiberManualRecord as DotIcon,
} from '@mui/icons-material';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ProductRating } from '../components/ProductRating';
import { ProductImage } from '../components/ProductImage';
import { PriceDisplay } from '../components/PriceDisplay';
import { StockBadge } from '../components/StockBadge';
import { ReviewItem } from '../components/ReviewItem';
import { ReviewForm } from '../components/ReviewForm';
import { useGetProductByIdQuery } from '../productApi';
import { useToast } from '../../../hooks/useToast';
import { useCart } from '../../cart/hooks';
import { fmtMoney } from '../../../utils/fmt';
import { WishlistButton } from '../../wishlist/components/WishlistButton';

/**
 * Product detail page.
 *
 * Layout:
 *   [Breadcrumbs (Home / Products / name)]
 *   [Hero: 2-col on md+ — image left, info right]
 *   [Customer reviews (existing ReviewItem + ReviewForm)]
 *
 * Visual language:
 *   - Pill buttons, Manrope 800 h1
 *   - Out-of-stock chip top-left of image
 *   - Wishlist heart top-right
 *   - Full-width CTA on mobile, fixed width on desktop
 */
export const ProductDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const { data: product, isLoading, isError, refetch } = useGetProductByIdQuery(id);

  const inc = () => {
    if (product) setQty((q) => Math.min(q + 1, product.countInStock));
  };
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ product, qty });
    toast.success(`Added ${qty} × ${product.name} to cart`);
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <Box sx={{ pt: { xs: 2, md: 3.5 } }}>
        <LoadingState variant="detail" />
      </Box>
    );
  }

  if (isError || !product) {
    return (
      <Box sx={{ pt: { xs: 2, md: 3.5 } }}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={
            <Box
              component="span"
              sx={{
                fontSize: 14,
                lineHeight: 1,
                transform: 'rotate(180deg)',
                display: 'inline-block',
              }}
            >
              →
            </Box>
          }
          sx={{
            mb: 2,
            borderRadius: 999,
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 12,
            px: 0.5,
            '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
          }}
          size="small"
        >
          Back to home
        </Button>
        <ErrorState
          title="Product not found"
          message="This product may have been removed or the link is broken."
          onRetry={refetch}
          fullPage
        />
      </Box>
    );
  }

  const { name, image, brand, category, description, rating, numReviews, price, countInStock, reviews } =
    product;
  const outOfStock = countInStock === 0;

  return (
    <Box sx={{ pt: { xs: 2, md: 3.5 } }}>
      {/* Breadcrumb */}
      <Breadcrumbs
        sx={{
          mb: { xs: 2.5, md: 3.5 },
          fontSize: '0.8125rem',
          '& .MuiBreadcrumbs-separator': { mx: 1, color: 'text.disabled' },
        }}
      >
        <Link component={RouterLink} to="/" underline="hover" color="text.secondary">
          Home
        </Link>
        <Link component={RouterLink} to="/" underline="hover" color="text.secondary">
          Products
        </Link>
        <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
          {name}
        </Typography>
      </Breadcrumbs>

      {/* Hero — 2-col on md+, single col on mobile */}
      <Grid container spacing={{ xs: 3, md: 5 }} alignItems="flex-start">
        {/* Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: { xs: 3, md: '18px' },
              border: '1px solid rgba(32,33,31,0.08)',
              boxShadow: 'none',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <ProductImage
                src={image}
                alt={name}
                product={product}
                aspectRatio="1 / 1"
              />
              {/* Out of stock chip — top left */}
              {outOfStock && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 2,
                    px: 1.25,
                    py: 0.625,
                    bgcolor: 'background.paper',
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'text.primary',
                    boxShadow: '0 2px 8px rgba(32,33,31,0.08)',
                  }}
                >
                  Out of stock
                </Box>
              )}
              {/* Wishlist heart — top right */}
              <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                <WishlistButton productId={product._id} size="medium" />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ pt: { xs: 0, md: 0.5 } }}>
            {/* Kicker (brand + category) */}
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              <Chip
                icon={<BrandIcon sx={{ fontSize: 14 }} />}
                label={brand}
                size="small"
                onClick={() => navigate(`/?brand=${encodeURIComponent(brand)}`)}
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  height: 26,
                  bgcolor: 'rgba(231, 232, 223, 0.5)',
                  color: 'text.primary',
                  border: '1px solid rgba(32,33,31,0.08)',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(231, 232, 223, 0.8)' },
                  '& .MuiChip-icon': { color: 'secondary.main' },
                }}
              />
              <Chip
                icon={<CategoryIcon sx={{ fontSize: 14 }} />}
                label={category}
                size="small"
                onClick={() => navigate(`/?category=${encodeURIComponent(category)}`)}
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  height: 26,
                  bgcolor: 'rgba(231, 232, 223, 0.5)',
                  color: 'text.primary',
                  border: '1px solid rgba(32,33,31,0.08)',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(231, 232, 223, 0.8)' },
                  '& .MuiChip-icon': { color: 'secondary.main' },
                }}
              />
            </Stack>

            {/* h1 */}
            <Typography
              component="h1"
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.5rem, 2.8vw, 2.125rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: 'text.primary',
                mb: 1.75,
              }}
            >
              {name}
            </Typography>

            {/* Rating row */}
            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2.5 }}>
              <ProductRating value={rating} numReviews={numReviews} size="small" />
              <DotIcon sx={{ fontSize: 4, color: 'text.disabled' }} />
              <Typography
                component="a"
                href="#reviews"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{
                  fontSize: 12,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': { color: 'secondary.main' },
                }}
              >
                {numReviews} {numReviews === 1 ? 'review' : 'reviews'}
              </Typography>
            </Stack>

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <PriceDisplay
                value={price}
                variant="h4"
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: 28, sm: 32 },
                  color: 'text.primary',
                  letterSpacing: '-0.02em',
                }}
              />
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            {/* Description */}
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: 1.65,
                color: 'text.primary',
                mb: 3,
              }}
            >
              {description}
            </Typography>

            {/* Stock */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ mb: 2.5 }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  minWidth: 72,
                }}
              >
                Stock
              </Typography>
              <StockBadge count={countInStock} />
              {!outOfStock && countInStock <= 5 && (
                <Typography sx={{ fontSize: 12, color: 'warning.main', fontWeight: 600 }}>
                  Only {countInStock} left
                </Typography>
              )}
            </Stack>

            {/* Quantity stepper */}
            {!outOfStock && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 3 }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    minWidth: 72,
                  }}
                >
                  Qty
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 999,
                    bgcolor: 'background.paper',
                    overflow: 'hidden',
                  }}
                >
                  <IconButton
                    onClick={dec}
                    disabled={qty <= 1}
                    size="small"
                    sx={{ borderRadius: 0, px: 1.25 }}
                    aria-label="decrease quantity"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField
                    value={qty}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 1;
                      setQty(Math.max(1, Math.min(v, countInStock)));
                    }}
                    type="number"
                    size="small"
                    sx={{
                      width: 56,
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      '& input': {
                        textAlign: 'center',
                        p: 0.5,
                        fontSize: 14,
                        fontWeight: 600,
                      },
                    }}
                    inputProps={{ min: 1, max: countInStock, 'aria-label': 'quantity' }}
                  />
                  <IconButton
                    onClick={inc}
                    disabled={qty >= countInStock}
                    size="small"
                    sx={{ borderRadius: 0, px: 1.25 }}
                    aria-label="increase quantity"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            )}

            {/* CTA — full-width on mobile, fixed on desktop */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                alignItems: { xs: 'stretch', sm: 'center' },
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                startIcon={<CartIcon sx={{ fontSize: 18 }} />}
                disabled={outOfStock}
                onClick={handleAddToCart}
                sx={{
                  py: 1.75,
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 999,
                  px: 2.75,
                  letterSpacing: '0.02em',
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: { sm: 260 },
                  '&:hover': { bgcolor: 'secondary.dark' },
                }}
              >
                {outOfStock
                  ? 'Out of stock'
                  : `Add to cart — ${fmtMoney(price * qty)}`}
              </Button>
            </Box>

            {qty >= countInStock && !outOfStock && (
              <Alert
                severity="warning"
                sx={{ mt: 2, borderRadius: 2, fontSize: 12, py: 0.5 }}
              >
                You've reached the maximum available quantity.
              </Alert>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Reviews */}
      <Box id="reviews" sx={{ mt: { xs: 6, md: 8 } }}>
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.25,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'secondary.main',
              mb: 1.25,
            }}
          >
            <Box sx={{ width: 24, height: 1, bgcolor: 'currentColor' }} />
            What people are saying
          </Box>
          <Typography
            component="h2"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.5rem, 2.6vw, 2rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'text.primary',
              m: 0,
            }}
          >
            Customer reviews
          </Typography>
          <Typography sx={{ mt: 1.25, fontSize: 13, color: 'text.secondary' }}>
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} · average{' '}
            {rating.toFixed(1)} / 5
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(32,33,31,0.08)',
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                {reviews.length === 0 ? (
                  <EmptyState
                    title="No reviews yet"
                    description="Be the first to share your thoughts on this product."
                  />
                ) : (
                  <Box>
                    {reviews.map((r) => (
                      <Box key={r._id}>
                        <ReviewItem review={r} />
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(32,33,31,0.08)',
                boxShadow: 'none',
                position: { md: 'sticky' },
                top: { md: 96 },
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <ReviewForm productId={id} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
