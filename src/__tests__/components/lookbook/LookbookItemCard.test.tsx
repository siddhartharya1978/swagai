import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LookbookItemCard } from '@/components/lookbook/LookbookItemCard';
import { deleteLookbookItem } from '@/lib/api/lookbook';
import { getWardrobeItems } from '@/lib/api/wardrobe';
import type { Database } from '@/types/supabase';

type LookbookItem = Database['public']['Tables']['lookbook_items']['Row'];
type WardrobeItem = Database['public']['Tables']['wardrobe_items']['Row'];

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock API functions
jest.mock('@/lib/api/lookbook', () => ({
  deleteLookbookItem: jest.fn(),
}));

jest.mock('@/lib/api/wardrobe', () => ({
  getWardrobeItems: jest.fn(),
}));

describe('LookbookItemCard', () => {
  const mockItem: LookbookItem = {
    id: '1',
    user_id: 'user1',
    outfit_data: {
      item_ids: ['1', '2'],
      notes: 'Summer Look',
      occasion: 'casual',
      mood: 'happy',
      weather: 'sunny',
      generated_at: '2024-01-01T00:00:00Z',
    },
    created_at: '2024-01-01T00:00:00Z',
  };

  const mockWardrobeItems: WardrobeItem[] = [
    {
      id: '1',
      user_id: 'user1',
      image_url: '/test-image-1.jpg',
      cleaned_image_url: '/test-image-1.jpg',
      main_type: 'top',
      sub_type: 't-shirt',
      color: 'blue',
      pattern: 'solid',
      occasion: 'casual',
      auto_tags: ['t-shirt', 'blue', 'casual'],
      image_hash: 'hash1',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      user_id: 'user1',
      image_url: '/test-image-2.jpg',
      cleaned_image_url: '/test-image-2.jpg',
      main_type: 'bottom',
      sub_type: 'jeans',
      color: 'black',
      pattern: 'solid',
      occasion: 'casual',
      auto_tags: ['jeans', 'black', 'casual'],
      image_hash: 'hash2',
      created_at: '2024-01-01T00:00:00Z',
    },
  ];

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    (deleteLookbookItem as jest.Mock).mockResolvedValue({ error: null });
    (getWardrobeItems as jest.Mock).mockResolvedValue(mockWardrobeItems);
    mockOnDelete.mockClear();
  });

  it('renders item details', async () => {
    render(
      <LookbookItemCard
        item={mockItem}
        userId="user1"
        onDelete={mockOnDelete}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Summer Look')).toBeInTheDocument();
      expect(screen.getByText(/casual/i)).toBeInTheDocument();
      expect(screen.getByText(/happy/i)).toBeInTheDocument();
      expect(screen.getByText(/sunny/i)).toBeInTheDocument();
    });
  });

  it('displays outfit items', async () => {
    render(
      <LookbookItemCard
        item={mockItem}
        userId="user1"
        onDelete={mockOnDelete}
      />
    );

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('alt', 'top t-shirt');
      expect(images[1]).toHaveAttribute('alt', 'bottom jeans');
    });
  });

  it('handles item deletion', async () => {
    render(
      <LookbookItemCard
        item={mockItem}
        userId="user1"
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /ok/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteLookbookItem).toHaveBeenCalledWith('1', 'user1');
      expect(mockOnDelete).toHaveBeenCalled();
    });
  });

  it('handles deletion error', async () => {
    (deleteLookbookItem as jest.Mock).mockRejectedValue(new Error('Failed to delete'));
    render(
      <LookbookItemCard
        item={mockItem}
        userId="user1"
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /ok/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/error deleting outfit/i)).toBeInTheDocument();
    });
  });

  it('handles missing wardrobe items', async () => {
    (getWardrobeItems as jest.Mock).mockResolvedValue([]);
    render(
      <LookbookItemCard
        item={mockItem}
        userId="user1"
        onDelete={mockOnDelete}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByText(/item not found/i)).toHaveLength(2);
    });
  });

  it('handles image loading error', async () => {
    render(
      <LookbookItemCard
        item={mockItem}
        userId="user1"
        onDelete={mockOnDelete}
      />
    );

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      fireEvent.error(images[0]);
      expect(images[0]).toHaveAttribute('src', '/placeholder-image.jpg');
    });
  });

  it('formats creation date', async () => {
    render(
      <LookbookItemCard
        item={mockItem}
        userId="user1"
        onDelete={mockOnDelete}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/january 1, 2024/i)).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching wardrobe items', () => {
    (getWardrobeItems as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(
      <LookbookItemCard
        item={mockItem}
        userId="user1"
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getAllByRole('status')).toHaveLength(2);
  });

  it('handles wardrobe items fetch error', async () => {
    (getWardrobeItems as jest.Mock).mockRejectedValue(new Error('Failed to fetch items'));
    render(
      <LookbookItemCard
        item={mockItem}
        userId="user1"
        onDelete={mockOnDelete}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/error loading items/i)).toBeInTheDocument();
    });
  });
}); 