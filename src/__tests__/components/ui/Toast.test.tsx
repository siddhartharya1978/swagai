import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

// Mock ResizeObserver which is used by Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <ToastProvider>
      {ui}
    </ToastProvider>
  );
};

describe('Toast', () => {
  beforeEach(() => {
    // Clear any existing toasts
    document.body.innerHTML = '';
  });

  it('renders toast with title and description', async () => {
    const { toast } = useToast();
    renderWithProvider(
      <button onClick={() => toast({ title: 'Title', description: 'Description' })}>
        Show Toast
      </button>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      const toastElement = document.body.querySelector('[role="status"]');
      expect(toastElement).toHaveTextContent('Title');
      expect(toastElement).toHaveTextContent('Description');
    });
  });

  it('renders toast with action', async () => {
    const handleAction = jest.fn();
    const { toast } = useToast();
    renderWithProvider(
      <button onClick={() => toast({ 
        title: 'Title',
        action: <ToastAction altText="Action" onClick={handleAction}>Action</ToastAction>
      })}>
        Show Toast
      </button>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      const actionButton = document.body.querySelector('[role="status"] button');
      expect(actionButton).toHaveTextContent('Action');
    });

    fireEvent.click(document.body.querySelector('[role="status"] button')!);
    expect(handleAction).toHaveBeenCalled();
  });

  it('renders toast with close button', async () => {
    const { toast } = useToast();
    renderWithProvider(
      <button onClick={() => toast({ title: 'Title' })}>
        Show Toast
      </button>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      const closeButton = document.body.querySelector('[role="status"] [toast-close]');
      expect(closeButton).toBeInTheDocument();
    });
  });

  it('renders toast with custom className', async () => {
    const { toast } = useToast();
    renderWithProvider(
      <button onClick={() => toast({ title: 'Title', className: 'custom-toast' })}>
        Show Toast
      </button>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      const toastElement = document.body.querySelector('[role="status"]');
      expect(toastElement).toHaveClass('custom-toast');
    });
  });

  it('renders toast title with custom className', async () => {
    const { toast } = useToast();
    renderWithProvider(
      <button onClick={() => toast({ 
        title: 'Title',
        className: 'custom-title'
      })}>
        Show Toast
      </button>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      const titleElement = document.body.querySelector('[role="status"] [class*="custom-title"]');
      expect(titleElement).toBeInTheDocument();
    });
  });

  it('renders toast description with custom className', async () => {
    const { toast } = useToast();
    renderWithProvider(
      <button onClick={() => toast({ 
        description: 'Description',
        className: 'custom-description'
      })}>
        Show Toast
      </button>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      const descriptionElement = document.body.querySelector('[role="status"] [class*="custom-description"]');
      expect(descriptionElement).toBeInTheDocument();
    });
  });

  it('renders toast action with custom className', async () => {
    const { toast } = useToast();
    renderWithProvider(
      <button onClick={() => toast({ 
        title: 'Title',
        action: <ToastAction altText="Action" className="custom-action">Action</ToastAction>
      })}>
        Show Toast
      </button>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      const actionButton = document.body.querySelector('[role="status"] [class*="custom-action"]');
      expect(actionButton).toBeInTheDocument();
    });
  });

  it('renders toast viewport with custom className', () => {
    renderWithProvider(
      <ToastViewport className="custom-viewport" />
    );

    expect(document.body.querySelector('[role="region"]')).toHaveClass('custom-viewport');
  });

  it('can be dismissed', async () => {
    const { toast } = useToast();
    renderWithProvider(
      <button onClick={() => toast({ title: 'Test Toast' })}>Show Toast</button>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      expect(document.body.querySelector('[role="status"]')).toBeInTheDocument();
    });

    const closeButton = document.body.querySelector('[role="status"] [toast-close]');
    fireEvent.click(closeButton!);
    
    await waitFor(() => {
      expect(document.body.querySelector('[role="status"]')).not.toBeInTheDocument();
    });
  });

  it('can be dismissed programmatically', async () => {
    const { toast, dismiss } = useToast();
    renderWithProvider(
      <button onClick={() => toast({ title: 'Test Toast' })}>Show Toast</button>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      expect(document.body.querySelector('[role="status"]')).toBeInTheDocument();
    });

    dismiss();
    
    await waitFor(() => {
      expect(document.body.querySelector('[role="status"]')).not.toBeInTheDocument();
    });
  });

  it('can be updated', async () => {
    const { toast } = useToast();
    renderWithProvider(
      <button onClick={() => toast({ title: 'Initial Title' })}>Show Toast</button>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      expect(document.body.querySelector('[role="status"]')).toHaveTextContent('Initial Title');
    });

    const { id, update } = toast({ title: 'Updated Title' });
    update({ id, title: 'Final Title' });
    
    await waitFor(() => {
      expect(document.body.querySelector('[role="status"]')).toHaveTextContent('Final Title');
    });
  });

  it('respects toast limit', async () => {
    const { toast } = useToast();
    renderWithProvider(
      <>
        <button onClick={() => toast({ title: 'Toast 1' })}>Show Toast 1</button>
        <button onClick={() => toast({ title: 'Toast 2' })}>Show Toast 2</button>
      </>
    );

    fireEvent.click(screen.getByText('Show Toast 1'));
    fireEvent.click(screen.getByText('Show Toast 2'));
    
    await waitFor(() => {
      const toasts = document.body.querySelectorAll('[role="status"]');
      expect(toasts).toHaveLength(1);
      expect(toasts[0]).toHaveTextContent('Toast 2');
    });
  });
}); 