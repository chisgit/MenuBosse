import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import ItemDetailModal from './ItemDetailModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

jest.mock('@/hooks/use-menu', () => ({
  useMenuItem: () => ({
    data: { id: 1, name: 'Burger', price: 5, description: 'Tasty burger', fullDescription: 'Tasty burger', imageUrl: '', rating: 4.5, votes: 10 },
    isLoading: false
  })
}));
jest.mock('@/hooks/use-addons', () => ({
  useMenuItemAddons: () => ({
    data: [],
    isLoading: false
  })
}));

describe('ItemDetailModal', () => {
  it('should render the item name', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ItemDetailModal itemId={1} onClose={() => {}} />
      </QueryClientProvider>
    );
    const itemNames = screen.getAllByText(/Burger/i);
    expect(itemNames.length).toBeGreaterThan(0);
  });
});
