import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';
import { Box, Button, Container, Paper, Typography, Skeleton, Alert } from '@mui/material';
import { Google, GitHub } from '@mui/icons-material';
import { useAuthStore } from '../../stores/auth.store';
import { useLogin } from './use-auth';
import {
  OAUTH_PROVIDER_GOOGLE,
  OAUTH_PROVIDER_GITHUB,
  I18N_KEY_AUTH_ERROR_LOGIN_FAILED,
  type OAuthProvider,
} from '../../constants/auth.constants';
import { ROUTE_HOME } from '../../constants/app.constants';

export function LoginPage() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
  const { startLogin } = useLogin();
  const [error, setError] = useState<string | null>(null);

  if (isBootstrapping) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Skeleton variant="rectangular" width={400} height={300} />
        </Box>
      </Container>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTE_HOME} replace />;
  }

  const handleLogin = async (provider: OAuthProvider) => {
    try {
      setError(null);
      await startLogin(provider);
    } catch {
      setError(t(I18N_KEY_AUTH_ERROR_LOGIN_FAILED));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper sx={{ p: 8, width: '100%', maxWidth: 400 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
            {t('auth.loginTitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Google />}
              onClick={() => handleLogin(OAUTH_PROVIDER_GOOGLE)}
              size="large"
            >
              {t('auth.loginWithGoogle')}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<GitHub />}
              onClick={() => handleLogin(OAUTH_PROVIDER_GITHUB)}
              size="large"
            >
              {t('auth.loginWithGithub')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
