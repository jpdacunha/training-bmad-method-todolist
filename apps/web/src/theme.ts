import { createTheme, type Theme } from '@mui/material/styles';

/**
 * DSFR-inspired palette for light and dark themes
 * [Source: architecture.md#Styling Patterns + UX Design Spec]
 *
 * Typography:
 * - Headings: Spectral (Extra-Bold)
 * - Body/UI: system font stack (Marianne is not freely available)
 *
 * Spacing: 4px grid system
 */

const systemFontStack = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',');

const headingFontStack = ['"Spectral"', 'Georgia', 'serif'].join(',');

const baseThemeOptions = {
  spacing: 4,
  typography: {
    fontFamily: systemFontStack,
    h1: { fontFamily: headingFontStack, fontWeight: 800 },
    h2: { fontFamily: headingFontStack, fontWeight: 800 },
    h3: { fontFamily: headingFontStack, fontWeight: 800 },
    h4: { fontFamily: headingFontStack, fontWeight: 700 },
    h5: { fontFamily: headingFontStack, fontWeight: 700 },
    h6: { fontFamily: headingFontStack, fontWeight: 700 },
  },
  shape: {
    borderRadius: 4,
  },
};

export const lightTheme: Theme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#000091', // France Blue (DSFR)
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E1000F', // France Red (accent only)
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F6F6F6',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#161616',
      secondary: '#3A3A3A',
    },
  },
});

export const darkTheme: Theme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#8585F6', // Lighter France Blue for dark mode
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E1000F',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#1E1E1E',
      paper: '#2D2D2D',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
    },
  },
});
