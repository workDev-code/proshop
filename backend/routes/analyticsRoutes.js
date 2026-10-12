import express from 'express';
import {
  getOverview,
  getTopProducts,
  getRevenueByMonth,
} from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect, admin);

router.get('/overview', getOverview);
router.get('/top-products', getTopProducts);
router.get('/revenue-by-month', getRevenueByMonth);

export default router;
