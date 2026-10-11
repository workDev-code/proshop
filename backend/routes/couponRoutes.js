import express from 'express';
import {
  validateCoupon,
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = express.Router();

// User route - validate coupon before checkout
router.post('/validate', protect, validateCoupon);

// Admin routes
router
  .route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);
router
  .route('/:id')
  .get(protect, admin, checkObjectId, getCouponById)
  .put(protect, admin, checkObjectId, updateCoupon)
  .delete(protect, admin, checkObjectId, deleteCoupon);

export default router;
