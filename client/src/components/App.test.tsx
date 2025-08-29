import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

import { waitFor } from '@testing-library/react';

describe('App', () => {
  beforeEach(() => {
    const mockRestaurant = {
      id: 1,
      name: 'The Golden Spoon',
      cuisine: 'Italian',
      description: 'A cozy Italian restaurant with a modern twist.',
      imageUrl: '/assets/images/restaurants/golden-spoon.png',
      rating: 4.5,
      votePercentage: 90,
      priceRange: '$$',
      distance: 5.2,
      isHiddenGem: false,
      isTrending: true,
      isLocalFavorite: true,
    };

    const mockMenuItems = [
      { id: 1, restaurantId: 1, categoryId: 1, name: 'Spaghetti Carbonara', price: 15.99 },
      { id: 2, restaurantId: 1, categoryId: 1, name: 'Margherita Pizza', price: 12.99 },
    ];

    const mockMenuCategories = [
      { id: 1, restaurantId: 1, name: 'Main Dishes' },
    ];

    jest.spyOn(window, 'fetch').mockImplementation((url) => {
      if (url.toString().includes('/api/restaurants/1/menu')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMenuItems),
        } as Response);
      }
      if (url.toString().includes('/api/restaurants/1/categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMenuCategories),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRestaurant),
      } as Response);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the App component', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('MenuBosse')).toBeInTheDocument();
    });
  });
});
