import mongoose from 'mongoose';

/**
 * Address — saved shipping addresses for a user. Power the
 * "My addresses" section of the storefront and let checkout
 * pre-fill the shipping form.
 */
const addressSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    label: {
      type: String,
      default: 'Home',
      trim: true,
      // e.g. 'Home', 'Office', 'Parents'
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: 'US',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure only ONE address per user has isDefault=true
addressSchema.pre('save', async function (next) {
  if (this.isDefault) {
    await mongoose.model('Address').updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

const Address = mongoose.model('Address', addressSchema);
export default Address;
