import mongoose from 'mongoose';

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    // 'percentage' = % off (e.g., 10 means 10% off)
    // 'fixed'      = absolute amount off
    type: {
      type: String,
      required: true,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    // Minimum order subtotal required to apply
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    // Max discount cap (for percentage coupons)
    maxDiscount: {
      type: Number,
      default: null,
    },
    // Total usage across all users (null = unlimited)
    usageLimit: {
      type: Number,
      default: null,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    // Per-user usage limit (null = unlimited)
    perUserLimit: {
      type: Number,
      default: 1,
    },
    // Start date (inclusive); null = immediately
    startDate: {
      type: Date,
      default: null,
    },
    // Expiry date (inclusive); null = never
    expiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Optional scope restriction
    applicableCategories: [
      { type: String },
    ],
    applicableProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    ],
  },
  {
    timestamps: true,
  }
);

// Helper: check if coupon is currently usable (time + active + usage)
couponSchema.methods.isAvailable = function () {
  if (!this.isActive) return false;
  const now = new Date();
  if (this.startDate && now < this.startDate) return false;
  if (this.expiresAt && now > this.expiresAt) return false;
  if (this.usageLimit && this.usageCount >= this.usageLimit) return false;
  return true;
};

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
