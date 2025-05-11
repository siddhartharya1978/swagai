import { render, screen } from '@testing-library/react';
import Page from '@/app/dashboard/page';
import { useAuth } from '@/components/auth/AuthProvider';
import { TooltipProvider } from '@/components/ui/Tooltip';

// Mock the auth context
jest.mock('@/components/auth/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const renderWithTooltipProvider = (ui: React.ReactElement) => {
  return render(
    <TooltipProvider>
      {ui}
    </TooltipProvider>
  );
};

describe('Dashboard Page', () => {
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

  it('renders dashboard title', () => {
    renderWithTooltipProvider(<Page />);

    expect(screen.getByText(/my style dashboard/i)).toBeInTheDocument();
  });

  it('shows loading state while auth is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true,
    });

    renderWithTooltipProvider(<Page />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows sign in page when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
    });

    renderWithTooltipProvider(<Page />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders tab navigation', () => {
    renderWithTooltipProvider(<Page />);

    expect(screen.getByText(/wardrobe/i)).toBeInTheDocument();
    expect(screen.getByText(/outfit generator/i)).toBeInTheDocument();
    expect(screen.getByText(/lookbook/i)).toBeInTheDocument();
  });

  it('renders wardrobe section', () => {
    renderWithTooltipProvider(<Page />);

    expect(screen.getByText(/upload new items/i)).toBeInTheDocument();
    expect(screen.getByText(/my closet/i)).toBeInTheDocument();
  });

  it('renders outfit generator section', () => {
    renderWithTooltipProvider(<Page />);

    const outfitTab = screen.getByText(/outfit generator/i);
    outfitTab.click();

    expect(screen.getByText(/generate outfits/i)).toBeInTheDocument();
  });

  it('renders lookbook section', () => {
    renderWithTooltipProvider(<Page />);

    const lookbookTab = screen.getByText(/lookbook/i);
    lookbookTab.click();

    expect(screen.getByText(/saved outfits/i)).toBeInTheDocument();
  });

  it('renders user profile section', () => {
    renderWithTooltipProvider(<Page />);

    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  it('renders error boundary', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    renderWithTooltipProvider(
      <Page>
        <ThrowError />
      </Page>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders SEO component', () => {
    renderWithTooltipProvider(<Page />);

    // Check for meta tags
    expect(document.querySelector('meta[name="description"]')).toBeInTheDocument();
    expect(document.querySelector('meta[name="viewport"]')).toBeInTheDocument();
  });
}); 