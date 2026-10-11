/**
 * Unit tests for Wishlist + Coupon routes.
 * These tests verify the routes are wired correctly and basic
 * validation/error handling works, using the express test app.
 *
 * NOTE: The DB-touching tests (real create/lookup) are deliberately
 * skipped here because they require a running MongoDB instance.
 * They serve as a starter suite - extend with .env MONGO_URI mongodb-memory-server.
 */
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/userRoutes.js';
import couponRoutes from '../routes/couponRoutes.js';
import { errorHandler } from '../middleware/errorMiddleware.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/coupons', couponRoutes);
app.use(errorHandler);

describe('Wishlist API', () => {
  // Each test will fail auth (401) since no token - this proves
  // the protect middleware is correctly applied.
  test('GET /api/users/wishlist requires auth', async () => {
    const res = await request(app).get('/api/users/wishlist');
    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Not authorized');
  });

  test('POST /api/users/wishlist/:productId requires auth', async () => {
    const res = await request(app).post(
      '/api/users/wishlist/507f1f77bcf86cd799439011'
    );
    expect(res.status).toBe(401);
  });

  test('DELETE /api/users/wishlist/:productId requires auth', async () => {
    const res = await request(app).delete(
      '/api/users/wishlist/507f1f77bcf86cd799439011'
    );
    expect(res.status).toBe(401);
  });

  test('DELETE /api/users/wishlist requires auth', async () => {
    const res = await request(app).delete('/api/users/wishlist');
    expect(res.status).toBe(401);
  });
});

describe('Wishlist ObjectId validation', () => {
  // Note: with no auth, protect middleware runs first and returns 401
  // before reaching checkObjectId. This test simply asserts the route
  // pattern is mounted - real validation tests need a logged-in user.
  test('Route is mounted', async () => {
    const res = await request(app).post('/api/users/wishlist/not-an-id');
    expect([400, 401]).toContain(res.status);
  });
});

describe('Coupon API', () => {
  test('GET /api/coupons requires auth', async () => {
    const res = await request(app).get('/api/coupons');
    expect(res.status).toBe(401);
  });

  test('POST /api/coupons requires auth + admin', async () => {
    const res = await request(app)
      .post('/api/coupons')
      .send({ code: 'X', type: 'percentage', value: 10 });
    expect(res.status).toBe(401);
  });

  test('POST /api/coupons/validate requires auth', async () => {
    const res = await request(app)
      .post('/api/coupons/validate')
      .send({ code: 'X', subtotal: 100 });
    expect(res.status).toBe(401);
  });

  test('PUT /api/coupons/:id requires auth', async () => {
    const res = await request(app)
      .put('/api/coupons/507f1f77bcf86cd799439011')
      .send({ value: 5 });
    expect(res.status).toBe(401);
  });

  test('DELETE /api/coupons/:id requires auth', async () => {
    const res = await request(app).delete(
      '/api/coupons/507f1f77bcf86cd799439011'
    );
    expect(res.status).toBe(401);
  });
});
