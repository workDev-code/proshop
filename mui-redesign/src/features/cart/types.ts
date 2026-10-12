/**
 * Cart domain types
 * Cart is client-only (no backend persistence).
 * Cart items are restored from localStorage on page load.
 */

import type { Product } from '../products/types';

export interface CartItem {
  /** Product _id from the backend */
  productId: string;
  name: string;
  image: string;
  price: number;
  /** Quantity in cart (always >= 1) */
  qty: number;
  /** Max available for clamping qty selector */
  countInStock: number;
  brand: string;
}

/**
 * Applied coupon snapshot (validated by server via /api/coupons/validate).
 */
export interface CartCoupon {
  code: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount: number;
  finalSubtotal: number;
}

/** Result of cart price calculation. */
export interface CartTotals {
  itemsPrice: number;
  /** itemsPrice - coupon discount (>= 0) */
  discountedItemsPrice: number;
  /** 15% tax on discounted items */
  taxPrice: number;
  /** Free over $100, else $10 */
  shippingPrice: number;
  /** Final total */
  totalPrice: number;
  itemsCount: number;
}

export type AddToCartPayload = {
  product: Pick<Product, '_id' | 'name' | 'image' | 'price' | 'countInStock' | 'brand'>;
  qty?: number;
};
