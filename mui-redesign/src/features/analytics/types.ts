/**
 * Analytics types — mirror backend/controllers/analyticsController.js
 *
 * NOTE: the storefront prototype's "conversion rate", "sessions",
 * "refund rate" are not tracked by the backend. Those fields are
 * returned as `null` inside `unavailable` so the UI can show
 * "Data not available" honestly.
 */

export interface OrdersByStatus {
  pending: number;
  paid: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface UnavailableMetrics {
  conversionRate: number | null;
  sessions: number | null;
  refundRate: number | null;
  salesByChannel: number | null;
}

export interface AnalyticsOverview {
  rangeDays: number;
  revenue: number;
  aov: number;
  ordersCount: number;
  paidOrdersCount: number;
  newCustomers: number;
  totalCustomers: number;
  repeatCustomers: number;
  paidCustomerRate: number;
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
  ordersByStatus: OrdersByStatus;
  unavailable: UnavailableMetrics;
}

export interface TopProduct {
  productId: string;
  name: string;
  image: string;
  category: string;
  unitsSold: number;
  revenue: number;
  ordersCount: number;
}

export interface RevenueByMonth {
  year: number;
  month: number;
  revenue: number;
  orders: number;
}
