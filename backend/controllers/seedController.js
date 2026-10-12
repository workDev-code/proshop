import asyncHandler from '../middleware/asyncHandler.js';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Coupon from '../models/couponModel.js';
import Category from '../models/categoryModel.js';
import Brand from '../models/brandModel.js';
import Address from '../models/addressModel.js';

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const daysAhead = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

// =====================================================================
// POST /api/seed?fresh=true|false
// Headers: X-Seed-Key: <SEED_KEY env, default "proshop-seed-2026">
//
// Seeds the full demo dataset:
//   3 users (1 admin, 2 customers) with hashed passwords
//   4 categories, 4 brands
//   12 products spread across categories
//   6 orders in different statuses (pending/paid/shipped/delivered/cancelled)
//   6 saved addresses
//   4 coupons (1 expired for testing)
//
// Idempotent: pass ?fresh=false to skip if any collection has data.
// =====================================================================

const seedDatabase = asyncHandler(async (req, res) => {
  const expectedKey = process.env.SEED_KEY || 'proshop-seed-2026';
  const providedKey = req.get('X-Seed-Key');
  if (!providedKey || providedKey !== expectedKey) {
    res.status(401);
    throw new Error('Unauthorized: invalid or missing X-Seed-Key header');
  }

  const wipeFirst = req.query.fresh !== 'false';
  const summary = {
    users: 0, products: 0, categories: 0, brands: 0,
    coupons: 0, orders: 0, addresses: 0,
    wiped: false, skipped: false,
    timestamp: new Date().toISOString(),
  };

  if (wipeFirst) {
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Coupon.deleteMany({}),
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Address.deleteMany({}),
    ]);
    summary.wiped = true;
  } else {
    const counts = await Promise.all([
      User.countDocuments(), Product.countDocuments(),
      Order.countDocuments(), Coupon.countDocuments(),
      Category.countDocuments(), Brand.countDocuments(),
    ]);
    if (counts.some((c) => c > 0)) {
      summary.skipped = true;
      summary.existing = {
        users: counts[0], products: counts[1], orders: counts[2],
        coupons: counts[3], categories: counts[4], brands: counts[5],
      };
      return res.json({
        message: 'Database already has data — skipped (use ?fresh=true to wipe)',
        ...summary,
      });
    }
  }

  // ─── 1. Categories ───
  const categories = await Category.insertMany([
    {
      _id: '3000000000000000000000a1', name: 'Footwear',
      slug: 'footwear', displayOrder: 1, isActive: true,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      description: 'Sneakers, boots, and everyday shoes.',
    },
    {
      _id: '3000000000000000000000a2', name: 'Tech',
      slug: 'tech', displayOrder: 2, isActive: true,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      description: 'Audio, wearables, smart home.',
    },
    {
      _id: '3000000000000000000000a3', name: 'Accessories',
      slug: 'accessories', displayOrder: 3, isActive: true,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      description: 'Watches, bags, small carry.',
    },
    {
      _id: '3000000000000000000000a4', name: 'Lifestyle',
      slug: 'lifestyle', displayOrder: 4, isActive: true,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      description: 'Home, kitchen, and everyday carry.',
    },
  ]);
  summary.categories = categories.length;

  // ─── 2. Brands ───
  const brands = await Brand.insertMany([
    { _id: '4000000000000000000000a1', name: 'Common Ground', slug: 'common-ground', isActive: true,
      description: 'Honest basics for everyday wear.' },
    { _id: '4000000000000000000000a2', name: 'Aria',          slug: 'aria',          isActive: true,
      description: 'Sound, considered.' },
    { _id: '4000000000000000000000a3', name: 'North',         slug: 'north',         isActive: true,
      description: 'Watches and small leather goods.' },
    { _id: '4000000000000000000000a4', name: 'Field',         slug: 'field',         isActive: true,
      description: 'Home and carry essentials.' },
  ]);
  summary.brands = brands.length;

  // ─── 3. Users ───
  const hashed = bcrypt.hashSync('123456', 10);
  const users = await User.insertMany([
    {
      _id: '0000000000000000000000aa',
      name: 'Avery Stone', email: 'admin@email.com',
      password: hashed, isAdmin: true, phone: '+1 555 010 0001',
    },
    {
      _id: '0000000000000000000000bb',
      name: 'John Doe', email: 'john@email.com',
      password: hashed, isAdmin: false, phone: '+1 555 010 0002',
    },
    {
      _id: '0000000000000000000000cc',
      name: 'Jane Doe', email: 'jane@email.com',
      password: hashed, isAdmin: false, phone: '+1 555 010 0003',
    },
  ]);
  summary.users = users.length;

  const adminId = users[0]._id;
  const johnId = users[1]._id;
  const janeId = users[2]._id;

  // ─── 4. Products ───
  const u = (id, w = 600) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

  const productsRaw = [
    // Footwear
    { name: 'Everyday Runner Sneaker', category: 'Footwear', brand: 'Common Ground',
      price: 89, compareAtPrice: 119, countInStock: 42, rating: 4.6, numReviews: 18,
      description: 'A versatile sneaker designed for daily wear. Lightweight knit upper, responsive foam midsole.',
      image: u('photo-1542291026-7eec264c27ff'), tags: ['new', 'bestseller'] },
    { name: 'Trail Boot Tan', category: 'Footwear', brand: 'Field',
      price: 149, compareAtPrice: 0, countInStock: 8, rating: 4.2, numReviews: 7,
      description: 'Waterproof leather trail boot with grippy lugged outsole.',
      image: u('photo-1520219306100-ec4afeeefe53'), tags: ['new'] },
    { name: 'Canvas Slip-on Beige', category: 'Footwear', brand: 'Common Ground',
      price: 49, compareAtPrice: 0, countInStock: 25, rating: 4.0, numReviews: 22,
      description: 'Easy slip-on canvas shoe for warm weather and weekend errand runs.',
      image: u('photo-1525966222134-fcfa99b8ae77') },

    // Tech
    { name: 'Studio Wireless Headphones', category: 'Tech', brand: 'Aria',
      price: 129, compareAtPrice: 179, countInStock: 8, rating: 4.4, numReviews: 31,
      description: 'Over-ear wireless headphones with 40h battery, ANC, and USB-C fast charge.',
      image: u('photo-1505740420928-5e560c06d30e'), tags: ['bestseller'] },
    { name: 'Mini Bluetooth Speaker', category: 'Tech', brand: 'Aria',
      price: 39, compareAtPrice: 0, countInStock: 60, rating: 4.1, numReviews: 14,
      description: 'Pocket-size speaker with surprisingly full sound and 12h battery.',
      image: u('photo-1608043152269-423dbba4e7e1') },
    { name: 'Smart Plug 2-pack', category: 'Tech', brand: 'Field',
      price: 24, compareAtPrice: 0, countInStock: 0, rating: 4.3, numReviews: 9,
      description: 'WiFi smart plug with schedule and away mode. Works with major voice assistants.',
      image: u('photo-1558089680-f4c4b71b4d0e') },

    // Accessories
    { name: 'Minimal Everyday Watch', category: 'Accessories', brand: 'North',
      price: 74, compareAtPrice: 99, countInStock: 31, rating: 4.5, numReviews: 26,
      description: 'A clean, modern quartz watch with a sapphire-coated mineral crystal and 5 ATM water resistance.',
      image: u('photo-1523275335684-37898b6baf30'), tags: ['bestseller'] },
    { name: 'Leather Card Wallet', category: 'Accessories', brand: 'North',
      price: 42, compareAtPrice: 0, countInStock: 18, rating: 4.2, numReviews: 11,
      description: 'Slim vegetable-tanned leather wallet that ages beautifully.',
      image: u('photo-1627123424574-724758594e93') },
    { name: 'Polarized Sunglasses', category: 'Accessories', brand: 'Field',
      price: 89, compareAtPrice: 0, countInStock: 12, rating: 4.0, numReviews: 5,
      description: 'Polarized lenses, stainless frame, and a soft case.',
      image: u('photo-1572635196237-14b3f281503f') },

    // Lifestyle
    { name: 'Daily Carry Tote', category: 'Lifestyle', brand: 'Field',
      price: 42, compareAtPrice: 0, countInStock: 0, rating: 4.6, numReviews: 41,
      description: 'Roomy canvas tote with reinforced handles and an interior pocket.',
      image: u('photo-1544816155-12df9643f363'), tags: ['bestseller'] },
    { name: 'Ceramic Mug Set of 4', category: 'Lifestyle', brand: 'Field',
      price: 38, compareAtPrice: 0, countInStock: 22, rating: 4.4, numReviews: 16,
      description: 'Hand-glazed stoneware mugs in 4 muted colors. Dishwasher safe.',
      image: u('photo-1514228742587-6b1558fcca3d') },
    { name: 'Linen Throw Blanket', category: 'Lifestyle', brand: 'Field',
      price: 79, compareAtPrice: 0, countInStock: 6, rating: 4.7, numReviews: 12,
      description: 'Stonewashed linen throw that softens with every wash.',
      image: u('photo-1584100936595-c0654b55a2e2') },
  ];

  const productDocs = productsRaw.map((p, i) => ({
    _id: `1000000000000000000000${(i + 1).toString(16).padStart(2, '0')}`,
    user: adminId,
    sku: `SKU-${(i + 1).toString().padStart(3, '0')}`,
    ...p,
    isActive: true,
  }));
  const products = await Product.insertMany(productDocs);
  summary.products = products.length;

  // Seed wishlists: john + jane each wishlist 3 products
  await User.findByIdAndUpdate(johnId, { wishlist: [products[0]._id, products[3]._id, products[6]._id] });
  await User.findByIdAndUpdate(janeId, { wishlist: [products[1]._id, products[7]._id] });

  // ─── 5. Coupons ───
  const coupons = await Coupon.insertMany([
    { _id: '2000000000000000000000a1', code: 'WELCOME10', description: '10% off for first-time customers',
      type: 'percentage', value: 10, minOrderAmount: 50, maxDiscount: 50,
      usageLimit: 1000, usageCount: 0, perUserLimit: 1,
      expiresAt: daysAhead(30), isActive: true },
    { _id: '2000000000000000000000a2', code: 'SAVE20', description: '20% off when you spend $200+',
      type: 'percentage', value: 20, minOrderAmount: 200, maxDiscount: 100,
      usageLimit: 500, usageCount: 0, perUserLimit: 2,
      expiresAt: daysAhead(30), isActive: true },
    { _id: '2000000000000000000000a3', code: 'FLAT15', description: '$15 off any order',
      type: 'fixed', value: 15, minOrderAmount: 30,
      usageLimit: 200, usageCount: 0, perUserLimit: 1,
      expiresAt: daysAhead(30), isActive: true },
    { _id: '2000000000000000000000a4', code: 'EXPIRED50', description: 'Old expired coupon for testing',
      type: 'percentage', value: 50, usageLimit: 100, usageCount: 0, perUserLimit: 10,
      expiresAt: daysAgo(365), isActive: true },
  ]);
  summary.coupons = coupons.length;

  // ─── 6. Addresses ───
  const addresses = await Address.insertMany([
    { user: johnId, label: 'Home', fullName: 'John Doe', phone: '+1 555 010 0002',
      address: '123 Maple Street', city: 'Brooklyn', postalCode: '11201', country: 'US',
      isDefault: true },
    { user: johnId, label: 'Office', fullName: 'John Doe', phone: '+1 555 010 0002',
      address: '500 Park Avenue, Suite 1200', city: 'New York', postalCode: '10022', country: 'US' },
    { user: janeId, label: 'Home', fullName: 'Jane Doe', phone: '+1 555 010 0003',
      address: '88 Mission Street', city: 'San Francisco', postalCode: '94105', country: 'US',
      isDefault: true },
    { user: janeId, label: 'Parents', fullName: 'Jane Doe', phone: '+1 555 010 0003',
      address: '12 Lakeshore Drive', city: 'Chicago', postalCode: '60611', country: 'US' },
    { user: adminId, label: 'Office', fullName: 'Avery Stone', phone: '+1 555 010 0001',
      address: '1 Infinite Loop', city: 'Cupertino', postalCode: '95014', country: 'US',
      isDefault: true },
    { user: adminId, label: 'Home', fullName: 'Avery Stone', phone: '+1 555 010 0001',
      address: '742 Evergreen Terrace', city: 'Springfield', postalCode: '49007', country: 'US' },
  ]);
  summary.addresses = addresses.length;

  // ─── 7. Orders (one of each status) ───
  const makeOrderItem = (p, qty = 1) => ({
    name: p.name, qty, image: p.image, price: p.price, product: p._id,
  });

  const orders = await Order.insertMany([
    // pending — Jane, 2 items
    {
      user: janeId,
      orderItems: [makeOrderItem(products[0]), makeOrderItem(products[6])],
      shippingAddress: {
        fullName: 'Jane Doe', phone: '+1 555 010 0003',
        address: '88 Mission Street', city: 'San Francisco',
        postalCode: '94105', country: 'US',
      },
      paymentMethod: 'PayPal',
      itemsPrice: 163, taxPrice: 24.45, shippingPrice: 0,
      discountPrice: 0, totalPrice: 187.45,
      status: 'pending',
      isPaid: false, isDelivered: false,
      createdAt: daysAgo(1),
    },
    // paid — John, 1 item, used WELCOME10
    {
      user: johnId,
      orderItems: [makeOrderItem(products[3], 1)],
      shippingAddress: {
        fullName: 'John Doe', phone: '+1 555 010 0002',
        address: '123 Maple Street', city: 'Brooklyn',
        postalCode: '11201', country: 'US',
      },
      paymentMethod: 'PayPal',
      itemsPrice: 129, taxPrice: 19.35, shippingPrice: 0,
      discountPrice: 12.9, totalPrice: 135.45,
      coupon: { code: 'WELCOME10', type: 'percentage', value: 10, discount: 12.9 },
      status: 'paid',
      isPaid: true, paidAt: daysAgo(3),
      isDelivered: false,
      createdAt: daysAgo(3),
    },
    // shipped — Jane, 1 item with tracking
    {
      user: janeId,
      orderItems: [makeOrderItem(products[7], 1)],
      shippingAddress: {
        fullName: 'Jane Doe', phone: '+1 555 010 0003',
        address: '88 Mission Street', city: 'San Francisco',
        postalCode: '94105', country: 'US',
      },
      paymentMethod: 'PayPal',
      itemsPrice: 42, taxPrice: 6.3, shippingPrice: 0,
      discountPrice: 0, totalPrice: 48.3,
      status: 'shipped',
      isPaid: true, paidAt: daysAgo(5),
      trackingNumber: '1Z999AA10123456784', carrier: 'UPS',
      shippedAt: daysAgo(2),
      isDelivered: false,
      createdAt: daysAgo(5),
    },
    // delivered — John, 2 items
    {
      user: johnId,
      orderItems: [makeOrderItem(products[6]), makeOrderItem(products[10], 2)],
      shippingAddress: {
        fullName: 'John Doe', phone: '+1 555 010 0002',
        address: '123 Maple Street', city: 'Brooklyn',
        postalCode: '11201', country: 'US',
      },
      paymentMethod: 'PayPal',
      itemsPrice: 158, taxPrice: 23.7, shippingPrice: 0,
      discountPrice: 0, totalPrice: 181.7,
      status: 'delivered',
      isPaid: true, paidAt: daysAgo(10),
      isDelivered: true, deliveredAt: daysAgo(7),
      trackingNumber: '1Z999AA10123456789', carrier: 'UPS',
      shippedAt: daysAgo(9),
      createdAt: daysAgo(10),
    },
    // delivered (older) — Jane, 1 item
    {
      user: janeId,
      orderItems: [makeOrderItem(products[8])],
      shippingAddress: {
        fullName: 'Jane Doe', phone: '+1 555 010 0003',
        address: '88 Mission Street', city: 'San Francisco',
        postalCode: '94105', country: 'US',
      },
      paymentMethod: 'PayPal',
      itemsPrice: 89, taxPrice: 13.35, shippingPrice: 0,
      discountPrice: 0, totalPrice: 102.35,
      status: 'delivered',
      isPaid: true, paidAt: daysAgo(20),
      isDelivered: true, deliveredAt: daysAgo(16),
      createdAt: daysAgo(20),
    },
    // cancelled — John
    {
      user: johnId,
      orderItems: [makeOrderItem(products[11], 1)],
      shippingAddress: {
        fullName: 'John Doe', phone: '+1 555 010 0002',
        address: '123 Maple Street', city: 'Brooklyn',
        postalCode: '11201', country: 'US',
      },
      paymentMethod: 'PayPal',
      itemsPrice: 79, taxPrice: 11.85, shippingPrice: 0,
      discountPrice: 0, totalPrice: 90.85,
      status: 'cancelled',
      cancelledAt: daysAgo(2),
      cancelReason: 'Customer changed mind',
      isPaid: false, isDelivered: false,
      createdAt: daysAgo(4),
    },
  ]);
  summary.orders = orders.length;

  res.status(201).json({
    message: '✅ Database seeded successfully!',
    accounts: {
      admin: { email: 'admin@email.com', password: '123456' },
      john:  { email: 'john@email.com',  password: '123456' },
      jane:  { email: 'jane@email.com',  password: '123456' },
    },
    summary,
  });
});

export { seedDatabase };
