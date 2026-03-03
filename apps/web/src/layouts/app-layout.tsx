import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { AppBar, Box, Toolbar, Typography, IconButton, Button } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useUiStore } from '../stores/ui.store';
import { useLanguageStore } from '../stores/language.store';
import { LANGUAGE_EN, LANGUAGE_FR, THEME_MODE_DARK } from '../constants/app.constants';

/**
 * Main application layout with header
 * [Source: architecture.md#Structure Patterns — Frontend structure]
 * All text uses i18n — no hard-coded strings
 */
export function AppLayout() {
  const { t, i18n } = useTranslation();
  const { themeMode, toggleTheme } = useUiStore();
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageToggle = () => {
    const newLang = language === LANGUAGE_EN ? LANGUAGE_FR : LANGUAGE_EN;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            {t('app.title')}
          </Typography>

          <Button color="inherit" onClick={handleLanguageToggle} sx={{ textTransform: 'uppercase' }}>
            {language === LANGUAGE_EN ? t('common.switchToFrench') : t('common.switchToEnglish')}
          </Button>

          <IconButton color="inherit" onClick={toggleTheme} aria-label={t('common.toggleTheme')}>
            {themeMode === THEME_MODE_DARK ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 6 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
