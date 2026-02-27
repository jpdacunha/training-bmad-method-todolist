import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './app';

describe('App', () => {
  it('renders without crashing and shows app title', () => {
    render(<App />);

    // App title should be rendered via i18n t('app.title')
    expect(screen.getByText(/TodoList/i)).toBeDefined();
  });
});
