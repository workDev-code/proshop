import asyncHandler from '../middleware/asyncHandler.js';
import Coupon from '../models/couponModel.js';
import Order from '../models/orderModel.js';

// @desc    Validate a coupon code for the current user & subtotal
// @route   POST /api/coupons/validate
// @access  Private
// body: { code, subtotal }
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code || typeof subtotal !== 'number') {
    res.status(400);
    throw new Error('Coupon code and subtotal are required');
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase().trim(),
  });

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  if (!coupon.isAvailable()) {
    res.status(400);
    throw new Error('Coupon is expired or reached usage limit');
  }

  if (subtotal < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(
      `Order must be at least $${coupon.minOrderAmount} to use this coupon`
    );
  }

  // Per-user limit check
  if (coupon.perUserLimit) {
    const userUsage = await Order.countDocuments({
      user: req.user._id,
      'coupon.code': coupon.code,
    });
    if (userUsage >= coupon.perUserLimit) {
      res.status(400);
      throw new Error('You have already used this coupon');
    }
  }

  // Compute discount
  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.value;
  }
  // Never discount more than subtotal
  if (discount > subtotal) discount = subtotal;
  discount = Math.round(discount * 100) / 100;

  res.json({
    code: coupon.code,
    description: coupon.description,
    type: coupon.type,
    value: coupon.value,
    discount,
    finalSubtotal: Math.round((subtotal - discount) * 100) / 100,
  });
});

// ============ ADMIN ============

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

// @desc    Get single coupon by ID
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  res.json(coupon);
});

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    description,
    type,
    value,
    minOrderAmount,
    maxDiscount,
    usageLimit,
    perUserLimit,
    startDate,
    expiresAt,
    isActive,
    applicableCategories,
    applicableProducts,
  } = req.body;

  if (!code || !type || value === undefined) {
    res.status(400);
    throw new Error('code, type and value are required');
  }

  const exists = await Coupon.findOne({ code: code.toUpperCase().trim() });
  if (exists) {
    res.status(400);
    throw new Error('Coupon code already exists');
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase().trim(),
    description,
    type,
    value,
    minOrderAmount: minOrderAmount || 0,
    maxDiscount,
    usageLimit,
    perUserLimit,
    startDate,
    expiresAt,
    isActive: isActive !== undefined ? isActive : true,
    applicableCategories,
    applicableProducts,
  });

  res.status(201).json(coupon);
});

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  coupon.code = req.body.code
    ? req.body.code.toUpperCase().trim()
    : coupon.code;
  coupon.description =
    req.body.description !== undefined
      ? req.body.description
      : coupon.description;
  coupon.type = req.body.type || coupon.type;
  coupon.value =
    req.body.value !== undefined ? req.body.value : coupon.value;
  coupon.minOrderAmount =
    req.body.minOrderAmount !== undefined
      ? req.body.minOrderAmount
      : coupon.minOrderAmount;
  coupon.maxDiscount =
    req.body.maxDiscount !== undefined
      ? req.body.maxDiscount
      : coupon.maxDiscount;
  coupon.usageLimit =
    req.body.usageLimit !== undefined
      ? req.body.usageLimit
      : coupon.usageLimit;
  coupon.perUserLimit =
    req.body.perUserLimit !== undefined
      ? req.body.perUserLimit
      : coupon.perUserLimit;
  coupon.startDate =
    req.body.startDate !== undefined ? req.body.startDate : coupon.startDate;
  coupon.expiresAt =
    req.body.expiresAt !== undefined ? req.body.expiresAt : coupon.expiresAt;
  coupon.isActive =
    req.body.isActive !== undefined ? req.body.isActive : coupon.isActive;
  coupon.applicableCategories =
    req.body.applicableCategories !== undefined
      ? req.body.applicableCategories
      : coupon.applicableCategories;
  coupon.applicableProducts =
    req.body.applicableProducts !== undefined
      ? req.body.applicableProducts
      : coupon.applicableProducts;

  const updated = await coupon.save();
  res.json(updated);
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  await coupon.deleteOne();
  res.json({ message: 'Coupon removed' });
});

export {
  validateCoupon,
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
