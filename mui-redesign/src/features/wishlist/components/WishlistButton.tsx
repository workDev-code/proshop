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
 *  - Hidden if user not logged in (unless showForAnonymous)
 *  - Filled = in wishlist; outlined = not in wishlist
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
    <Tooltip title={displayed ? 'Remove from wishlist' : 'Add to wishlist'}>
      <span>
        <IconButton
          onClick={handleClick}
          size={size}
          disabled={isLoading}
          sx={{
            color: displayed ? 'error.main' : 'text.secondary',
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': {
              bgcolor: 'background.paper',
              transform: 'scale(1.05)',
            },
            transition: 'all 200ms ease',
          }}
        >
          {isLoading ? (
            <CircularProgress size={18} color="inherit" />
          ) : displayed ? (
            <FavoriteIcon fontSize={size === 'large' ? 'medium' : 'small'} />
          ) : (
            <FavoriteBorderIcon fontSize={size === 'large' ? 'medium' : 'small'} />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};
