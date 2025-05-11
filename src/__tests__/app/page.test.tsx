import { render, screen } from '@testing-library/react';
import Page from '@/app/page';
import { useAuth } from '@/components/auth/AuthProvider';

// Mock the auth context
jest.mock('@/components/auth/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('App Page', () => {
  const mockUser = {
    id: 'user1',
    email: 'test@example.com',
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
    });
  });

  it('renders welcome message', () => {
    render(<Page />);

    expect(screen.getByText(/welcome to swag ai/i)).toBeInTheDocument();
    expect(screen.getByText(/your personal ai stylist/i)).toBeInTheDocument();
  });

  it('shows loading state while auth is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true,
    });

    render(<Page />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows sign in page when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(<Page />);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Page />);

    expect(screen.getByText(/wardrobe/i)).toBeInTheDocument();
    expect(screen.getByText(/outfits/i)).toBeInTheDocument();
    expect(screen.getByText(/lookbook/i)).toBeInTheDocument();
  });

  it('renders user profile section', () => {
    render(<Page />);

    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  it('renders error boundary', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <Page>
        <ThrowError />
      </Page>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders SEO component', () => {
    render(<Page />);

    // Check for meta tags
    expect(document.querySelector('meta[name="description"]')).toBeInTheDocument();
    expect(document.querySelector('meta[name="viewport"]')).toBeInTheDocument();
  });
}); 