import { BrowserRouter, Routes, Route } from 'react-router';
import { AppLayout } from './layouts/app-layout';
import { AuthGuard } from './features/auth/auth-guard';
import { LoginPage } from './features/auth/login-page';
import { AuthCallback } from './features/auth/auth-callback';
import { useAuthBootstrap } from './features/auth/use-auth';
import { ROUTE_HOME, ROUTE_LOGIN } from './constants/app.constants';
import { ROUTE_AUTH_CALLBACK } from './constants/auth.constants';

function PlaceholderDashboard() {
  return null; // Will be implemented in Epic 3
}

export function AppRoutes() {
  useAuthBootstrap();

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_LOGIN} element={<LoginPage />} />
        <Route path={ROUTE_AUTH_CALLBACK} element={<AuthCallback />} />
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTE_HOME} element={<PlaceholderDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
