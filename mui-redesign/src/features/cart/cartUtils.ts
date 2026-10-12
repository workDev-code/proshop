import type { CartItem, CartCoupon, CartTotals } from './types';

export const TAX_RATE = 0.15;
export const FREE_SHIPPING_THRESHOLD = 100;
export const FLAT_SHIPPING = 10;

/**
 * Calculate cart totals. Tax is applied AFTER coupon discount (matches backend).
 * Shipping is free if discounted items price exceeds threshold, else flat rate.
 */
export const calcCartTotals = (
  items: CartItem[],
  coupon?: CartCoupon | null,
): CartTotals => {
  const itemsPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemsPriceRounded = Math.round(itemsPrice * 100) / 100;
  const discount = coupon?.discount ?? 0;
  const discountedItemsPrice = Math.max(
    0,
    Math.round((itemsPriceRounded - discount) * 100) / 100,
  );
  const taxPrice = Math.round(discountedItemsPrice * TAX_RATE * 100) / 100;
  const shippingPrice = discountedItemsPrice > FREE_SHIPPING_THRESHOLD || discountedItemsPrice === 0 ? 0 : FLAT_SHIPPING;
  const totalPrice =
    Math.round((discountedItemsPrice + taxPrice + shippingPrice) * 100) / 100;
  const itemsCount = items.reduce((sum, i) => sum + i.qty, 0);

  return {
    itemsPrice: itemsPriceRounded,
    discountedItemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    itemsCount,
  };
};

export const formatCurrency = (v: number) =>
  `$${v.toFixed(2)}`;
