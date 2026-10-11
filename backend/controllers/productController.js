import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// Helper: build sort object from query param `sort`
// Supported: newest (default) | price_asc | price_desc | rating | top_sellers | name
function buildSort(sortBy) {
  switch (sortBy) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'rating':
      return { rating: -1 };
    case 'top_sellers':
      // Heuristic: products with rating + high priceDesc-ish; here use rating then numReviews
      return { rating: -1, numReviews: -1 };
    case 'name':
      return { name: 1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
}

// Helper: build price filter
// Supports price range and individual milestones
function buildPriceFilter(query) {
  const min = parseFloat(query.priceMin);
  const max = parseFloat(query.priceMax);
  const filter = {};
  if (!Number.isNaN(min)) filter.$gte = min;
  if (!Number.isNaN(max)) filter.$lte = max;
  return Object.keys(filter).length ? { price: filter } : {};
}

// Helper: build rating filter (min rating)
function buildRatingFilter(query) {
  const minRating = parseFloat(query.minRating);
  if (!Number.isNaN(minRating)) {
    return { rating: { $gte: minRating } };
  }
  return {};
}

// Helper: build in-stock filter
function buildStockFilter(query) {
  if (query.inStock === 'true') {
    return { countInStock: { $gt: 0 } };
  }
  return {};
}

// @desc    Fetch all products with advanced filtering + sorting + pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  // ---- Build the combined filter ----
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  // category filter
  const category = req.query.category
    ? { category: req.query.category }
    : {};

  // brand filter (multi-select)
  const brand = req.query.brand
    ? { brand: { $in: req.query.brand.split(',').map((b) => b.trim()) } }
    : {};

  const filter = {
    ...keyword,
    ...category,
    ...brand,
    ...buildPriceFilter(req.query),
    ...buildRatingFilter(req.query),
    ...buildStockFilter(req.query),
  };

  // ---- Sorting ----
  const sort = buildSort(req.query.sort);

  // ---- Count + query ----
  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // ---- Return filter context for client (active facets) ----
  const allProductsForFacets = await Product.find(
    {},
    { category: 1, brand: 1, _id: 0 }
  );
  const categories = [
    ...new Set(allProductsForFacets.map((p) => p.category)),
  ].sort();
  const brands = [
    ...new Set(allProductsForFacets.map((p) => p.brand)),
  ].sort();

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
    facets: { categories, brands },
    appliedFilters: {
      keyword: req.query.keyword || '',
      category: req.query.category || '',
      brand: req.query.brand || '',
      priceMin: req.query.priceMin || '',
      priceMax: req.query.priceMax || '',
      minRating: req.query.minRating || '',
      inStock: req.query.inStock || '',
      sort: req.query.sort || 'newest',
    },
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
