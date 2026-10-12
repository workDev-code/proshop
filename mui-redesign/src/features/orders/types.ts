/**
 * Order domain types — mirror backend/models/orderModel.js v3.0
 */

export interface ShippingAddress {
  fullName?: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

export interface OrderCouponSnapshot {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount: number;
}

export interface OrderPaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export type PaymentMethod = 'PayPal' | 'Stripe' | 'CashOnDelivery';

/**
 * Single source of truth for the order lifecycle.
 * UI maps this to StatusPill tones via a small helper.
 */
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentResult?: OrderPaymentResult;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  discountPrice: number;
  totalPrice: number;
  coupon?: OrderCouponSnapshot;
  status: OrderStatus;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  trackingNumber?: string;
  carrier?: string;
  shippedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  orderItems: {
    _id: string;
    name: string;
    qty: number;
    image: string;
    price: number;
    countInStock: number;
    brand: string;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}

export interface MarkShippedPayload {
  trackingNumber?: string;
  carrier?: string;
}

export interface CancelOrderPayload {
  reason?: string;
}

export interface ValidateCouponPayload {
  code: string;
  subtotal: number;
}

export interface ValidatedCoupon {
  code: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount: number;
  finalSubtotal: number;
}
