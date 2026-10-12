import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const dimensionsSchema = mongoose.Schema(
  {
    length: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    sku: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    /**
     * Optional gallery images. Index 0 is the main hero image;
     * length 0/1 means "no gallery, use `image` only".
     */
    images: [
      { type: String },
    ],
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    /**
     * Optional list price shown as a strikethrough next to `price`
     * when on sale. 0 = no compare-at price.
     */
    compareAtPrice: {
      type: Number,
      default: 0,
    },
    tags: [
      { type: String },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    /**
     * Soft-delete / hide-from-storefront flag. Hidden products are
     * still queryable by admin but won't appear in public listings.
     */
    isActive: {
      type: Boolean,
      default: true,
    },
    weight: {
      type: Number, // grams
      default: 0,
    },
    dimensions: {
      type: dimensionsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// Auto-derive slug from name when missing
productSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80);
  }
  next();
});

// Text index for search (used by /api/products?keyword=)
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
