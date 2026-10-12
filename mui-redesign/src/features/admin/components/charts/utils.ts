/**
 * Chart helpers — pure functions, no React/DOM dependencies.
 * Used by admin analytics charts.
 */

import type { Order } from '../../../orders/types';
import type { Product } from '../../../products/types';

/** YYYY-MM-DD key for a date. */
export const dayKey = (d: Date) => d.toISOString().slice(0, 10);

/** Returns the last N days as an array of YYYY-MM-DD strings, oldest → newest. */
export const lastNDays = (n: number): string[] => {
  const out: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push(dayKey(d));
  }
  return out;
};

/**
 * Group paid orders by day for the last N days.
 * Returns array of { date, revenue, orderCount, label } in chronological order.
 */
export const revenueByDay = (
  orders: Order[],
  days: number = 30,
): { date: string; revenue: number; orderCount: number; label: string }[] => {
  const keys = lastNDays(days);
  const map = new Map<string, { revenue: number; orderCount: number }>();
  keys.forEach((k) => map.set(k, { revenue: 0, orderCount: 0 }));

  for (const o of orders) {
    if (!o.isPaid) continue;
    const k = dayKey(new Date(o.createdAt));
    const bucket = map.get(k);
    if (bucket) {
      bucket.revenue += o.totalPrice;
      bucket.orderCount += 1;
    }
  }

  return keys.map((k) => {
    const d = new Date(k);
    return {
      date: k,
      revenue: Math.round((map.get(k)?.revenue ?? 0) * 100) / 100,
      orderCount: map.get(k)?.orderCount ?? 0,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });
};

/** Group products by category and count. */
export const productsByCategory = (
  products: Product[],
): { id: string; value: number; label: string }[] => {
  const map = new Map<string, number>();
  for (const p of products) {
    map.set(p.category, (map.get(p.category) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([id, value]) => ({ id, value, label: id }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Top N products by chosen metric.
 *   metric = 'rating'    → sort by rating desc
 *   metric = 'numReviews'→ sort by numReviews desc
 *   metric = 'price'     → sort by price desc
 */
export const topProductsBy = (
  products: Product[],
  metric: 'rating' | 'numReviews' | 'price',
  n: number = 8,
): { name: string; value: number; brand: string }[] => {
  return [...products]
    .sort((a, b) => (b[metric] as number) - (a[metric] as number))
    .slice(0, n)
    .map((p) => ({
      name: p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name,
      value: p[metric] as number,
      brand: p.brand,
    }));
};
