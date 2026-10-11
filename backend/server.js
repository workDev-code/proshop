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

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Detect if we're running a monolithic deploy (frontend + backend same repo)
// vs. an API-only deploy (backend on Render, frontend on Vercel).
// Monolithic: when frontend/build folder exists.
// API-only: when it doesn't (Render case).
const __dirname = path.resolve();
const frontendBuildPath = path.join(__dirname, '/frontend/build');

import fs from 'fs';
const hasFrontendBuild = fs.existsSync(frontendBuildPath);

if (hasFrontendBuild && process.env.NODE_ENV === 'production') {
  // ===== Monolithic mode (single deploy) =====
  // For self-hosted / VPS where backend serves SPA
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(frontendBuildPath, 'index.html'))
  );
} else {
  // ===== API-only mode (separate deploys: Render + Vercel) =====
  // Backend serves only API endpoints. Anything else returns friendly text.
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.json({
      name: 'ProShop API',
      version: '2.0',
      status: 'running',
      env: process.env.NODE_ENV,
      endpoints: [
        'GET    /api/products',
        'POST   /api/users',
        'POST   /api/users/auth',
        'GET    /api/orders/mine',
        'POST   /api/orders',
        'GET    /api/coupons (admin)',
        'POST   /api/coupons/validate',
        'GET    /api/users/wishlist (auth)',
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
