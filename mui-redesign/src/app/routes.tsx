import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { RequireAuth } from '../components/auth/RequireAuth';
import { DesignSystemPage } from '../features/design-system/pages/DesignSystemPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { HomePage } from '../features/products/pages/HomePage';
import { SearchPage } from '../features/products/pages/SearchPage';
import { ProductDetailPage } from '../features/products/pages/ProductDetailPage';

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
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      {/* Future routes will go here:
          /cart             (Phase 4)
          /checkout         (Phase 4)
          /orders, /orders/:id
          /wishlist
          /profile
          /admin/*          (Phase 5) */}
    </Route>

    {/* Catch-all → home */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
