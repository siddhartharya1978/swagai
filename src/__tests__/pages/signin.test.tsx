import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '@/app/signin/page';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/router';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock supabase auth
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
    },
  },
}));

describe('SignIn Page', () => {
  const mockRouter = useRouter();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in form', async () => {
    render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles successful sign in', async () => {
    // Mock successful sign in
    (require('@/lib/supabase').supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: 'test-user' } },
      error: null,
    });

    render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    );

    // Fill out form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles sign in error', async () => {
    // Mock sign in error
    (require('@/lib/supabase').supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: null,
      error: new Error('Invalid credentials'),
    });

    render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    );

    // Fill out form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('validates form inputs', async () => {
    render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    );

    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    );

    // Enter invalid email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });

  it('shows loading state during sign in', async () => {
    // Mock delayed sign in
    (require('@/lib/supabase').supabase.auth.signInWithPassword as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    );

    // Fill out form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });
}); 