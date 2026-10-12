import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
  },
  { _id: false }
);

const shippingAddressSchema = mongoose.Schema(
  {
    fullName: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    discountPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    coupon: {
      code: { type: String },
      type: { type: String, enum: ['percentage', 'fixed'] },
      value: { type: Number },
      discount: { type: Number },
    },
    /**
     * Single source of truth for the order lifecycle.
     * UI maps this directly to the StatusPill tones.
     *
     *   pending   → created, not paid, not shipped
     *   paid      → payment captured, awaiting fulfillment
     *   shipped   → in transit
     *   delivered → completed
     *   cancelled → voided (refunded out-of-band)
     */
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    /**
     * Shipping tracking info (optional).
     * Populated by admin when an order is marked shipped.
     */
    trackingNumber: { type: String, default: '' },
    carrier: { type: String, default: '' },
    shippedAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String, default: '' },
    /**
     * Free-form note from customer at checkout or admin.
     */
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * Keep `isPaid` / `isDelivered` in sync with `status` so legacy
 * code paths and reports that still read those booleans keep working.
 */
orderSchema.pre('save', function (next) {
  if (this.status === 'paid' || this.status === 'shipped' || this.status === 'delivered') {
    this.isPaid = true;
    if (!this.paidAt) this.paidAt = new Date();
  }
  if (this.status === 'delivered') {
    this.isDelivered = true;
    if (!this.deliveredAt) this.deliveredAt = new Date();
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
