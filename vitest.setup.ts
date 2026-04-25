import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

beforeAll(() => {
  const originalError = console.error;
  vi.spyOn(console, 'error').mockImplementation((message, ...args) => {
    if (typeof message === 'string' && message.includes('Received `true` for a non-boolean attribute `jsx`.')) {
      return;
    }
    originalError(message, ...args);
  });
});

afterEach(() => {
  cleanup();
});
