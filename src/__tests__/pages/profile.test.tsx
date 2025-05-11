// Mock supabase before importing
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  },
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '@/app/dashboard/profile/page';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '@/lib/api/profile';
import { BODY_TYPES, COUNTRIES, STYLE_OPTIONS, SHOPPING_BEHAVIOUR } from '@/lib/constants';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock auth context
jest.mock('@/components/auth/AuthProvider', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock API functions
jest.mock('@/lib/api/profile', () => ({
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  deleteUserAccount: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Profile Page', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  const mockProfile = {
    full_name: 'Test User',
    date_of_birth: '1990-01-01',
    city: 'Test City',
    country: 'India',
    body_type: 'Straight',
    body_notes: 'Test notes',
    style_preferences: ['casual'],
    shopping_behaviour: 'Rarely',
    created_at: '2023-01-01T00:00:00Z',
    last_login: '2023-01-02T00:00:00Z',
  };

  beforeEach(() => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      signOut: jest.fn(),
    });

    // Mock fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockProfile),
    });

    // Mock successful API responses
    (updateUserProfile as jest.Mock).mockResolvedValue({ error: null });
    (deleteUserAccount as jest.Mock).mockResolvedValue({ error: null });

    jest.clearAllMocks();
  });

  it('renders profile form with user data', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1990-01-01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test City')).toBeInTheDocument();
    });
  });

  it('handles form submission successfully', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Updated Name' },
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: '1990-01-02' },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Updated City' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith(mockUser.id, expect.objectContaining({
        full_name: 'Updated Name',
        date_of_birth: '1990-01-02',
        city: 'Updated City',
      }));
    });
  });

  it('shows validation errors for required fields', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    // Clear required fields
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: '' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Full name is required.'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Date of birth is required.'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('City is required.'))).toBeInTheDocument();
    });
  });

  it('handles style preferences selection', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    // Click a style preference button that is not initially selected
    const styleButton = screen.getByText('minimalist');
    fireEvent.click(styleButton);
    // Assert aria-pressed is true
    expect(styleButton).toHaveAttribute('aria-pressed', 'true');

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith(mockUser.id, expect.objectContaining({
        style_preferences: expect.arrayContaining(['minimalist']),
      }));
    });
  });

  it('handles profile update error', async () => {
    (updateUserProfile as jest.Mock).mockRejectedValue(new Error('Update failed'));
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Updated Name' },
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: '1990-01-02' },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Updated City' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Failed to save changes. Please try again.'))).toBeInTheDocument();
    });
  });

  it('handles account deletion', async () => {
    const mockSignOut = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    // Click delete account button
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }));

    // Confirm deletion
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() => {
      expect(deleteUserAccount).toHaveBeenCalledWith(mockUser.id);
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it('shows loading state', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<Profile />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows sign in message when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      signOut: jest.fn(),
    });

    render(<Profile />);

    expect(screen.getByText('Please sign in to view your profile')).toBeInTheDocument();
  });

  it('handles network error when fetching profile', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument();
    });
  });

  it('handles invalid date format', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: 'invalid-date' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid date format/i)).toBeInTheDocument();
    });
  });

  it('handles concurrent profile updates', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    // Simulate multiple rapid updates
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'First Update' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Second Update' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledTimes(2);
    });
  });

  it('handles profile deletion confirmation cancellation', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    // Click delete account button
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }));

    // Click cancel button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(deleteUserAccount).not.toHaveBeenCalled();
    });
  });

  it('handles profile update with maximum length inputs', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    const longName = 'a'.repeat(100);
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: longName },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is too long/i)).toBeInTheDocument();
    });
  });

  it('handles profile update with special characters', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User!@#$%^&*()' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({
          full_name: 'Test User!@#$%^&*()',
        })
      );
    });
  });

  it('handles profile update with empty style preferences', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    // Deselect all style preferences
    const styleButtons = screen.getAllByRole('button', { name: /style/i });
    styleButtons.forEach(button => {
      if (button.getAttribute('aria-pressed') === 'true') {
        fireEvent.click(button);
      }
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/select at least one style preference/i)).toBeInTheDocument();
    });
  });

  it('handles profile update with invalid country selection', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    const countrySelect = screen.getByLabelText(/country/i);
    fireEvent.change(countrySelect, {
      target: { value: 'Invalid Country' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid country selection/i)).toBeInTheDocument();
    });
  });

  it('handles profile update with future date of birth', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const futureDate = tomorrow.toISOString().split('T')[0];

    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: futureDate },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/date of birth cannot be in the future/i)).toBeInTheDocument();
    });
  });

  it('handles profile update with minimum age validation', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });

    const recentDate = new Date();
    recentDate.setFullYear(recentDate.getFullYear() - 12); // 12 years ago
    const youngAgeDate = recentDate.toISOString().split('T')[0];

    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: youngAgeDate },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/must be at least 13 years old/i)).toBeInTheDocument();
    });
  });
}); 