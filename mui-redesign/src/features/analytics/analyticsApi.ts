import { api } from '../../store/api';
import type {
  AnalyticsOverview,
  TopProduct,
  RevenueByMonth,
} from './types';

/**
 * Analytics API (admin only).
 *
 *   GET /api/analytics/overview           — KPIs + status breakdown
 *   GET /api/analytics/top-products       — aggregated units sold
 *   GET /api/analytics/revenue-by-month  — monthly time series
 *
 * The `overview` response also includes an `unavailable` block so
 * the UI can show "Data not available" honestly for fields the
 * backend can't derive (conversion rate, sessions, refund rate,
 * sales by channel).
 */
export const analyticsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOverview: build.query<AnalyticsOverview, number | void>({
      query: (days) => `/api/analytics/overview${days ? `?days=${days}` : ''}`,
      providesTags: ['Analytics'],
    }),
    getTopProducts: build.query<TopProduct[], number | void>({
      query: (limit) => `/api/analytics/top-products${limit ? `?limit=${limit}` : ''}`,
      providesTags: ['Analytics'],
    }),
    getRevenueByMonth: build.query<RevenueByMonth[], number | void>({
      query: (months) =>
        `/api/analytics/revenue-by-month${months ? `?months=${months}` : ''}`,
      providesTags: ['Analytics'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOverviewQuery,
  useGetTopProductsQuery,
  useGetRevenueByMonthQuery,
} = analyticsApi;
