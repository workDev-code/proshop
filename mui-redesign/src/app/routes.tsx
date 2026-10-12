import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { RequireAuth } from '../components/auth/RequireAuth';
import { AdminRoute } from '../features/admin/guards/AdminRoute';
import { DesignSystemPage } from '../features/design-system/pages/DesignSystemPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { HomePage } from '../features/products/pages/HomePage';
import { SearchPage } from '../features/products/pages/SearchPage';
import { ProductDetailPage } from '../features/products/pages/ProductDetailPage';
import { CartPage } from '../features/cart/pages/CartPage';
import { CheckoutPage } from '../features/checkout/pages/CheckoutPage';
import { OrdersListPage } from '../features/orders/pages/OrdersListPage';
import { OrderDetailPage } from '../features/orders/pages/OrderDetailPage';
import { WishlistPage } from '../features/wishlist/pages/WishlistPage';
import { ProfilePage } from '../features/profile/pages/ProfilePage';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { ProductListPage } from '../features/admin/pages/ProductListPage';
import { ProductEditPage } from '../features/admin/pages/ProductEditPage';
import { OrderListPage as AdminOrderListPage } from '../features/admin/pages/OrderListPage';
import { UserListPage } from '../features/admin/pages/UserListPage';
import { UserEditPage } from '../features/admin/pages/UserEditPage';
import { CouponListPage } from '../features/admin/pages/CouponListPage';
import { CouponEditPage } from '../features/admin/pages/CouponEditPage';

export const AppRouter = () => (
  <Routes>
    {/* ============== PUBLIC ROUTES (no shell) ============== */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<LoginPage mode="register" />} />
    <Route path="/design-system" element={<DesignSystemPage />} />

    {/* ============== PROTECTED ROUTES (with AppShell) ============== */}
    <Route
      element={
        <RequireAuth>
          <AppShell />
        </RequireAuth>
      }
    >
      <Route path="/" element={<HomePage />} />
      <Route path="/search/:keyword" element={<SearchPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrdersListPage />} />
      <Route path="/orders/:id" element={<OrderDetailPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* ============== ADMIN ROUTES (RequireAuth + AdminRoute) ============== */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AppShell />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/new" element={<ProductEditPage />} />
        <Route path="products/:id/edit" element={<ProductEditPage />} />
        <Route path="orders" element={<AdminOrderListPage />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="users/:id/edit" element={<UserEditPage />} />
        <Route path="coupons" element={<CouponListPage />} />
        <Route path="coupons/new" element={<CouponEditPage />} />
        <Route path="coupons/:id/edit" element={<CouponEditPage />} />
      </Route>
    </Route>

    {/* Catch-all → home */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
