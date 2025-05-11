import { render, screen } from '@testing-library/react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

// Mock the useAuth hook
jest.mock('@/components/auth/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('AuthGuard', () => {
  const mockUseAuth = useAuth as jest.Mock;
  const mockRouter = useRouter as jest.Mock;

  beforeEach(() => {
    mockUseAuth.mockClear();
    mockRouter.mockClear();
    mockRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ user: { id: '123' }, loading: false });
    
    render(
      <AuthGuard>
        <div>Protected content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('renders loading spinner when authentication is in progress', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    
    render(
      <AuthGuard>
        <div>Protected content</div>
      </AuthGuard>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('redirects to signin when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    const mockPush = jest.fn();
    mockRouter.mockReturnValue({ push: mockPush });
    
    render(
      <AuthGuard>
        <div>Protected content</div>
      </AuthGuard>
    );

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/signin');
  });

  it('returns null when user is not authenticated and not loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    
    const { container } = render(
      <AuthGuard>
        <div>Protected content</div>
      </AuthGuard>
    );

    expect(container).toBeEmptyDOMElement();
  });
}); 