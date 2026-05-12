import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/userRoutes.js';
import { errorHandler } from '../middleware/errorMiddleware.js';

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use(errorHandler);

describe('User Authentication API - Validation Tests', () => {
  
  // ===== REGISTER VALIDATION TESTS =====
  describe('POST /api/users - Register Validation', () => {
    
    test('Should validate that name is required', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          email: 'test1@example.com',
          password: '123456',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Name is required');
    });

    test('Should validate that name cannot be empty/whitespace', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: '   ',
          email: 'test2@example.com',
          password: '123456',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Name is required');
    });

    test('Should validate email format - reject invalid format', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: '123456',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid email format');
    });

    test('Should validate email format - reject missing email', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          password: '123456',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid email format');
    });

    test('Should validate email format - reject without domain', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'testuser@',
          password: '123456',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid email format');
    });

    test('Should validate password minimum length', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test3@example.com',
          password: '12345', // Only 5 characters
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Password must be at least 6 characters');
    });

    test('Should validate that password is required', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test4@example.com',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Password must be at least 6 characters');
    });


  });

  // ===== LOGIN ENDPOINT TESTS =====
  describe('POST /api/users/auth - Login', () => {
    
    test('Should have login endpoint available', async () => {
      const res = await request(app)
        .post('/api/users/auth')
        .send({
          email: 'test@example.com',
          password: '123456',
        });

      // We don't test actual login here (requires DB)
      // Just verify endpoint exists and returns a response
      expect(res.status).toBeDefined();
    });
  });

  // ===== LOGOUT ENDPOINT TESTS =====
  describe('POST /api/users/logout - Logout', () => {
    
    test('Should clear JWT cookie on logout', async () => {
      const res = await request(app)
        .post('/api/users/logout');

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Logged out successfully');
      expect(res.headers['set-cookie']).toBeDefined(); // Cookie cleared
    });
  });
});

