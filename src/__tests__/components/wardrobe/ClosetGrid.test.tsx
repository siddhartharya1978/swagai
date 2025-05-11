import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClosetGrid } from '@/components/wardrobe/ClosetGrid';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { getWardrobeItems, deleteWardrobeItem } from '@/lib/api/wardrobe';
import { AuthProvider } from '@/components/auth/AuthProvider';
import type { Database } from '@/types/supabase';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock auth context
jest.mock('@/components/auth/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

// Mock the toast hook
let toastMock = jest.fn();
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));

// Mock the API functions
jest.mock('@/lib/api/wardrobe', () => ({
  getWardrobeItems: jest.fn(),
  deleteWardrobeItem: jest.fn(),
}));

type WardrobeItem = Database['public']['Tables']['wardrobe_items']['Row'];

const mockItems: WardrobeItem[] = [
  {
    id: '1',
    user_id: 'user1',
    image_url: '/images/t-shirt.jpg',
    cleaned_image_url: '/images/t-shirt-cleaned.jpg',
    main_type: 'top',
    sub_type: 't-shirt',
    color: 'blue',
    pattern: 'solid',
    occasion: 'casual',
    auto_tags: ['t-shirt', 'blue', 'casual'],
    image_hash: 'abc123',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'user1',
    image_url: '/images/jeans.jpg',
    cleaned_image_url: '/images/jeans-cleaned.jpg',
    main_type: 'bottom',
    sub_type: 'jeans',
    color: 'black',
    pattern: 'solid',
    occasion: 'casual',
    auto_tags: ['jeans', 'black', 'casual'],
    image_hash: 'def456',
    created_at: '2024-01-01T00:00:00Z'
  }
];

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <TooltipProvider>
        {ui}
      </TooltipProvider>
    </AuthProvider>
  );
};

describe('ClosetGrid', () => {
  beforeEach(() => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user1' },
    });

    // Mock successful API responses
    (getWardrobeItems as jest.Mock).mockResolvedValue(mockItems);
    (deleteWardrobeItem as jest.Mock).mockResolvedValue({ error: null });

    toastMock = jest.fn();
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (getWardrobeItems as jest.Mock).mockImplementation(() => new Promise(() => {}));
    renderWithProvider(<ClosetGrid />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders wardrobe items', async () => {
    renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      expect(screen.getByText('t-shirt')).toBeInTheDocument();
      expect(screen.getByText('jeans')).toBeInTheDocument();
    });
  });

  it('filters items by main type', async () => {
    renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      expect(screen.getByText('top')).toBeInTheDocument();
    });

    // The first combobox is likely the type filter
    const comboboxes = screen.getAllByRole('combobox');
    const typeFilter = comboboxes[0];
    fireEvent.click(typeFilter);
    const topOption = screen.getByText('top');
    fireEvent.click(topOption);

    expect(screen.getByText('top')).toBeInTheDocument();
    expect(screen.queryByText('bottom')).not.toBeInTheDocument();
  });

  it('filters items by color', async () => {
    renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      // At least one 'blue' should be present
      expect(screen.getAllByText('blue').length).toBeGreaterThan(0);
    });

    // The second combobox is likely the color filter
    const comboboxes = screen.getAllByRole('combobox');
    const colorFilter = comboboxes[1];
    fireEvent.click(colorFilter);
    const blueOption = screen.getByText('blue');
    fireEvent.click(blueOption);

    // There should still be at least one 'blue' present, and 'black' should not
    expect(screen.getAllByText('blue').length).toBeGreaterThan(0);
    expect(screen.queryByText('black')).not.toBeInTheDocument();
  });

  it('filters items by search term', async () => {
    renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      expect(screen.getByText('t-shirt')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by tag/i);
    fireEvent.change(searchInput, { target: { value: 't-shirt' } });

    expect(screen.getByText('t-shirt')).toBeInTheDocument();
    expect(screen.queryByText('jeans')).not.toBeInTheDocument();
  });

  it('sorts items by date', async () => {
    renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      expect(screen.getByText('top')).toBeInTheDocument();
    });

    // The fifth combobox is likely the sort filter (index may need adjustment)
    const comboboxes = screen.getAllByRole('combobox');
    const sortSelect = comboboxes[4] || comboboxes[comboboxes.length - 1];
    fireEvent.click(sortSelect);
    const oldestOption = screen.getByText('Oldest First');
    fireEvent.click(oldestOption);

    const items = screen.getAllByRole('img');
    expect(items[0]).toHaveAttribute('alt', expect.stringContaining('t-shirt'));
    expect(items[1]).toHaveAttribute('alt', expect.stringContaining('jeans'));
  });

  it('displays empty state when no items', async () => {
    (getWardrobeItems as jest.Mock).mockResolvedValue([]);
    renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      expect(screen.getByText(/no items found/i)).toBeInTheDocument();
    });
  });

  it('handles error when loading items', async () => {
    (getWardrobeItems as jest.Mock).mockRejectedValue(new Error('Failed to load'));
    renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalled();
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: expect.stringContaining('Error'),
          variant: 'destructive',
        })
      );
    });
  });

  it('handles error when deleting item', async () => {
    (deleteWardrobeItem as jest.Mock).mockRejectedValue(new Error('Failed to delete'));
    renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      expect(screen.getByText('t-shirt')).toBeInTheDocument();
    });

    // Find the delete button by class or order (assuming it's the destructive button)
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(
      (btn) => btn.className.includes('bg-destructive') || btn.textContent?.toLowerCase().includes('delete')
    );
    expect(deleteButton).toBeDefined();
    fireEvent.click(deleteButton!);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalled();
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: expect.stringContaining('Error'),
          variant: 'destructive',
        })
      );
    });
  });

  it('handles empty wardrobe state', async () => {
    renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      expect(screen.getByText(/your wardrobe is empty/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /upload items/i })).toBeInTheDocument();
    });
  });

  it('handles loading state', async () => {
    renderWithProvider(<ClosetGrid />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    renderWithProvider(<ClosetGrid />);

    expect(screen.getByText(/failed to load wardrobe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('handles item deletion with confirmation', async () => {
    const mockOnDelete = jest.fn();
    renderWithProvider(<ClosetGrid />);

    const deleteButton = screen.getByRole('button', { name: /delete t-shirt/i });
    fireEvent.click(deleteButton);

    // Verify confirmation dialog
    expect(screen.getByText(/delete item/i)).toBeInTheDocument();
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    expect(deleteWardrobeItem).toHaveBeenCalledWith('1', 'user1');
  });

  it('handles item deletion cancellation', async () => {
    renderWithProvider(<ClosetGrid />);

    const deleteButton = screen.getByRole('button', { name: /delete t-shirt/i });
    fireEvent.click(deleteButton);

    // Cancel deletion
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(deleteWardrobeItem).not.toHaveBeenCalled();
  });

  it('handles item image loading errors', async () => {
    renderWithProvider(<ClosetGrid />);

    const images = screen.getAllByRole('img');
    fireEvent.error(images[0]);

    await waitFor(() => {
      expect(screen.getByText(/failed to load image/i)).toBeInTheDocument();
    });
  });

  it('handles item image lazy loading', async () => {
    const mockIntersectionObserver = jest.fn();
    const mockDisconnect = jest.fn();

    window.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
      observe: () => mockIntersectionObserver(callback),
      disconnect: mockDisconnect,
    }));

    renderWithProvider(<ClosetGrid />);

    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('loading', 'lazy');
  });

  it('handles accessibility features', async () => {
    renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      // Verify ARIA labels
      expect(screen.getByRole('img')).toHaveAttribute('alt');
      expect(screen.getByRole('button', { name: /delete t-shirt/i })).toHaveAttribute('aria-label');

      // Verify keyboard navigation
      const buttons = screen.getAllByRole('button');
      buttons[0].focus();
      fireEvent.keyDown(buttons[0], { key: 'Enter' });
      expect(buttons[0]).toHaveFocus();
    });
  });

  it('handles responsive layout', async () => {
    const { container } = renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      // Test mobile layout
      global.innerWidth = 375;
      fireEvent(window, new Event('resize'));
      expect(container.firstChild).toHaveClass('grid-cols-1');

      // Test tablet layout
      global.innerWidth = 768;
      fireEvent(window, new Event('resize'));
      expect(container.firstChild).toHaveClass('grid-cols-2');

      // Test desktop layout
      global.innerWidth = 1024;
      fireEvent(window, new Event('resize'));
      expect(container.firstChild).toHaveClass('grid-cols-3');
    });
  });

  it('handles theme preferences', async () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toHaveClass('dark-theme');
    });
  });

  it('handles print layout', async () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(print)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    renderWithProvider(<ClosetGrid />);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toHaveClass('print-layout');
    });
  });

  it('handles drag and drop reordering', async () => {
    const mockOnReorder = jest.fn();
    renderWithProvider(<ClosetGrid />);

    const items = screen.getAllByRole('img');
    const dragSource = items[0];
    const dropTarget = items[1];

    // Simulate drag start
    fireEvent.dragStart(dragSource);
    expect(dragSource).toHaveClass('dragging');

    // Simulate drag over
    fireEvent.dragOver(dropTarget);
    expect(dropTarget).toHaveClass('drag-over');

    // Simulate drop
    fireEvent.drop(dropTarget);
    expect(mockOnReorder).toHaveBeenCalledWith(0, 1);
  });

  it('handles keyboard reordering', async () => {
    const mockOnReorder = jest.fn();
    renderWithProvider(<ClosetGrid />);

    const items = screen.getAllByRole('img');
    items[0].focus();

    // Move item down
    fireEvent.keyDown(items[0], { key: 'ArrowDown' });
    expect(mockOnReorder).toHaveBeenCalledWith(0, 1);

    // Move item up
    fireEvent.keyDown(items[1], { key: 'ArrowUp' });
    expect(mockOnReorder).toHaveBeenCalledWith(1, 0);
  });

  it('handles item search with special characters', async () => {
    renderWithProvider(<ClosetGrid />);

    const searchInput = screen.getByPlaceholderText(/search by tag/i);
    fireEvent.change(searchInput, { target: { value: 't-shirt!' } });

    expect(screen.getByText('t-shirt')).toBeInTheDocument();
    expect(screen.queryByText('jeans')).not.toBeInTheDocument();
  });

  it('handles item search with multiple words', async () => {
    renderWithProvider(<ClosetGrid />);

    const searchInput = screen.getByPlaceholderText(/search by tag/i);
    fireEvent.change(searchInput, { target: { value: 'blue t-shirt' } });

    expect(screen.getByText('t-shirt')).toBeInTheDocument();
    expect(screen.queryByText('jeans')).not.toBeInTheDocument();
  });

  it('handles item search with case insensitivity', async () => {
    renderWithProvider(<ClosetGrid />);

    const searchInput = screen.getByPlaceholderText(/search by tag/i);
    fireEvent.change(searchInput, { target: { value: 'T-SHIRT' } });

    expect(screen.getByText('t-shirt')).toBeInTheDocument();
  });

  it('handles item search with partial matches', async () => {
    renderWithProvider(<ClosetGrid />);

    const searchInput = screen.getByPlaceholderText(/search by tag/i);
    fireEvent.change(searchInput, { target: { value: 'shirt' } });

    expect(screen.getByText('t-shirt')).toBeInTheDocument();
  });
}); 