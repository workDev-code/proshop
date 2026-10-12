/**
 * Auth domain types
 * Keep in sync with backend response shapes (see backend/controllers/userController.js v3.0)
 */

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

/** Admin listing includes aggregate fields populated by getUsers */
export interface AdminUserRow extends User {
  wishlistCount?: number;
  ordersCount?: number;
  totalSpent?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ApiError {
  message: string;
  status: number;
}
