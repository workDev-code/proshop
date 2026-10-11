import { COUPONS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const couponsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: `${COUPONS_URL}/validate`,
        method: 'POST',
        body: data,
      }),
    }),
    getCoupons: builder.query({
      query: () => ({ url: COUPONS_URL }),
      providesTags: ['Coupon'],
      keepUnusedDataFor: 5,
    }),
    getCouponDetails: builder.query({
      query: (id) => ({ url: `${COUPONS_URL}/${id}` }),
      keepUnusedDataFor: 5,
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: COUPONS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation({
      query: (data) => ({
        url: `${COUPONS_URL}/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `${COUPONS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useGetCouponsQuery,
  useGetCouponDetailsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponsApiSlice;
