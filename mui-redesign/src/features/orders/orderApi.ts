import { api } from '../../store/api';
import type {
  Order,
  CreateOrderPayload,
  ValidateCouponPayload,
  ValidatedCoupon,
} from './types';

/**
 * Order API endpoints (see backend/routes/orderRoutes.js + couponRoutes.js).
 *
 * Backend routes:
 *   POST   /api/orders            create order (auth)
 *   GET    /api/orders/mine       my orders (auth)
 *   GET    /api/orders/:id        single order (auth)
 *   PUT    /api/orders/:id/pay    mark paid (auth)
 *   POST   /api/coupons/validate  validate coupon code (auth)
 */
export const orderApi = api.injectEndpoints({
  endpoints: (build) => ({
    /** Create order. Returns the new Order with _id. */
    createOrder: build.mutation<Order, CreateOrderPayload>({
      query: (body) => ({ url: '/api/orders', method: 'POST', body }),
      invalidatesTags: (_r, _e, arg) =>
        arg.orderItems.map(({ _id }) => ({ type: 'Product' as const, id: _id })),
    }),

    /** My orders. */
    getMyOrders: build.query<Order[], void>({
      query: () => '/api/orders/mine',
      providesTags: [{ type: 'Order', id: 'MINE' }],
    }),

    /** Single order detail. */
    getOrderById: build.query<Order, string>({
      query: (id) => `/api/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),

    /**
     * Mark an order as paid.
     * For demo: pass { id: 'demo-payment', status: 'COMPLETED' } — server will
     * attempt PayPal verification and fail unless it's a real PayPal capture id.
     * In demo mode we catch the throw and proceed.
     */
    payOrder: build.mutation<
      { message: string },
      { orderId: string; paymentResult: Record<string, unknown> }
    >({
      query: ({ orderId, paymentResult }) => ({
        url: `/api/orders/${orderId}/pay`,
        method: 'PUT',
        body: paymentResult,
      }),
      invalidatesTags: (_r, _e, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'MINE' },
      ],
    }),

    /** Validate a coupon code against the current subtotal. */
    validateCoupon: build.mutation<ValidatedCoupon, ValidateCouponPayload>({
      query: (body) => ({ url: '/api/coupons/validate', method: 'POST', body }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  usePayOrderMutation,
  useValidateCouponMutation,
} = orderApi;
