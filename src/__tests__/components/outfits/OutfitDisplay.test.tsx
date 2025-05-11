import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OutfitDisplay } from '@/components/outfits/OutfitDisplay';
import type { OutfitSuggestion } from '@/lib/api/gemini';
import type { Database } from '@/types/supabase';

type WardrobeItem = Database['public']['Tables']['wardrobe_items']['Row'];

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock the toast hook
const mockToast = jest.fn();
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe('OutfitDisplay', () => {
  const mockOutfits: OutfitSuggestion[] = [
    {
      item_ids: ['1', '2'],
      notes: 'Perfect for a sunny day',
      occasion: 'casual',
      mood: 'happy',
      weather: 'sunny',
      generated_at: '2024-01-01T00:00:00Z',
    },
  ];

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

  const mockOnSaveToLookbook = jest.fn();
  const mockOnFeedback = jest.fn();
  const mockOnTryAgain = jest.fn();

  beforeEach(() => {
    mockOnSaveToLookbook.mockClear();
    mockOnFeedback.mockClear();
    mockOnTryAgain.mockClear();
    mockToast.mockClear();
  });

  it('renders outfit details', () => {
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    expect(screen.getByText('Outfit 1')).toBeInTheDocument();
    expect(screen.getByText('Perfect for a sunny day')).toBeInTheDocument();
  });

  it('displays outfit items', () => {
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('alt', 't-shirt, blue, casual');
    expect(images[1]).toHaveAttribute('alt', 'jeans, black, casual');
  });

  it('handles save to lookbook', async () => {
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save to lookbook/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSaveToLookbook).toHaveBeenCalledWith(mockOutfits[0]);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Saved to lookbook',
        description: 'Your outfit has been saved successfully.',
      });
    });
  });

  it('handles positive feedback', async () => {
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const likeButton = screen.getByRole('button', { name: 'Like outfit' });
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(mockOnFeedback).toHaveBeenCalledWith(mockOutfits[0].item_ids[0], true);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Feedback recorded',
        description: 'Thank you for your feedback!',
      });
    });
  });

  it('handles negative feedback', async () => {
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const dislikeButton = screen.getByRole('button', { name: 'Dislike outfit' });
    fireEvent.click(dislikeButton);

    await waitFor(() => {
      expect(mockOnFeedback).toHaveBeenCalledWith(mockOutfits[0].item_ids[0], false);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Feedback recorded',
        description: 'Thank you for your feedback!',
      });
    });
  });

  it('handles try again', () => {
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const tryAgainButton = screen.getByRole('button', { name: /try different options/i });
    fireEvent.click(tryAgainButton);

    expect(mockOnTryAgain).toHaveBeenCalled();
  });

  it('handles save error', async () => {
    mockOnSaveToLookbook.mockRejectedValue(new Error('Failed to save'));
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save to lookbook/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error saving outfit',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    });
  });

  it('handles feedback error', async () => {
    mockOnFeedback.mockRejectedValue(new Error('Failed to record feedback'));
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const likeButton = screen.getByRole('button', { name: 'Like outfit' });
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error recording feedback',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    });
  });

  it('returns null when no outfits', () => {
    const { container } = render(
      <OutfitDisplay
        outfits={[]}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('handles missing item', () => {
    const outfitsWithMissingItem: OutfitSuggestion[] = [
      {
        item_ids: ['1', '3'], // '3' doesn't exist in wardrobeItems
        notes: 'Perfect for a sunny day',
        occasion: 'casual',
        mood: 'happy',
        weather: 'sunny',
        generated_at: '2024-01-01T00:00:00Z',
      },
    ];

    render(
      <OutfitDisplay
        outfits={outfitsWithMissingItem}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1); // Only the first item should be rendered
    expect(images[0]).toHaveAttribute('alt', 't-shirt, blue, casual');
  });

  it('handles outfit generation error with retry', async () => {
    mockOnTryAgain.mockRejectedValueOnce(new Error('Generation failed'));
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error generating outfit',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    });
  });

  it('handles outfit save to lookbook with confirmation', async () => {
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save to lookbook/i });
    fireEvent.click(saveButton);

    // Verify confirmation dialog
    expect(screen.getByText(/save outfit to lookbook/i)).toBeInTheDocument();
    
    // Confirm save
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnSaveToLookbook).toHaveBeenCalledWith(mockOutfits[0]);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Outfit saved',
        description: 'Your outfit has been saved to your lookbook.',
      });
    });
  });

  it('handles outfit save cancellation', async () => {
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save to lookbook/i });
    fireEvent.click(saveButton);

    // Cancel save
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnSaveToLookbook).not.toHaveBeenCalled();
  });

  it('handles outfit feedback with comments', async () => {
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const feedbackButton = screen.getByRole('button', { name: /provide feedback/i });
    fireEvent.click(feedbackButton);

    // Enter feedback comment
    const commentInput = screen.getByLabelText(/feedback comment/i);
    fireEvent.change(commentInput, { target: { value: 'Great outfit!' } });

    // Submit feedback
    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnFeedback).toHaveBeenCalledWith(mockOutfits[0].item_ids[0], {
        rating: 'positive',
        comment: 'Great outfit!',
      });
    });
  });

  it('handles outfit sharing', async () => {
    const mockShare = jest.fn();
    Object.assign(navigator, {
      share: mockShare,
    });

    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const shareButton = screen.getByRole('button', { name: /share outfit/i });
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith({
        title: 'My Outfit',
        text: 'Check out this outfit!',
        url: expect.any(String),
      });
    });
  });

  it('handles outfit image loading errors', async () => {
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const images = screen.getAllByRole('img');
    fireEvent.error(images[0]);

    await waitFor(() => {
      expect(screen.getByText(/failed to load image/i)).toBeInTheDocument();
    });
  });

  it('handles outfit image lazy loading', async () => {
    const mockIntersectionObserver = jest.fn();
    const mockDisconnect = jest.fn();

    window.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
      observe: () => mockIntersectionObserver(callback),
      disconnect: mockDisconnect,
    }));

    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('loading', 'lazy');
  });

  it('handles outfit accessibility features', async () => {
    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    // Verify ARIA labels
    expect(screen.getByRole('img')).toHaveAttribute('alt');
    expect(screen.getByRole('button', { name: /like outfit/i })).toHaveAttribute('aria-pressed');
    expect(screen.getByRole('button', { name: /dislike outfit/i })).toHaveAttribute('aria-pressed');

    // Verify keyboard navigation
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'Enter' });
    expect(mockOnFeedback).toHaveBeenCalled();
  });

  it('handles outfit responsive layout', async () => {
    const { container } = render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    // Test mobile layout
    global.innerWidth = 375;
    fireEvent(window, new Event('resize'));
    expect(container.firstChild).toHaveClass('mobile-layout');

    // Test tablet layout
    global.innerWidth = 768;
    fireEvent(window, new Event('resize'));
    expect(container.firstChild).toHaveClass('tablet-layout');

    // Test desktop layout
    global.innerWidth = 1024;
    fireEvent(window, new Event('resize'));
    expect(container.firstChild).toHaveClass('desktop-layout');
  });

  it('handles outfit theme preferences', async () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    expect(screen.getByRole('article')).toHaveClass('dark-theme');
  });

  it('handles outfit print layout', async () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(print)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    render(
      <OutfitDisplay
        outfits={mockOutfits}
        wardrobeItems={mockWardrobeItems}
        onSaveToLookbook={mockOnSaveToLookbook}
        onFeedback={mockOnFeedback}
        onTryAgain={mockOnTryAgain}
      />
    );

    expect(screen.getByRole('article')).toHaveClass('print-layout');
  });
}); 