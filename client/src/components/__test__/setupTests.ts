import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

const mockRestaurant = {
  id: 1,
  name: 'Menu Bosse',
  logoUrl: 'https://example.com/logo.png',
  primaryColor: '#ff0000',
  menu: {
    categories: [],
  },
};

vi.spyOn(global, 'fetch').mockImplementation((url) => {
  const urlString = url.toString();
  if (urlString.endsWith('/api/restaurants/1.json')) {
    return Promise.resolve(
      new Response(JSON.stringify(mockRestaurant), {
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  }
  return Promise.resolve(new Response('Not Found', { status: 404 }));
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
