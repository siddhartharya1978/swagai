import { render, screen, fireEvent, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, signIn, signOut } = useAuth();
  
  return (
    <div>
      <div data-testid="user-email">{user?.email || 'No user'}</div>
      <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

describe('AuthProvider', () => {
  const mockGetSession = supabase.auth.getSession as jest.Mock;
  const mockOnAuthStateChange = supabase.auth.onAuthStateChange as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });
  });

  it('renders children', () => {
    render(
      <AuthProvider>
        <div>Test content</div>
      </AuthProvider>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('provides initial loading state', () => {
    const TestComponent = () => {
      const { loading } = useAuth();
      return <div>{loading ? 'Loading' : 'Not loading'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('provides user state after session check', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    mockGetSession.mockResolvedValue({ data: { session: { user: mockUser } }, error: null });

    const TestComponent = () => {
      const { user, loading } = useAuth();
      return (
        <div>
          {loading ? 'Loading' : user ? 'Authenticated' : 'Not authenticated'}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByText('Authenticated')).toBeInTheDocument();
  });

  it('handles auth state changes', async () => {
    let authStateCallback: ((event: string, session: any) => void) | null = null;
    mockOnAuthStateChange.mockImplementation((callback) => {
      authStateCallback = callback;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    const TestComponent = () => {
      const { user } = useAuth();
      return <div>{user ? 'Authenticated' : 'Not authenticated'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      if (authStateCallback) {
        authStateCallback('SIGNED_IN', { user: { id: '123' } });
      }
    });

    expect(screen.getByText('Authenticated')).toBeInTheDocument();

    await act(async () => {
      if (authStateCallback) {
        authStateCallback('SIGNED_OUT', null);
      }
    });

    expect(screen.getByText('Not authenticated')).toBeInTheDocument();
  });

  it('handles session check error', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: new Error('Test error') });

    const TestComponent = () => {
      const { user, loading } = useAuth();
      return (
        <div>
          {loading ? 'Loading' : user ? 'Authenticated' : 'Not authenticated'}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByText('Not authenticated')).toBeInTheDocument();
  });
}); 