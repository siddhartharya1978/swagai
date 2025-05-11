import { render, screen, fireEvent } from '@testing-library/react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

describe('Toaster', () => {
  it('renders toaster', () => {
    render(<Toaster />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('shows toast when toast function is called', () => {
    const { toast } = useToast();
    render(
      <>
        <Toaster />
        <button onClick={() => toast({ title: 'Test Toast' })}>Show Toast</button>
      </>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test Toast')).toBeInTheDocument();
  });

  it('shows toast with description', () => {
    const { toast } = useToast();
    render(
      <>
        <Toaster />
        <button onClick={() => toast({ title: 'Test Toast', description: 'Test Description' })}>
          Show Toast
        </button>
      </>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('shows toast with action', () => {
    const handleAction = jest.fn();
    const { toast } = useToast();
    render(
      <>
        <Toaster />
        <button
          onClick={() =>
            toast({
              title: 'Test Toast',
              action: <button onClick={handleAction}>Action</button>,
            })
          }
        >
          Show Toast
        </button>
      </>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    const actionButton = screen.getByText('Action');
    expect(actionButton).toBeInTheDocument();
    fireEvent.click(actionButton);
    expect(handleAction).toHaveBeenCalled();
  });

  it('dismisses toast when close button is clicked', () => {
    const { toast } = useToast();
    render(
      <>
        <Toaster />
        <button onClick={() => toast({ title: 'Test Toast' })}>Show Toast</button>
      </>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test Toast')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
  });

  it('dismisses toast after duration', () => {
    jest.useFakeTimers();
    const { toast } = useToast();
    render(
      <>
        <Toaster />
        <button onClick={() => toast({ title: 'Test Toast', duration: 3000 })}>Show Toast</button>
      </>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test Toast')).toBeInTheDocument();

    jest.advanceTimersByTime(3000);
    expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('can have a custom duration', () => {
    jest.useFakeTimers();
    const { toast } = useToast();
    render(
      <>
        <Toaster />
        <button onClick={() => toast({ title: 'Test Toast', duration: 5000 })}>Show Toast</button>
      </>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test Toast')).toBeInTheDocument();

    jest.advanceTimersByTime(3000);
    expect(screen.getByText('Test Toast')).toBeInTheDocument();

    jest.advanceTimersByTime(2000);
    expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('can have a custom variant', () => {
    const { toast } = useToast();
    render(
      <>
        <Toaster />
        <button onClick={() => toast({ title: 'Test Toast', variant: 'destructive' })}>
          Show Toast
        </button>
      </>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    const toastElement = screen.getByText('Test Toast').parentElement;
    expect(toastElement).toHaveClass('destructive');
  });
}); 