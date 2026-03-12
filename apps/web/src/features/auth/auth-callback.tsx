import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Container, Typography, Alert, Button } from '@mui/material';
import { useOAuthCallback } from './use-auth';
import { useAuthStore } from '../../stores/auth.store';
import {
  QUERY_PARAM_CODE,
  QUERY_PARAM_STATE,
  HTTP_STATUS_UNAUTHORIZED,
  RFC7807_FIELD_STATUS,
  I18N_KEY_AUTH_ERROR_MISSING_CALLBACK_PARAMS,
  I18N_KEY_AUTH_ERROR_CALLBACK_FAILED,
  I18N_KEY_AUTH_ERROR_CALLBACK_UNAUTHORIZED,
  I18N_KEY_AUTH_BACK_TO_LOGIN,
  I18N_KEY_AUTH_CALLBACK_PROCESSING,
} from '../../constants/auth.constants';
import { ROUTE_HOME, ROUTE_LOGIN } from '../../constants/app.constants';

type ErrorWithStatus = {
  [RFC7807_FIELD_STATUS]?: unknown;
};

function resolveCallbackErrorKey(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const candidate = error as ErrorWithStatus;
    if (candidate[RFC7807_FIELD_STATUS] === HTTP_STATUS_UNAUTHORIZED) {
      return I18N_KEY_AUTH_ERROR_CALLBACK_UNAUTHORIZED;
    }
  }

  return I18N_KEY_AUTH_ERROR_CALLBACK_FAILED;
}

export function AuthCallback() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback } = useOAuthCallback();
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const code = searchParams.get(QUERY_PARAM_CODE);
  const state = searchParams.get(QUERY_PARAM_STATE);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!code || !state) {
      setError(t(I18N_KEY_AUTH_ERROR_MISSING_CALLBACK_PARAMS));
      return;
    }

    handleCallback(code, state).catch((error: unknown) => {
      setError(t(resolveCallbackErrorKey(error)));
    });
  }, [code, state, handleCallback, t]);

  if (isAuthenticated) {
    return <Navigate to={ROUTE_HOME} replace />;
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => navigate(ROUTE_LOGIN)}>
            {t(I18N_KEY_AUTH_BACK_TO_LOGIN)}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 4 }}>
          {t(I18N_KEY_AUTH_CALLBACK_PROCESSING)}
        </Typography>
      </Box>
    </Container>
  );
}
