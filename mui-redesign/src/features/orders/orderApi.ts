import { api } from '../../store/api';
import type {
  Order,
  CreateOrderPayload,
  ValidateCouponPayload,
  ValidatedCoupon,
  MarkShippedPayload,
  CancelOrderPayload,
} from './types';

/**
 * Order API endpoints (see backend/routes/orderRoutes.js + couponRoutes.js).
 *
 *   POST   /api/orders                create order (auth)
 *   GET    /api/orders                list all (admin)
 *   GET    /api/orders/mine           my orders (auth)
 *   GET    /api/orders/:id            single order
 *   PUT    /api/orders/:id/pay        mark paid (auth, demo)
 *   PUT    /api/orders/:id/ship       mark shipped (admin)
 *   PUT    /api/orders/:id/deliver    mark delivered (admin)
 *   PUT    /api/orders/:id/cancel     cancel (owner if pending, or admin)
 *   POST   /api/coupons/validate      validate coupon (auth)
 */
export const orderApi = api.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<Order, CreateOrderPayload>({
      query: (body) => ({ url: '/api/orders', method: 'POST', body }),
      invalidatesTags: (_r, _e, arg) =>
        arg.orderItems.map(({ _id }) => ({ type: 'Product' as const, id: _id })),
    }),

    getMyOrders: build.query<Order[], void>({
      query: () => '/api/orders/mine',
      providesTags: [{ type: 'Order', id: 'MINE' }],
    }),

    getOrderById: build.query<Order, string>({
      query: (id) => `/api/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),

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
        { type: 'Order', id: 'ALL' },
      ],
    }),

    markOrderShipped: build.mutation<
      Order,
      { orderId: string; payload: MarkShippedPayload }
    >({
      query: ({ orderId, payload }) => ({
        url: `/api/orders/${orderId}/ship`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_r, _e, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'MINE' },
        { type: 'Order', id: 'ALL' },
        'Analytics',
      ],
    }),

    markOrderDelivered: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/api/orders/${id}/deliver`, method: 'PUT' }),
      invalidatesTags: () => ['Analytics'],
    }),

    cancelOrder: build.mutation<
      Order,
      { orderId: string; payload: CancelOrderPayload }
    >({
      query: ({ orderId, payload }) => ({
        url: `/api/orders/${orderId}/cancel`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_r, _e, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'MINE' },
        { type: 'Order', id: 'ALL' },
      ],
    }),

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
  useMarkOrderShippedMutation,
  useMarkOrderDeliveredMutation,
  useCancelOrderMutation,
  useValidateCouponMutation,
} = orderApi;
