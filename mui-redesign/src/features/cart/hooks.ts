import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { calcCartTotals } from './cartUtils';
import {
  addToCart,
  removeFromCart,
  updateQty,
  clearCart,
  applyCoupon,
  removeCoupon,
  saveShippingAddress,
  savePaymentMethod,
} from './cartSlice';
import type { AddToCartPayload, CartCoupon } from './types';

/**
 * Cart hook — all cart state + actions in one place.
 *
 * Usage:
 *   const { items, totals, addItem, removeItem, updateItemQty, ... } = useCart();
 */
export const useCart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const coupon = useAppSelector((s) => s.cart.coupon);
  const shippingAddress = useAppSelector((s) => s.cart.shippingAddress);
  const paymentMethod = useAppSelector((s) => s.cart.paymentMethod);

  const totals = useMemo(() => calcCartTotals(items, coupon), [items, coupon]);

  return {
    items,
    coupon,
    shippingAddress,
    paymentMethod,
    totals,
    isEmpty: items.length === 0,
    addItem: (payload: AddToCartPayload) => dispatch(addToCart(payload)),
    removeItem: (productId: string) => dispatch(removeFromCart(productId)),
    updateItemQty: (productId: string, qty: number) =>
      dispatch(updateQty({ productId, qty })),
    clear: () => dispatch(clearCart()),
    setCoupon: (c: CartCoupon) => dispatch(applyCoupon(c)),
    unsetCoupon: () => dispatch(removeCoupon()),
    saveShipping: (a: NonNullable<typeof shippingAddress>) =>
      dispatch(saveShippingAddress(a)),
    savePayment: (p: NonNullable<typeof paymentMethod>) =>
      dispatch(savePaymentMethod(p)),
  };
};
