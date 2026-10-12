import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve();
const frontendBuildPath = path.join(__dirname, '/frontend/build');

import fs from 'fs';
const hasFrontendBuild = fs.existsSync(frontendBuildPath);

if (hasFrontendBuild && process.env.NODE_ENV === 'production') {
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(frontendBuildPath, 'index.html'))
  );
} else {
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.json({
      name: 'ProShop API',
      version: '3.0',
      status: 'running',
      env: process.env.NODE_ENV,
      endpoints: [
        'GET    /api/products',
        'GET    /api/products/top',
        'GET    /api/products/:id',
        'GET    /api/categories',
        'GET    /api/brands',
        'GET    /api/addresses (auth)',
        'GET    /api/analytics/overview (admin)',
        'GET    /api/analytics/top-products (admin)',
        'GET    /api/analytics/revenue-by-month (admin)',
        'POST   /api/users',
        'POST   /api/users/auth',
        'GET    /api/orders/mine',
        'POST   /api/orders',
        'PUT    /api/orders/:id/ship (admin)',
        'PUT    /api/orders/:id/deliver (admin)',
        'PUT    /api/orders/:id/cancel (owner or admin)',
        'GET    /api/coupons (admin)',
        'POST   /api/coupons/validate',
        'GET    /api/users/wishlist (auth)',
        'POST   /api/upload (admin)',
        'GET    /api/config/paypal',
      ],
    });
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}\n` +
      `Mode: ${hasFrontendBuild ? 'MONOLITHIC (serving SPA)' : 'API-ONLY'}\n` +
      `URL: http://localhost:${port}/`
  )
);
