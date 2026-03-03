import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/spectral/800.css';
import { App } from './app';
import { ROOT_ELEMENT_ID, ROOT_ELEMENT_NOT_FOUND_ERROR } from './constants/app.constants';

const rootElement = document.getElementById(ROOT_ELEMENT_ID);
if (!rootElement) {
  throw new Error(ROOT_ELEMENT_NOT_FOUND_ERROR);
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
