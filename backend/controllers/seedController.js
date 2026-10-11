import asyncHandler from '../middleware/asyncHandler.js';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Coupon from '../models/couponModel.js';

// ============================================================
// POST /api/seed
// Headers:  X-Seed-Key: <value of SEED_KEY env, default "proshop-seed-2026">
// Query:    ?fresh=true   → wipe existing data first (default)
//           ?fresh=false  → only seed if collection is empty
//
// Returns JSON summary of what was created.
// ============================================================

const generateNow = () => new Date();
const generateOneMonthLater = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d;
};
const generateOneYearAgo = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d;
};

const seedDatabase = asyncHandler(async (req, res) => {
  // 1. Validate seed key (env-driven for production safety)
  const expectedKey = process.env.SEED_KEY || 'proshop-seed-2026';
  const providedKey = req.get('X-Seed-Key');
  if (!providedKey || providedKey !== expectedKey) {
    res.status(401);
    throw new Error('Unauthorized: invalid or missing X-Seed-Key header');
  }

  const wipeFirst = req.query.fresh !== 'false'; // default: true

  const summary = {
    users: 0,
    products: 0,
    coupons: 0,
    wiped: false,
    skipped: false,
    timestamp: new Date().toISOString(),
  };

  // ─── 2. Wipe (optional) ───
  if (wipeFirst) {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    summary.wiped = true;
  } else {
    // Skip if any collection has data
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const couponCount = await Coupon.countDocuments();
    if (userCount || productCount || couponCount) {
      summary.skipped = true;
      summary.existing = { users: userCount, products: productCount, coupons: couponCount };
      return res.json({
        message: 'Database already has data — skipped (use ?fresh=true to wipe)',
        ...summary,
      });
    }
  }

  // ─── 3. Seed users ───
  const hashedPassword = bcrypt.hashSync('123456', 10);
  const users = await User.insertMany([
    {
      _id: '0000000000000000000000aa',
      name: 'Admin User',
      email: 'admin@email.com',
      password: hashedPassword,
      isAdmin: true,
    },
    {
      _id: '0000000000000000000000bb',
      name: 'John Doe',
      email: 'john@email.com',
      password: hashedPassword,
      isAdmin: false,
    },
    {
      _id: '0000000000000000000000cc',
      name: 'Jane Doe',
      email: 'jane@email.com',
      password: hashedPassword,
      isAdmin: false,
    },
  ]);
  summary.users = users.length;

  // ─── 4. Seed products ───
  const adminId = users[0]._id;
  const products = await Product.insertMany([
    {
      _id: '1000000000000000000000a1',
      user: adminId,
      name: 'Airpods Wireless Bluetooth Headphones',
      image: '/images/airpods.jpg',
      description:
        'Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working',
      brand: 'Apple',
      category: 'Electronics',
      price: 89.99,
      countInStock: 10,
      rating: 4.5,
      numReviews: 12,
    },
    {
      _id: '1000000000000000000000a2',
      user: adminId,
      name: 'iPhone 13 Pro 256GB Memory',
      image: '/images/phone.jpg',
      description:
        'Introducing the iPhone 13 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life',
      brand: 'Apple',
      category: 'Electronics',
      price: 599.99,
      countInStock: 7,
      rating: 4.0,
      numReviews: 8,
    },
    {
      _id: '1000000000000000000000a3',
      user: adminId,
      name: 'Cannon EOS 80D DSLR Camera',
      image: '/images/camera.jpg',
      description:
        'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design',
      brand: 'Cannon',
      category: 'Electronics',
      price: 929.99,
      countInStock: 5,
      rating: 3,
      numReviews: 12,
    },
    {
      _id: '1000000000000000000000a4',
      user: adminId,
      name: 'Sony Playstation 5',
      image: '/images/playstation.jpg',
      description:
        'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music',
      brand: 'Sony',
      category: 'Electronics',
      price: 399.99,
      countInStock: 11,
      rating: 5,
      numReviews: 12,
    },
    {
      _id: '1000000000000000000000a5',
      user: adminId,
      name: 'Logitech G-Series Gaming Mouse',
      image: '/images/mouse.jpg',
      description:
        'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience',
      brand: 'Logitech',
      category: 'Electronics',
      price: 49.99,
      countInStock: 7,
      rating: 3.5,
      numReviews: 10,
    },
    {
      _id: '1000000000000000000000a6',
      user: adminId,
      name: 'Amazon Echo Dot 3rd Generation',
      image: '/images/alexa.jpg',
      description:
        'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space',
      brand: 'Amazon',
      category: 'Electronics',
      price: 29.99,
      countInStock: 0,
      rating: 4,
      numReviews: 12,
    },
  ]);
  summary.products = products.length;

  // ─── 5. Seed coupons ───
  const oneMonthLater = generateOneMonthLater();
  const oneYearAgo = generateOneYearAgo();
  const coupons = await Coupon.insertMany([
    {
      _id: '2000000000000000000000a1',
      code: 'WELCOME10',
      description: '10% off for first-time customers',
      type: 'percentage',
      value: 10,
      minOrderAmount: 50,
      maxDiscount: 50,
      usageLimit: 1000,
      usageCount: 0,
      perUserLimit: 1,
      startDate: null,
      expiresAt: oneMonthLater,
      isActive: true,
    },
    {
      _id: '2000000000000000000000a2',
      code: 'SAVE20',
      description: '20% off when you spend $200 or more',
      type: 'percentage',
      value: 20,
      minOrderAmount: 200,
      maxDiscount: 100,
      usageLimit: 500,
      usageCount: 0,
      perUserLimit: 2,
      startDate: null,
      expiresAt: oneMonthLater,
      isActive: true,
    },
    {
      _id: '2000000000000000000000a3',
      code: 'FLAT15',
      description: '$15 off any order',
      type: 'fixed',
      value: 15,
      minOrderAmount: 30,
      usageLimit: 200,
      usageCount: 0,
      perUserLimit: 1,
      startDate: null,
      expiresAt: oneMonthLater,
      isActive: true,
    },
    {
      _id: '2000000000000000000000a4',
      code: 'EXPIRED50',
      description: 'Old expired coupon for testing',
      type: 'percentage',
      value: 50,
      minOrderAmount: 0,
      usageLimit: 100,
      usageCount: 0,
      perUserLimit: 10,
      startDate: null,
      expiresAt: oneYearAgo,
      isActive: true,
    },
  ]);
  summary.coupons = coupons.length;

  // ─── 6. Return summary ───
  res.status(201).json({
    message: '✅ Database seeded successfully!',
    accounts: {
      admin:  { email: 'admin@email.com', password: '123456' },
      john:   { email: 'john@email.com',  password: '123456' },
      jane:   { email: 'jane@email.com',  password: '123456' },
    },
    ...summary,
  });
});

export { seedDatabase };
