import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';

describe('WelcomeModal', () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    mockOnOpenChange.mockClear();
  });

  it('renders with all expected content', () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByText('Welcome to Swag AI!')).toBeInTheDocument();
    expect(screen.getByText(/digitize your wardrobe/i)).toBeInTheDocument();
    expect(screen.getByText(/upload your clothing photos/i)).toBeInTheDocument();
    expect(screen.getAllByText(/get ai-powered outfit suggestions/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/save outfits to your lookbook/i)).toBeInTheDocument();
    expect(screen.getByText(/share your style/i)).toBeInTheDocument();
    expect(screen.getByText(/let's get started/i)).toBeInTheDocument();
  });

  it('handles get started button click', () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    fireEvent.click(screen.getByText('Get Started'));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles checkbox state', () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    const checkbox = screen.getByLabelText(/don't show this again/i);
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('saves to localStorage when checkbox is checked', () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    const checkbox = screen.getByLabelText(/don't show this again/i);
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText('Get Started'));
    expect(localStorage.getItem('onboardingComplete')).toBe('true');
  });

  it('auto-closes when onboarding is complete', () => {
    localStorage.setItem('onboardingComplete', 'true');
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles dialog open state changes', () => {
    const { rerender } = render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    rerender(<WelcomeModal open={false} onOpenChange={mockOnOpenChange} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('maintains checkbox state across re-renders', () => {
    const { rerender } = render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    const checkbox = screen.getByLabelText(/don't show this again/i);
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    rerender(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    expect(checkbox).toBeChecked();
  });

  it('handles keyboard navigation', async () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    const checkbox = screen.getByLabelText(/don't show this again/i);
    const getStartedButton = screen.getByText('Get Started');

    // Focus checkbox
    checkbox.focus();
    expect(checkbox).toHaveFocus();

    // Tab to button
    fireEvent.keyDown(checkbox, { key: 'Tab' });
    await waitFor(() => {
      expect(getStartedButton).toHaveFocus();
    });

    // Enter on button
    fireEvent.keyDown(getStartedButton, { key: 'Enter' });
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles escape key', () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles click outside to close', () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    const overlays = document.querySelectorAll('[data-state="open"]');
    if (overlays.length > 0) {
      fireEvent.pointerDown(overlays[0]);
      fireEvent.pointerUp(overlays[0]);
      fireEvent.click(overlays[0]);
    } else {
      fireEvent.click(document.body);
    }
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles multiple open/close cycles', () => {
    const { rerender } = render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    rerender(<WelcomeModal open={false} onOpenChange={mockOnOpenChange} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    rerender(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('handles rapid checkbox toggles', () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    const checkbox = screen.getByLabelText(/don't show this again/i);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('handles concurrent state updates', async () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    const checkbox = screen.getByLabelText(/don't show this again/i);
    const getStartedButton = screen.getByText('Get Started');

    // Simulate rapid interactions
    fireEvent.click(checkbox);
    fireEvent.click(getStartedButton);
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('handles rapid open/close cycles with checkbox state', async () => {
    const { rerender } = render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    const checkbox = screen.getByLabelText(/don't show this again/i);
    
    // Check checkbox
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    // Close modal
    rerender(<WelcomeModal open={false} onOpenChange={mockOnOpenChange} />);
    
    // Reopen modal
    rerender(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    
    // Verify checkbox state is maintained
    expect(checkbox).toBeChecked();
    
    // Close modal again
    rerender(<WelcomeModal open={false} onOpenChange={mockOnOpenChange} />);
    
    // Verify localStorage was set
    expect(localStorage.getItem('onboardingComplete')).toBe('true');
  });

  it('handles concurrent state updates with localStorage', async () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    const checkbox = screen.getByLabelText(/don't show this again/i);
    const getStartedButton = screen.getByText('Get Started');

    // Simulate rapid interactions
    fireEvent.click(checkbox);
    fireEvent.click(getStartedButton);
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(localStorage.getItem('onboardingComplete')).toBe('true');
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('handles localStorage errors gracefully', async () => {
    // Mock localStorage.setItem to throw an error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = jest.fn().mockImplementation(() => {
      throw new Error('Storage error');
    });

    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    const checkbox = screen.getByLabelText(/don't show this again/i);
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText('Get Started'));

    // Verify modal still closes even if localStorage fails
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);

    // Restore original localStorage.setItem
    localStorage.setItem = originalSetItem;
  });

  it('handles screen reader announcements', async () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    
    // Verify ARIA live region is present
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
    
    // Verify content is announced
    expect(liveRegion).toHaveTextContent(/welcome to swag ai/i);
  });

  it('handles focus management on open', async () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    
    // Verify focus is trapped within modal
    const modal = screen.getByRole('dialog');
    const focusableElements = Array.from(modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[];
    
    // Focus first element
    focusableElements[0].focus();
    expect(focusableElements[0]).toHaveFocus();
    
    // Tab through all elements
    for (let i = 0; i < focusableElements.length; i++) {
      fireEvent.keyDown(focusableElements[i], { key: 'Tab' });
      const nextIndex = (i + 1) % focusableElements.length;
      expect(focusableElements[nextIndex]).toHaveFocus();
    }
  });

  it('handles focus management on close', async () => {
    const { rerender } = render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    
    // Get the element that had focus before modal opened
    const previousFocus = document.activeElement;
    
    // Close modal
    rerender(<WelcomeModal open={false} onOpenChange={mockOnOpenChange} />);
    
    // Verify focus returns to previous element
    expect(previousFocus).toHaveFocus();
  });

  it('handles window resize events', async () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    
    // Simulate window resize
    global.innerWidth = 500;
    fireEvent(window, new Event('resize'));
    
    // Verify modal remains centered and visible
    const modal = screen.getByRole('dialog');
    expect(modal).toBeVisible();
    expect(modal).toHaveStyle({ transform: 'translate(-50%, -50%)' });
  });

  it('handles print media query', async () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    
    // Simulate print media query
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(print)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    
    // Verify modal is hidden when printing
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveStyle({ display: 'none' });
  });

  it('handles reduced motion preferences', async () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    
    // Simulate reduced motion preference
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    
    // Verify animations are disabled
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveStyle({ animation: 'none' });
  });

  it('handles high contrast mode', async () => {
    render(<WelcomeModal open={true} onOpenChange={mockOnOpenChange} />);
    
    // Simulate high contrast mode
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(forced-colors: active)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    
    // Verify high contrast styles are applied
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveStyle({ border: '2px solid' });
  });
}); 