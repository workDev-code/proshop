import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// Helper: convert wishlist ObjectIds to populated product docs
const populateWishlist = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'wishlist',
    select: 'name image price rating numReviews brand countInStock',
  });
  return user ? user.wishlist : [];
};

// @desc    Get logged in user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await populateWishlist(req.user._id);
  res.json(wishlist);
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // 1) Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // 2) Find user
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // 3) Add to wishlist if not exists (idempotent)
  const already = user.wishlist.some((id) => id.toString() === productId);
  if (already) {
    res.status(400);
    throw new Error('Product already in wishlist');
  }

  user.wishlist.push(productId);
  await user.save();

  // 4) Return populated wishlist
  const wishlist = await populateWishlist(req.user._id);
  res.status(201).json(wishlist);
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const idx = user.wishlist.findIndex((id) => id.toString() === productId);
  if (idx === -1) {
    res.status(404);
    throw new Error('Product not found in wishlist');
  }

  user.wishlist.splice(idx, 1);
  await user.save();

  const wishlist = await populateWishlist(req.user._id);
  res.json(wishlist);
});

// @desc    Clear entire wishlist
// @route   DELETE /api/users/wishlist
// @access  Private
const clearWishlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $set: { wishlist: [] } });
  res.json([]);
});

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
