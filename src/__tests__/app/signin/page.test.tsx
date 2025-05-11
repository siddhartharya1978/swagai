import { render, screen, fireEvent } from '@testing-library/react';
import Page from '@/app/signin/page';
import { useAuth } from '@/components/auth/AuthProvider';

// Mock the auth context
jest.mock('@/components/auth/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/signin',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Sign In Page', () => {
  const mockUser = {
    id: 'user1',
    email: 'test@example.com',
  };

  const mockSignIn = jest.fn();
  const mockSignUp = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      signIn: mockSignIn,
      signUp: mockSignUp,
    });
    mockSignIn.mockClear();
    mockSignUp.mockClear();
  });

  it('renders sign in form', () => {
    render(<Page />);

    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('handles sign in form submission', async () => {
    render(<Page />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('handles sign up form submission', async () => {
    render(<Page />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signUpButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signUpButton);

    expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('disables buttons while loading', () => {
    render(<Page />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    const signUpButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.click(signInButton);

    expect(signInButton).toBeDisabled();
    expect(signUpButton).toBeDisabled();
  });

  it('shows error message when sign in fails', async () => {
    mockSignIn.mockRejectedValue(new Error('Failed to sign in'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Page />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    await expect(mockSignIn).rejects.toThrow('Failed to sign in');
    expect(consoleSpy).toHaveBeenCalledWith('Error signing in:', expect.any(Error));
    expect(alertSpy).toHaveBeenCalledWith('Failed to sign in. Please try again.');

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('shows error message when sign up fails', async () => {
    mockSignUp.mockRejectedValue(new Error('Failed to sign up'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Page />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signUpButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signUpButton);

    await expect(mockSignUp).rejects.toThrow('Failed to sign up');
    expect(consoleSpy).toHaveBeenCalledWith('Error signing up:', expect.any(Error));
    expect(alertSpy).toHaveBeenCalledWith('Failed to create account. Please try again.');

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
}); 