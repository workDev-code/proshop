/**
 * Admin domain types
 */

import type { Product } from '../products/types';
import type { Order } from '../orders/types';
import type { User } from '../auth/types';

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  perUserLimit?: number | null;
  startDate?: string;
  expiresAt?: string;
  isActive: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponPayload {
  code: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  startDate?: string;
  expiresAt?: string;
  isActive?: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  isAdmin?: boolean;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  description: string;
  image: string;
  brand: string;
  category: string;
  countInStock: number;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface UploadImageResponse {
  message: string;
  image: string;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  paidOrders: number;
  pendingOrders: number;
  outOfStockProducts: number;
  lowStockProducts: number;
}

export { type Product, type Order, type User };
export type { AdminUserRow } from '../auth/types';
