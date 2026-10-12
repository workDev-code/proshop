import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  markOrderShipped,
  cancelOrder,
  getOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = express.Router();
router.use(protect);

router.route('/').post(addOrderItems).get(admin, getOrders);
router.route('/mine').get(getMyOrders);
router.route('/:id')
  .get(checkObjectId, getOrderById)
  .put(checkObjectId, updateOrderToPaid);
router.route('/:id/ship').put(admin, markOrderShipped);
router.route('/:id/deliver').put(admin, updateOrderToDelivered);
router.route('/:id/cancel').put(checkObjectId, cancelOrder);

export default router;
