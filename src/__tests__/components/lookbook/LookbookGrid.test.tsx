import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LookbookGrid } from '@/components/lookbook/LookbookGrid';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { getLookbookItems, deleteLookbookItem } from '@/lib/api/lookbook';

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
jest.mock('@/lib/api/lookbook', () => ({
  getLookbookItems: jest.fn(),
  deleteLookbookItem: jest.fn(),
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <TooltipProvider>
      {ui}
    </TooltipProvider>
  );
};

describe('LookbookGrid', () => {
  const mockItems = [
    {
      id: '1',
      user_id: 'user1',
      outfit_id: 'outfit1',
      created_at: '2024-01-01T00:00:00Z',
      outfit_data: {
        occasion: 'casual',
        mood: 'happy',
        weather: 'sunny',
        notes: 'A comfortable casual outfit',
        item_ids: ['item1', 'item2'],
      },
    },
  ];

  const mockWardrobeItems = {
    item1: {
      id: 'item1',
      image_url: '/test-image-1.jpg',
      cleaned_image_url: '/test-image-1.jpg',
      main_type: 'top',
      sub_type: 't-shirt',
      color: 'blue',
      pattern: 'solid',
      occasion: 'casual',
    },
    item2: {
      id: 'item2',
      image_url: '/test-image-2.jpg',
      cleaned_image_url: '/test-image-2.jpg',
      main_type: 'bottom',
      sub_type: 'jeans',
      color: 'black',
      pattern: 'solid',
      occasion: 'casual',
    },
  };

  beforeEach(() => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user1' },
    });

    // Mock successful API responses
    (getLookbookItems as jest.Mock).mockResolvedValue(mockItems);
    (deleteLookbookItem as jest.Mock).mockResolvedValue({ error: null });

    // Mock getWardrobeItems
    jest.mock('@/lib/api/wardrobe', () => ({
      getWardrobeItems: jest.fn().mockResolvedValue(Object.values(mockWardrobeItems)),
    }));

    toastMock = jest.fn();
    jest.clearAllMocks();
  });

  it('renders lookbook items', async () => {
    renderWithProvider(<LookbookGrid userId="user1" />);

    await waitFor(() => {
      expect(screen.getByText('casual')).toBeInTheDocument();
      expect(screen.getByText('A comfortable casual outfit')).toBeInTheDocument();
      expect(screen.getByText('happy')).toBeInTheDocument();
      expect(screen.getByText('sunny')).toBeInTheDocument();
    });
  });

  it('handles item deletion', async () => {
    renderWithProvider(<LookbookGrid userId="user1" />);

    await waitFor(() => {
      expect(screen.getByText('casual')).toBeInTheDocument();
    });

    // Find the delete button by its icon
    const deleteButton = screen.getByRole('button', { name: '' });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteLookbookItem).toHaveBeenCalledWith('1');
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success',
          description: expect.stringContaining('deleted'),
        })
      );
    });
  });

  it('handles loading state', () => {
    (getLookbookItems as jest.Mock).mockImplementation(() => new Promise(() => {}));
    renderWithProvider(<LookbookGrid userId="user1" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    (getLookbookItems as jest.Mock).mockRejectedValue(new Error('Failed to load'));
    renderWithProvider(<LookbookGrid userId="user1" />);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error loading lookbook',
          description: 'Please try again later.',
          variant: 'destructive',
        })
      );
    });
  });

  it('shows empty state when no items', async () => {
    (getLookbookItems as jest.Mock).mockResolvedValue([]);
    renderWithProvider(<LookbookGrid userId="user1" />);

    await waitFor(() => {
      expect(screen.getByText('No saved outfits yet')).toBeInTheDocument();
      expect(screen.getByText('Generate and save outfits to see them here.')).toBeInTheDocument();
    });
  });
}); 