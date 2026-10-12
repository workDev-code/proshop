import { api } from '../../store/api';
import type {
  Product,
  ProductListResponse,
  ProductQueryParams,
  CreateReviewPayload,
} from './types';

/**
 * Build the query string from params, stripping undefined values.
 */
const buildQueryString = (params?: ProductQueryParams): string => {
  if (!params) return '';
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    search.append(k, String(v));
  });
  const s = search.toString();
  return s ? `?${s}` : '';
};

/**
 * Product API endpoints
 * Injected into the root RTK Query api.
 *
 * Backend routes (see backend/routes/productRoutes.js):
 *   GET    /api/products              list (filters, sort, pagination)
 *   GET    /api/products/top          top 3 rated
 *   GET    /api/products/:id          detail
 *   POST   /api/products/:id/reviews  add review (auth required)
 */
export const productApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get products with full filter / sort / pagination support.
     * Returns facets (categories + brands) for building the filter UI.
     */
    getProducts: build.query<ProductListResponse, ProductQueryParams | undefined>({
      query: (params?: ProductQueryParams) => `/api/products${buildQueryString(params)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Product' as const, id: _id })),
              { type: 'Product' as const, id: 'LIST' },
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),

    /**
     * Top 3 rated products (used for hero carousel & "Top Rated" section).
     */
    getTopProducts: build.query<Product[], void>({
      query: () => '/api/products/top',
      providesTags: [{ type: 'Product', id: 'TOP' }],
    }),

    /**
     * Single product detail.
     */
    getProductById: build.query<Product, string>({
      query: (id) => `/api/products/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Product', id }],
    }),

    /**
     * Submit a product review (auth required).
     * Invalidates the product so refetch shows the new review.
     */
    createReview: build.mutation<
      { message: string },
      { productId: string; payload: CreateReviewPayload }
    >({
      query: ({ productId, payload }) => ({
        url: `/api/products/${productId}/reviews`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_r, _e, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'TOP' },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetTopProductsQuery,
  useGetProductByIdQuery,
  useCreateReviewMutation,
} = productApi;
