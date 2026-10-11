export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Calculate the items price
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + (item.price * 100 * item.qty) / 100,
    0
  );
  state.itemsPrice = addDecimals(itemsPrice);

  // Shipping price
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  state.shippingPrice = addDecimals(shippingPrice);

  // ✅ Discount price (default 0)
  const discountPrice = state.discountPrice
    ? Number(state.discountPrice)
    : 0;
  state.discountPrice = addDecimals(discountPrice);

  // Tax on discounted subtotal
  const taxableAmount = Math.max(itemsPrice - discountPrice, 0);
  const taxPrice = 0.15 * taxableAmount;
  state.taxPrice = addDecimals(taxPrice);

  // Total price
  const totalPrice = taxableAmount + shippingPrice + taxPrice;
  state.totalPrice = addDecimals(totalPrice);

  localStorage.setItem('cart', JSON.stringify(state));
  return state;
};
