import { render, screen, fireEvent } from '@testing-library/react';
import { WelcomeModal } from '@/components/WelcomeModal';

describe('WelcomeModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders welcome modal with title and description', () => {
    render(<WelcomeModal show={true} onClose={mockOnClose} />);

    expect(screen.getByText(/welcome to swag ai/i)).toBeInTheDocument();
    expect(screen.getByText(/let's get started/i)).toBeInTheDocument();
  });

  it('renders get started button', () => {
    render(<WelcomeModal show={true} onClose={mockOnClose} />);

    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    expect(getStartedButton).toBeInTheDocument();
  });

  it('calls onClose when get started button is clicked', () => {
    render(<WelcomeModal show={true} onClose={mockOnClose} />);

    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(getStartedButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when show is false', () => {
    render(<WelcomeModal show={false} onClose={mockOnClose} />);

    expect(screen.queryByText(/welcome to swag ai/i)).not.toBeInTheDocument();
  });

  it('renders quick start guide', () => {
    render(<WelcomeModal show={true} onClose={mockOnClose} />);

    expect(screen.getByText(/quick start guide/i)).toBeInTheDocument();
    expect(screen.getByText(/upload your clothes/i)).toBeInTheDocument();
    expect(screen.getByText(/get ai-powered outfit suggestions/i)).toBeInTheDocument();
    expect(screen.getByText(/save your favorite looks/i)).toBeInTheDocument();
    expect(screen.getByText(/get personalized style recommendations/i)).toBeInTheDocument();
  });
}); 