import asyncHandler from '../middleware/asyncHandler.js';
import Address from '../models/addressModel.js';

// @desc    Get current user's addresses
// @route   GET /api/addresses
// @access  Private
const getMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({
    isDefault: -1,
    createdAt: -1,
  });
  res.json(addresses);
});

// @desc    Create address
// @route   POST /api/addresses
// @access  Private
const createAddress = asyncHandler(async (req, res) => {
  const { label, fullName, phone, address, city, postalCode, country, isDefault } = req.body;
  const created = await Address.create({
    user: req.user._id,
    label: label || 'Home',
    fullName,
    phone: phone || '',
    address,
    city,
    postalCode,
    country: country || 'US',
    isDefault: !!isDefault,
  });
  res.status(201).json(created);
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const fields = ['label', 'fullName', 'phone', 'address', 'city', 'postalCode', 'country', 'isDefault'];
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  fields.forEach((f) => {
    if (req.body[f] !== undefined) address[f] = req.body[f];
  });
  const updated = await address.save();
  res.json(updated);
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  await address.deleteOne();
  res.json({ message: 'Address removed' });
});

export { getMyAddresses, createAddress, updateAddress, deleteAddress };
