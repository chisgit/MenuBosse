import { render, screen } from '@testing-library/react';
import App from '../App';

import { waitFor } from '@testing-library/react';

describe('App', () => {
  it('renders the App component', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Menu Bosse')).toBeInTheDocument();
    });
  });
});
