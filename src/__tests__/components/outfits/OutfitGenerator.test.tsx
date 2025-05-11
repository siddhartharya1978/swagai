import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OutfitGenerator } from '@/components/outfits/OutfitGenerator';
import { generateOutfit } from '@/lib/api/gemini';
import { saveToLookbook } from '@/lib/api/lookbook';
import { useToast } from '@/components/ui/use-toast';
import { TooltipProvider } from '@/components/ui/Tooltip';

// Mock the API functions
jest.mock('@/lib/api/gemini', () => ({
  generateOutfit: jest.fn(),
}));

jest.mock('@/lib/api/lookbook', () => ({
  saveToLookbook: jest.fn(),
}));

// Mock the toast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
};

describe('OutfitGenerator', () => {
  const mockToast = {
    toast: jest.fn(),
  };

  const mockOutfit = {
    item_ids: ['1', '2'],
    notes: 'A comfortable casual outfit',
    occasion: 'casual',
    mood: 'happy',
    weather: 'sunny',
    generated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue(mockToast);
    (generateOutfit as jest.Mock).mockResolvedValue(mockOutfit);
    (saveToLookbook as jest.Mock).mockResolvedValue({ error: null });
    mockToast.toast.mockClear();
  });

  it('renders all form elements', () => {
    renderWithProvider(<OutfitGenerator userId="user1" />);

    expect(screen.getByText('Generate Your Outfit')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Occasion' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Mood' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Weather' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate outfit/i })).toBeInTheDocument();
  });

  it('disables generate button when form is incomplete', () => {
    renderWithProvider(<OutfitGenerator userId="user1" />);

    const generateButton = screen.getByRole('button', { name: /generate outfit/i });
    expect(generateButton).toBeDisabled();
  });

  it('enables generate button when all fields are filled', () => {
    renderWithProvider(<OutfitGenerator userId="user1" />);

    // Select all options
    fireEvent.click(screen.getByRole('combobox', { name: 'Occasion' }));
    fireEvent.click(screen.getByText('Casual'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Mood' }));
    fireEvent.click(screen.getByText('Happy'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Weather' }));
    fireEvent.click(screen.getByText('Sunny'));

    const generateButton = screen.getByRole('button', { name: /generate outfit/i });
    expect(generateButton).not.toBeDisabled();
  });

  it('shows loading state while generating outfit', async () => {
    renderWithProvider(<OutfitGenerator userId="user1" />);

    // Fill form
    fireEvent.click(screen.getByRole('combobox', { name: 'Occasion' }));
    fireEvent.click(screen.getByText('Casual'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Mood' }));
    fireEvent.click(screen.getByText('Happy'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Weather' }));
    fireEvent.click(screen.getByText('Sunny'));

    // Generate outfit
    fireEvent.click(screen.getByRole('button', { name: /generate outfit/i }));

    expect(screen.getByText('Generating...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('displays generated outfit', async () => {
    renderWithProvider(<OutfitGenerator userId="user1" />);

    // Fill form and generate
    fireEvent.click(screen.getByRole('combobox', { name: 'Occasion' }));
    fireEvent.click(screen.getByText('Casual'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Mood' }));
    fireEvent.click(screen.getByText('Happy'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Weather' }));
    fireEvent.click(screen.getByText('Sunny'));

    fireEvent.click(screen.getByRole('button', { name: /generate outfit/i }));

    await waitFor(() => {
      expect(screen.getByText('Your Generated Outfit')).toBeInTheDocument();
      expect(screen.getByText('A comfortable casual outfit')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  it('handles generation error', async () => {
    (generateOutfit as jest.Mock).mockRejectedValue(new Error('Generation failed'));

    renderWithProvider(<OutfitGenerator userId="user1" />);

    // Fill form and generate
    fireEvent.click(screen.getByRole('combobox', { name: 'Occasion' }));
    fireEvent.click(screen.getByText('Casual'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Mood' }));
    fireEvent.click(screen.getByText('Happy'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Weather' }));
    fireEvent.click(screen.getByText('Sunny'));

    fireEvent.click(screen.getByRole('button', { name: /generate outfit/i }));

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Error generating outfit',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    });
  });

  it('saves outfit to lookbook', async () => {
    renderWithProvider(<OutfitGenerator userId="user1" />);

    // Fill form and generate
    fireEvent.click(screen.getByRole('combobox', { name: 'Occasion' }));
    fireEvent.click(screen.getByText('Casual'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Mood' }));
    fireEvent.click(screen.getByText('Happy'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Weather' }));
    fireEvent.click(screen.getByText('Sunny'));

    fireEvent.click(screen.getByRole('button', { name: /generate outfit/i }));

    await waitFor(() => {
      expect(screen.getByText('Your Generated Outfit')).toBeInTheDocument();
    });

    // Save outfit
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(saveToLookbook).toHaveBeenCalledWith(mockOutfit, 'user1');
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Outfit saved',
        description: 'Your outfit has been saved to your lookbook.',
      });
    });
  });

  it('handles save error', async () => {
    (saveToLookbook as jest.Mock).mockRejectedValue(new Error('Save failed'));

    renderWithProvider(<OutfitGenerator userId="user1" />);

    // Fill form and generate
    fireEvent.click(screen.getByRole('combobox', { name: 'Occasion' }));
    fireEvent.click(screen.getByText('Casual'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Mood' }));
    fireEvent.click(screen.getByText('Happy'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Weather' }));
    fireEvent.click(screen.getByText('Sunny'));

    fireEvent.click(screen.getByRole('button', { name: /generate outfit/i }));

    await waitFor(() => {
      expect(screen.getByText('Your Generated Outfit')).toBeInTheDocument();
    });

    // Save outfit
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Error saving outfit',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    });
  });

  it('handles feedback submission', async () => {
    renderWithProvider(<OutfitGenerator userId="user1" />);

    // Fill form and generate
    fireEvent.click(screen.getByRole('combobox', { name: 'Occasion' }));
    fireEvent.click(screen.getByText('Casual'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Mood' }));
    fireEvent.click(screen.getByText('Happy'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Weather' }));
    fireEvent.click(screen.getByText('Sunny'));

    fireEvent.click(screen.getByRole('button', { name: /generate outfit/i }));

    await waitFor(() => {
      expect(screen.getByText('Your Generated Outfit')).toBeInTheDocument();
    });

    // Submit feedback
    const likeButtons = screen.getAllByRole('button', { name: /like/i });
    fireEvent.click(likeButtons[0]);

    expect(mockToast.toast).toHaveBeenCalledWith({
      title: 'Thank you for your feedback!',
      description: 'You liked this outfit.',
    });
  });

  it('handles multiple generations', async () => {
    renderWithProvider(<OutfitGenerator userId="user1" />);

    // First generation
    fireEvent.click(screen.getByRole('combobox', { name: 'Occasion' }));
    fireEvent.click(screen.getByText('Casual'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Mood' }));
    fireEvent.click(screen.getByText('Happy'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Weather' }));
    fireEvent.click(screen.getByText('Sunny'));

    fireEvent.click(screen.getByRole('button', { name: /generate outfit/i }));

    await waitFor(() => {
      expect(screen.getByText('Your Generated Outfit')).toBeInTheDocument();
    });

    // Generate again
    fireEvent.click(screen.getByRole('button', { name: /generate again/i }));

    await waitFor(() => {
      expect(screen.getByText('Generate Your Outfit')).toBeInTheDocument();
    });
  });

  it('resets state when generating new outfit', async () => {
    renderWithProvider(<OutfitGenerator userId="user1" />);

    // First generation
    fireEvent.click(screen.getByRole('combobox', { name: 'Occasion' }));
    fireEvent.click(screen.getByText('Casual'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Mood' }));
    fireEvent.click(screen.getByText('Happy'));

    fireEvent.click(screen.getByRole('combobox', { name: 'Weather' }));
    fireEvent.click(screen.getByText('Sunny'));

    fireEvent.click(screen.getByRole('button', { name: /generate outfit/i }));

    await waitFor(() => {
      expect(screen.getByText('Your Generated Outfit')).toBeInTheDocument();
    });

    // Generate again
    fireEvent.click(screen.getByRole('button', { name: /generate again/i }));

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Occasion' })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Mood' })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Weather' })).toBeInTheDocument();
    });
  });
}); 