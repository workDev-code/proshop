import { useState, useEffect } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from '../wishlistApi';
import { useCurrentUser } from '../../auth/hooks';
import { useToast } from '../../../hooks/useToast';

interface Props {
  productId: string;
  size?: 'small' | 'medium' | 'large';
  /** Show always; otherwise hide if not logged in */
  showForAnonymous?: boolean;
}

/**
 * Heart icon button that toggles product in/out of the current user's wishlist.
 *  - 36x36 round button (per design spec)
 *  - Background: rgba(0,0,0,0.5) for contrast against any product image
 *  - Active state: filled heart in brand accent #E8795A
 *  - Hidden if user not logged in (unless showForAnonymous)
 *  - Click triggers optimistic update + invalidates the wishlist cache
 */
export const WishlistButton = ({
  productId,
  size = 'medium',
  showForAnonymous = false,
}: Props) => {
  const toast = useToast();
  const { isAuthenticated } = useCurrentUser();
  const { data: wishlist } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [addToWishlist, { isLoading: adding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: removing }] = useRemoveFromWishlistMutation();
  const isLoading = adding || removing;

  const inWishlist = !!wishlist?.some((p) => p._id === productId);
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  useEffect(() => {
    setOptimistic(null);
  }, [inWishlist]);

  if (!isAuthenticated && !showForAnonymous) return null;

  const displayed = optimistic !== null ? optimistic : inWishlist;
  const ariaLabel = displayed
    ? 'Remove from wishlist'
    : 'Add to wishlist';

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please sign in to save items');
      return;
    }
    if (isLoading) return;
    try {
      if (displayed) {
        setOptimistic(false);
        await removeFromWishlist(productId).unwrap();
        toast.info('Removed from wishlist');
      } else {
        setOptimistic(true);
        await addToWishlist(productId).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Failed to update wishlist');
      setOptimistic(null);
    }
  };

  return (
    <Tooltip title={ariaLabel}>
      <span>
        <IconButton
          onClick={handleClick}
          aria-label={ariaLabel}
          aria-pressed={displayed}
          disabled={isLoading}
          size={size}
          sx={{
            width: 36,
            height: 36,
            color: displayed ? '#E8795A' : '#F5F3EE',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.08)',
            transition:
              'background-color 200ms ease, transform 200ms ease, color 200ms ease',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              transform: 'scale(1.06)',
            },
            '&:focus-visible': {
              outline: '2px solid #E8795A',
              outlineOffset: 2,
            },
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={16} sx={{ color: 'inherit' }} />
          ) : displayed ? (
            <FavoriteIcon sx={{ fontSize: 18 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};
