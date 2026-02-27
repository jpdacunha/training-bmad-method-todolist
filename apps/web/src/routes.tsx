import { BrowserRouter, Routes, Route } from 'react-router';
import { AppLayout } from './layouts/app-layout';

/**
 * Application routes
 * [Source: architecture.md#Frontend Architecture — Routing: React Router v7]
 */

function PlaceholderDashboard() {
  return null; // Will be implemented in Epic 3
}

function PlaceholderLogin() {
  return null; // Will be implemented in Story 1.4
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<PlaceholderDashboard />} />
        </Route>
        <Route path="/login" element={<PlaceholderLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
