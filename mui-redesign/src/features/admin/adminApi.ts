import { api } from '../../store/api';
import type {
  Coupon,
  CreateCouponPayload,
  UpdateUserPayload,
  CreateProductPayload,
  UpdateProductPayload,
  UploadImageResponse,
} from './types';
import type { Product } from '../products/types';
import type { Order } from '../orders/types';
import type { User } from '../auth/types';

/**
 * Admin API endpoints. All require admin privileges on the backend.
 *
 *   Products:
 *     POST   /api/products          create
 *     PUT    /api/products/:id      update
 *     DELETE /api/products/:id      delete
 *   Orders:
 *     GET    /api/orders            all (admin)
 *     PUT    /api/orders/:id/deliver  mark delivered
 *   Users:
 *     GET    /api/users             all
 *     GET    /api/users/:id         one
 *     PUT    /api/users/:id         update
 *     DELETE /api/users/:id         delete
 *   Coupons:
 *     GET    /api/coupons           all
 *     POST   /api/coupons           create
 *     GET    /api/coupons/:id       one
 *     PUT    /api/coupons/:id       update
 *     DELETE /api/coupons/:id       delete
 *   Upload:
 *     POST   /api/upload            multipart (admin)
 */
export const adminApi = api.injectEndpoints({
  endpoints: (build) => ({
    // ===== Products =====
    createProduct: build.mutation<Product, CreateProductPayload>({
      query: (body) => ({ url: '/api/products', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'TOP' },
      ],
    }),
    updateProduct: build.mutation<
      Product,
      { id: string; payload: UpdateProductPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/api/products/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'TOP' },
      ],
    }),
    deleteProduct: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/api/products/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'TOP' },
      ],
    }),

    // ===== Orders =====
    getAllOrders: build.query<Order[], void>({
      query: () => '/api/orders',
      providesTags: (result) =>
        result
          ? [
              ...result.map((o) => ({ type: 'Order' as const, id: o._id })),
              { type: 'Order' as const, id: 'ALL' },
            ]
          : [{ type: 'Order' as const, id: 'ALL' }],
    }),
    markOrderDelivered: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/api/orders/${id}/deliver`, method: 'PUT' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'ALL' },
        { type: 'Order', id: 'MINE' },
      ],
    }),

    // ===== Users =====
    getAllUsers: build.query<User[], void>({
      query: () => '/api/users',
      providesTags: ['User'],
    }),
    getUserById: build.query<User, string>({
      query: (id) => `/api/users/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'User', id }],
    }),
    updateUser: build.mutation<User, { id: string; payload: UpdateUserPayload }>({
      query: ({ id, payload }) => ({
        url: `/api/users/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'User', id },
        'User',
      ],
    }),
    deleteUser: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/api/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),

    // ===== Coupons =====
    getAllCoupons: build.query<Coupon[], void>({
      query: () => '/api/coupons',
      providesTags: ['Coupon'],
    }),
    getCouponById: build.query<Coupon, string>({
      query: (id) => `/api/coupons/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Coupon', id }],
    }),
    createCoupon: build.mutation<Coupon, CreateCouponPayload>({
      query: (body) => ({ url: '/api/coupons', method: 'POST', body }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: build.mutation<
      Coupon,
      { id: string; payload: Partial<CreateCouponPayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/api/coupons/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Coupon', id },
        'Coupon',
      ],
    }),
    deleteCoupon: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/api/coupons/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Coupon'],
    }),

    // ===== Upload =====
    uploadImage: build.mutation<UploadImageResponse, FormData>({
      // Don't set Content-Type — the browser will set it with boundary
      query: (formData) => ({
        url: '/api/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllOrdersQuery,
  useMarkOrderDeliveredMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAllCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useUploadImageMutation,
} = adminApi;
