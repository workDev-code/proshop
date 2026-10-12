import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import coupons from './data/coupons.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import Coupon from './models/couponModel.js';
import Category from './models/categoryModel.js';
import Brand from './models/brandModel.js';
import Address from './models/addressModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Wipe in dependency order
    await Order.deleteMany();
    await Address.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Build a small set of categories + brands so the storefront grid
    // has something to render even when running `npm run data:import`.
    await Category.insertMany([
      { name: 'Footwear',    slug: 'footwear',    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', displayOrder: 1 },
      { name: 'Tech',        slug: 'tech',        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', displayOrder: 2 },
      { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', displayOrder: 3 },
      { name: 'Lifestyle',   slug: 'lifestyle',   image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', displayOrder: 4 },
    ]);
    await Brand.insertMany([
      { name: 'Common Ground', slug: 'common-ground' },
      { name: 'Aria',          slug: 'aria' },
      { name: 'North',         slug: 'north' },
      { name: 'Field',         slug: 'field' },
    ]);

    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
      sku: `SKU-${product.name.slice(0, 3).toUpperCase()}`,
      isActive: true,
    }));
    await Product.insertMany(sampleProducts);
    await Coupon.insertMany(coupons);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Address.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
