import { render, screen } from '@testing-library/react';
import ClientLayout from '@/components/ClientLayout';

// Mock the AuthProvider to avoid auth-related issues
jest.mock('@/components/auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ClientLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    render(
      <ClientLayout>
        <div>Test content</div>
      </ClientLayout>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with default layout structure', () => {
    render(
      <ClientLayout>
        <div>Test content</div>
      </ClientLayout>
    );

    expect(screen.getByRole('button', { name: /help/i })).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <ClientLayout>
        <div>Child 1</div>
        <div>Child 2</div>
      </ClientLayout>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('renders help button', () => {
    render(
      <ClientLayout>
        <div>Test content</div>
      </ClientLayout>
    );

    const helpButton = screen.getByRole('button', { name: /help/i });
    expect(helpButton).toBeInTheDocument();
    expect(helpButton).toHaveClass('bg-purple-500');
  });

  it('renders welcome modal when showWelcome is true', () => {
    localStorageMock.getItem.mockReturnValue('false');
    
    render(
      <ClientLayout>
        <div>Test content</div>
      </ClientLayout>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
}); 