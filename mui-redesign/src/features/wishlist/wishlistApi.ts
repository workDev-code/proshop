import { api } from '../../store/api';
import type { Product } from '../products/types';

/**
 * Wishlist API endpoints (see backend/controllers/wishlistController.js).
 *
 * Backend routes:
 *   GET    /api/users/wishlist           get my wishlist (auth)
 *   POST   /api/users/wishlist/:id       add product (auth)
 *   DELETE /api/users/wishlist/:id       remove product (auth)
 *   DELETE /api/users/wishlist           clear all (auth)
 */
export const wishlistApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWishlist: build.query<Product[], void>({
      query: () => '/api/users/wishlist',
      providesTags: ['Wishlist'],
    }),

    addToWishlist: build.mutation<Product[], string>({
      query: (productId) => ({
        url: `/api/users/wishlist/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Wishlist'],
    }),

    removeFromWishlist: build.mutation<Product[], string>({
      query: (productId) => ({
        url: `/api/users/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),

    clearWishlist: build.mutation<Product[], void>({
      query: () => ({ url: '/api/users/wishlist', method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} = wishlistApi;
