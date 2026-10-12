import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartCoupon, AddToCartPayload } from './types';

const STORAGE_KEY = 'proshop_cart_v1';

export interface CartState {
  items: CartItem[];
  /** Coupon currently applied (from /api/coupons/validate) */
  coupon: CartCoupon | null;
  /** User-supplied shipping address (saved across sessions for convenience) */
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  } | null;
  /** Saved payment method choice */
  paymentMethod: 'PayPal' | 'Stripe' | 'CashOnDelivery' | null;
}

const loadInitial = (): CartState => {
  if (typeof window === 'undefined') {
    return { items: [], coupon: null, shippingAddress: null, paymentMethod: null };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], coupon: null, shippingAddress: null, paymentMethod: null };
    const parsed = JSON.parse(raw) as Partial<CartState>;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      coupon: parsed.coupon ?? null,
      shippingAddress: parsed.shippingAddress ?? null,
      paymentMethod: parsed.paymentMethod ?? null,
    };
  } catch {
    return { items: [], coupon: null, shippingAddress: null, paymentMethod: null };
  }
};

const persist = (state: CartState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
};

const initialState: CartState = loadInitial();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { product, qty = 1 } = action.payload;
      const existing = state.items.find((i) => i.productId === product._id);
      if (existing) {
        existing.qty = Math.min(existing.qty + qty, product.countInStock);
      } else {
        state.items.push({
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: Math.max(1, Math.min(qty, product.countInStock || 999)),
          countInStock: product.countInStock,
          brand: product.brand,
        });
      }
      // Changing items invalidates any applied coupon
      state.coupon = null;
      persist(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      state.coupon = null;
      persist(state);
    },

    updateQty: (
      state,
      action: PayloadAction<{ productId: string; qty: number }>,
    ) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.qty = Math.max(1, Math.min(action.payload.qty, item.countInStock || 999));
        state.coupon = null;
      }
      persist(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      persist(state);
    },

    applyCoupon: (state, action: PayloadAction<CartCoupon>) => {
      state.coupon = action.payload;
      persist(state);
    },

    removeCoupon: (state) => {
      state.coupon = null;
      persist(state);
    },

    saveShippingAddress: (
      state,
      action: PayloadAction<NonNullable<CartState['shippingAddress']>>,
    ) => {
      state.shippingAddress = action.payload;
      persist(state);
    },

    savePaymentMethod: (state, action: PayloadAction<NonNullable<CartState['paymentMethod']>>) => {
      state.paymentMethod = action.payload;
      persist(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQty,
  clearCart,
  applyCoupon,
  removeCoupon,
  saveShippingAddress,
  savePaymentMethod,
} = cartSlice.actions;

export default cartSlice.reducer;
