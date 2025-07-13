import { render, screen, fireEvent } from '@testing-library/react';
import ItemDetailModal from './ItemDetailModal';

describe('ItemDetailModal', () => {
  it('should render the item name', () => {
    render(<ItemDetailModal itemId={1} onClose={() => {}} />);
    const itemName = screen.getByText(/Item Name/i);
    expect(itemName).toBeInTheDocument();
  });
});
