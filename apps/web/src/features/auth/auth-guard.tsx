import { Navigate, Outlet } from 'react-router';
import { Box, Skeleton } from '@mui/material';
import { useAuthStore } from '../../stores/auth.store';
import { ROUTE_LOGIN } from '../../constants/app.constants';

export function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);

  if (isBootstrapping) {
    return (
      <Box sx={{ p: 6 }}>
        <Skeleton variant="rectangular" height={64} />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 4 }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_LOGIN} replace />;
  }

  return <Outlet />;
}
