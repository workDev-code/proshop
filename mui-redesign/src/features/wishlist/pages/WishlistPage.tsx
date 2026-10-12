import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import {
  FavoriteBorder as HeartIcon,
  ArrowForward as ArrowIcon,
  DeleteSweep as ClearIcon,
} from '@mui/icons-material';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ProductCard } from '../../products/components/ProductCard';
import {
  useGetWishlistQuery,
  useClearWishlistMutation,
} from '../wishlistApi';
import { useToast } from '../../../hooks/useToast';

/**
 * Wishlist page.
 *
 * Layout:
 *   [editorial header — kicker "Saved for you" + h1 "Your wishlist"]
 *   [3- or 4-col product grid reusing the storefront ProductCard]
 *   [empty state with "Browse products" pill button]
 *
 * Clears the entire wishlist via DELETE /api/users/wishlist.
 */
export const WishlistPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { data, isLoading } = useGetWishlistQuery();
  const [clearWishlist, { isLoading: clearing }] = useClearWishlistMutation();

  const count = data?.length ?? 0;

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
    <Box sx={{ pt: { xs: 2, md: 3.5 } }}>
      {/* Editorial header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
        spacing={2}
        sx={{ mb: { xs: 3, md: 4.5 } }}
      >
        <Box>
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
            <Box
              sx={{
                width: 24,
                height: 1,
                bgcolor: 'currentColor',
                display: 'inline-block',
              }}
            />
            Saved for you
          </Box>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.75rem, 3vw, 2.375rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              color: 'text.primary',
              m: 0,
            }}
          >
            Your wishlist
          </Typography>
          {!isLoading && (
            <Typography sx={{ mt: 1.25, fontSize: 13, color: 'text.secondary' }}>
              {count === 0
                ? 'Save your favorite items and come back to them anytime.'
                : `${count} ${count === 1 ? 'item' : 'items'} you've been keeping an eye on`}
            </Typography>
          )}
        </Box>

        {count > 0 && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClear}
            disabled={clearing}
            startIcon={<ClearIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: 999,
              borderColor: 'divider',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 12,
              px: 2.25,
              py: 1,
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'error.main',
                color: 'error.main',
                bgcolor: 'transparent',
              },
            }}
          >
            Clear all
          </Button>
        )}
      </Stack>

      {/* Body */}
      {isLoading ? (
        <LoadingState variant="card" count={4} />
      ) : !data || data.length === 0 ? (
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid rgba(32,33,31,0.08)',
            bgcolor: 'background.paper',
            py: { xs: 6, sm: 8 },
          }}
        >
          <EmptyState
            icon={<HeartIcon sx={{ fontSize: 28 }} />}
            title="Your wishlist is empty"
            description="Tap the heart on any product to save it here for later. Your shortlist lives across devices."
            action={{
              label: 'Browse products',
              onClick: () => navigate('/'),
              icon: <ArrowIcon sx={{ fontSize: 16 }} />,
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2.75, md: 2.25 },
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
          }}
        >
          {data.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Box>
      )}
    </Box>
  );
};
