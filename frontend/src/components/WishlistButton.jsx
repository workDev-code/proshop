import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from '../slices/wishlistApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

/**
 * Reusable heart icon button.
 * - Filled red when product is in wishlist, outline when not
 * - Requires user to be logged in (otherwise redirects to /login)
 */
const WishlistButton = ({ productId, size = 'sm', className = '' }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Lazy query - only fetch when logged in
  const { data: wishlist = [], refetch } = useGetWishlistQuery(undefined, {
    skip: !userInfo,
  });

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isInWishlist = wishlist.some((p) => p._id === productId);

  // Re-sync after mutation
  useEffect(() => {
    if (userInfo) refetch();
  }, [userInfo, refetch]);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      toast.info('Please sign in to use wishlist');
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(productId).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(productId).unwrap();
        toast.success('Added to wishlist');
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Wishlist error');
    }
  };

  return (
    <Button
      variant='link'
      size={size}
      className={`p-1 text-decoration-none ${className}`}
      onClick={handleClick}
      aria-label={
        isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
      }
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isInWishlist ? (
        <FaHeart style={{ color: 'red' }} />
      ) : (
        <FaRegHeart style={{ color: '#888' }} />
      )}
    </Button>
  );
};

export default WishlistButton;
