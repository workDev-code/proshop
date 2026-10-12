/**
 * Auth domain types
 * Keep in sync with backend response shapes (see backend/controllers/userController.js)
 */

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  status: number;
}
