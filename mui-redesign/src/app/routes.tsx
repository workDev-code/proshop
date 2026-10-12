import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { RequireAuth } from '../components/auth/RequireAuth';
import { DesignSystemPage } from '../features/design-system/pages/DesignSystemPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';

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
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      {/* Future routes will go here:
          /search/:keyword  (Phase 3)
          /product/:id      (Phase 3)
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
