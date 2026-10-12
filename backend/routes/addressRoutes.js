import express from 'express';
import {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/addressController.js';
import { protect } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getMyAddresses)
  .post(createAddress);
router.route('/:id')
  .put(checkObjectId, updateAddress)
  .delete(checkObjectId, deleteAddress);

export default router;
