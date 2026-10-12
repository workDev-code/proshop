import mongoose from 'mongoose';

/**
 * Category — managed by admin, drives the storefront's CategoryGrid
 * section and is matched by `Product.category` (string) for filtering.
 *
 * Adding a new category is as simple as POST /api/categories; the
 * storefront CategoryGrid will pick it up immediately.
 */
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    /**
     * Optional order for the storefront grid (lower = earlier).
     * Categories without an order are sorted alphabetically.
     */
    displayOrder: {
      type: Number,
      default: 99,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-derive slug from name if not provided
categorySchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
