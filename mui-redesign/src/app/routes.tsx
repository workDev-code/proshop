import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { RequireAuth } from '../components/auth/RequireAuth';
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
      {/* Phase 5: admin routes */}
    </Route>

    {/* Catch-all → home */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
