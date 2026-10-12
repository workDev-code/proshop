import {
  Box,
  Card,
  CardContent,
  Button,
  Grid2 as Grid,
} from '@mui/material';
import {
  Favorite as WishlistIcon,
  ClearAll as ClearIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ProductCard } from '../../products/components/ProductCard';
import {
  useGetWishlistQuery,
  useClearWishlistMutation,
} from '../wishlistApi';
import { useToast } from '../../../hooks/useToast';

export const WishlistPage = () => {
  const toast = useToast();
  const { data, isLoading } = useGetWishlistQuery();
  const [clearWishlist, { isLoading: clearing }] = useClearWishlistMutation();

  const handleClear = async () => {
    if (!data || data.length === 0) return;
    if (!confirm(`Remove all ${data.length} items from your wishlist?`)) return;
    try {
      await clearWishlist().unwrap();
      toast.info('Wishlist cleared');
    } catch {
      toast.error('Failed to clear wishlist');
    }
  };

  return (
    <Box>
      <PageHeader
        title="My Wishlist"
        subtitle={
          data ? `${data.length} ${data.length === 1 ? 'item' : 'items'} saved` : ''
        }
        icon={<WishlistIcon />}
        actions={
          data && data.length > 0 ? (
            <Button
              variant="outlined"
              color="error"
              startIcon={<ClearIcon />}
              onClick={handleClear}
              disabled={clearing}
              size="small"
            >
              Clear all
            </Button>
          ) : null
        }
      />

      {isLoading ? (
        <LoadingState variant="card" count={4} />
      ) : !data || data.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              title="Your wishlist is empty"
              description="Save items you love to your wishlist and come back to them later."
              action={{
                label: 'Browse products',
                onClick: () => (window.location.href = '/'),
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {data.map((product) => (
            <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
