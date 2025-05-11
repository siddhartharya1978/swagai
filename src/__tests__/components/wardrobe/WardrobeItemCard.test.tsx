import { render, screen, fireEvent } from '@testing-library/react';
import { WardrobeItemCard } from '@/components/wardrobe/WardrobeItemCard';
import type { Database } from '@/types/supabase';

type WardrobeItem = Database['public']['Tables']['wardrobe_items']['Row'];

describe('WardrobeItemCard', () => {
  const mockItem: WardrobeItem = {
    id: '1',
    user_id: 'user1',
    image_url: 'tshirt.jpg',
    cleaned_image_url: 'tshirt_cleaned.jpg',
    main_type: 'Tops',
    sub_type: 'T-Shirt',
    color: 'blue',
    pattern: 'solid',
    occasion: 'casual',
    auto_tags: ['t-shirt', 'blue', 'casual'],
    image_hash: 'abc123',
    created_at: '2024-01-01T00:00:00Z'
  };

  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
    mockOnEdit.mockClear();
  });

  it('renders item details', () => {
    render(
      <WardrobeItemCard
        item={mockItem}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Tops')).toBeInTheDocument();
    expect(screen.getByText('blue')).toBeInTheDocument();
    expect(screen.getByText('t-shirt')).toBeInTheDocument();
    expect(screen.getByText('casual')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <WardrobeItemCard
        item={mockItem}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockOnDelete).toHaveBeenCalledWith(mockItem);
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <WardrobeItemCard
        item={mockItem}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockOnEdit).toHaveBeenCalledWith(mockItem);
  });

  it('toggles between original and cleaned image', () => {
    render(
      <WardrobeItemCard
        item={mockItem}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /toggle image/i });
    fireEvent.click(toggleButton);
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('tshirt_cleaned.jpg'));
    
    fireEvent.click(toggleButton);
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('tshirt.jpg'));
  });

  it('renders without cleaned image', () => {
    const itemWithoutCleanedImage = { ...mockItem, cleaned_image_url: null };
    render(
      <WardrobeItemCard
        item={itemWithoutCleanedImage}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('tshirt.jpg'));
  });

  it('renders without auto tags', () => {
    const itemWithoutTags = { ...mockItem, auto_tags: [] };
    render(
      <WardrobeItemCard
        item={itemWithoutTags}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.queryByText('t-shirt')).not.toBeInTheDocument();
  });

  it('renders with empty pattern and occasion', () => {
    const itemWithEmptyPatternAndOccasion = { 
      ...mockItem, 
      pattern: '', 
      occasion: '' 
    };
    render(
      <WardrobeItemCard
        item={itemWithEmptyPatternAndOccasion}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.queryByText('solid')).not.toBeInTheDocument();
    expect(screen.queryByText('casual')).not.toBeInTheDocument();
  });
}); 