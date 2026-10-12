import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from '../../demo/mockBaseQuery';

const BASE_URL = (import.meta.env.VITE_API_URL as string) || '';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: DEMO_MODE
    ? mockBaseQuery
    : fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include',
      }),
  tagTypes: ['Product', 'Order', 'User', 'Coupon', 'Wishlist'],
  endpoints: () => ({}),
});

// Log a single console message when demo mode is on, so the user knows
if (DEMO_MODE) {
  // eslint-disable-next-line no-console
  console.info(
    '%c[ProShop] Demo mode active',
    'color:#4F46E5;font-weight:bold',
    '— all data is in-memory mock, no server needed.',
  );
}
