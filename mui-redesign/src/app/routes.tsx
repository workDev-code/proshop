import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AppShell } from '../components/layout/AppShell';
import { DesignSystemPage } from '../features/design-system/pages/DesignSystemPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';

export const AppRouter = () => (
  <Routes>
    {/* Public design system showcase */}
    <Route path="/design-system" element={<DesignSystemPage />} />

    {/* Auth pages (no shell) */}
    <Route path="/login"    element={<LoginPage />} />
    <Route path="/register" element={<LoginPage mode="register" />} />

    {/* App shell (TopBar + SideNav) */}
    <Route element={<AppShell />}>
      <Route path="/"          element={<DashboardPage />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      {/* More routes will be added in Phase 2–6 */}
    </Route>

    {/* Catch-all → home */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

/** Tiny shared style (placeholder) */
export const _unused = () => <Box />;
