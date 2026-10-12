import asyncHandler from '../middleware/asyncHandler.js';
import Brand from '../models/brandModel.js';

const getBrands = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.includeInactive === 'true') filter.isActive = undefined;
  const brands = await Brand.find(filter).sort({ name: 1 });
  res.json(brands);
});

const getBrandById = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (brand) res.json(brand);
  else {
    res.status(404);
    throw new Error('Brand not found');
  }
});

const createBrand = asyncHandler(async (req, res) => {
  const { name, logo, description, isActive } = req.body;
  const brand = await Brand.create({
    name,
    logo: logo || '',
    description: description || '',
    isActive: isActive ?? true,
  });
  res.status(201).json(brand);
});

const updateBrand = asyncHandler(async (req, res) => {
  const fields = ['name', 'logo', 'description', 'isActive'];
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  fields.forEach((f) => {
    if (req.body[f] !== undefined) brand[f] = req.body[f];
  });
  const updated = await brand.save();
  res.json(updated);
});

const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  await brand.deleteOne();
  res.json({ message: 'Brand removed' });
});

export { getBrands, getBrandById, createBrand, updateBrand, deleteBrand };
