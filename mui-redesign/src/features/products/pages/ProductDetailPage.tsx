import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography, Grid2 as Grid,
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
  ArrowBack as BackIcon,
  Store as BrandIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
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

export const ProductDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const { data: product, isLoading, isError, refetch } = useGetProductByIdQuery(id);

  const inc = () => {
    if (product) setQty((q) => Math.min(q + 1, product.countInStock));
  };
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    // Cart wiring lands in Phase 4. For now, show toast + redirect to /cart (404 for now).
    toast.success(`Added ${qty} × ${product?.name} to cart`);
  };

  if (isLoading) {
    return <LoadingState variant="detail" />;
  }

  if (isError || !product) {
    return (
      <Box>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<BackIcon />}
          sx={{ mb: 2 }}
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
    <Box>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 2, fontSize: '0.875rem' }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Products
        </Link>
        <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
          {name}
        </Typography>
      </Breadcrumbs>

      <Button
        component={RouterLink}
        to="/"
        startIcon={<BackIcon />}
        size="small"
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Grid container spacing={4}>
        {/* Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ position: 'relative' }}>
              <ProductImage src={image} alt={name} product={product} />
              {outOfStock && (
                <Chip
                  label="Out of stock"
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            {/* Brand + Category */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                icon={<BrandIcon />}
                label={brand}
                variant="outlined"
                size="small"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/?brand=${encodeURIComponent(brand)}`)}
              />
              <Chip
                icon={<CategoryIcon />}
                label={category}
                variant="outlined"
                size="small"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/?category=${encodeURIComponent(category)}`)}
              />
            </Stack>

            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {name}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2}>
              <ProductRating value={rating} numReviews={numReviews} size="medium" />
              <Typography variant="body2" color="text.secondary">
                · {numReviews} {numReviews === 1 ? 'review' : 'reviews'}
              </Typography>
            </Stack>

            <PriceDisplay value={price} variant="h4" color="primary.main" />

            <Divider />

            <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
              {description}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                Status:
              </Typography>
              <StockBadge count={countInStock} />
            </Stack>

            {!outOfStock && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                  Quantity:
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <IconButton onClick={dec} disabled={qty <= 1} size="small">
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
                      width: 60,
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      '& input': { textAlign: 'center', p: 1 },
                    }}
                    inputProps={{ min: 1, max: countInStock }}
                  />
                  <IconButton
                    onClick={inc}
                    disabled={qty >= countInStock}
                    size="small"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<CartIcon />}
              disabled={outOfStock}
              onClick={handleAddToCart}
              sx={{ py: 1.5, mt: 1 }}
            >
              {outOfStock ? 'Out of stock' : `Add to cart — ${(price * qty).toFixed(2)}`}
            </Button>

            {qty >= countInStock && !outOfStock && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                You've reached the maximum available quantity.
              </Alert>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Reviews */}
      <Box sx={{ mt: 6 }}>
        <PageHeader title="Customer Reviews" subtitle={`${reviews.length} review(s)`} />
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                {reviews.length === 0 ? (
                  <EmptyState
                    title="No reviews yet"
                    description="Be the first to share your thoughts on this product."
                  />
                ) : (
                  <Box>
                    {reviews.map((r) => (
                      <ReviewItem key={r._id} review={r} />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <ReviewForm productId={id} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
