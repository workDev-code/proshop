import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/categoryModel.js';

// @desc    Fetch all categories (public storefront grid)
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.includeInactive === 'true') filter.isActive = undefined;
  const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 });
  res.json(categories);
});

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) res.json(category);
  else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Create category (admin)
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, image, description, displayOrder, isActive } = req.body;
  const category = await Category.create({
    name,
    image,
    description: description || '',
    displayOrder: displayOrder ?? 99,
    isActive: isActive ?? true,
  });
  res.status(201).json(category);
});

// @desc    Update category (admin)
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const fields = ['name', 'image', 'description', 'displayOrder', 'isActive'];
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  fields.forEach((f) => {
    if (req.body[f] !== undefined) category[f] = req.body[f];
  });
  const updated = await category.save();
  res.json(updated);
});

// @desc    Delete category (admin)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  await category.deleteOne();
  res.json({ message: 'Category removed' });
});

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
