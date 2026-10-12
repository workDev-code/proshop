/**
 * Order domain types — mirror backend/models/orderModel.js
 */

export interface ShippingAddress {
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

export interface Order {
  _id: string;
  user: string | { name: string; email: string };
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
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
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
