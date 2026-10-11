// @ts-check
import { isValidObjectId } from 'mongoose';

/**
 * Checks if req.params has a valid Mongoose ObjectId.
 * Accepts either `id` or `productId` parameter names.
 */
function checkObjectId(req, res, next) {
  const paramId = req.params.id || req.params.productId;
  if (!isValidObjectId(paramId)) {
    res.status(404);
    throw new Error(`Invalid ObjectId of:  ${paramId}`);
  }
  next();
}

export default checkObjectId;
