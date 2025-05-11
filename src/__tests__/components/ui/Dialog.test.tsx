import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import userEvent from '@testing-library/user-event';

// Mock ResizeObserver which is used by Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Dialog', () => {
  beforeEach(() => {
    // Clear any existing dialogs
    document.body.innerHTML = '';
  });

  it('renders dialog trigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
      </Dialog>
    );
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('opens and closes dialog on trigger click', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    // Open dialog
    await userEvent.click(screen.getByText('Open Dialog'));
    
    await waitFor(() => {
      const dialog = document.body.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveTextContent('Test Title');
    });

    // Close dialog
    await userEvent.click(screen.getByText('Open Dialog'));
    
    await waitFor(() => {
      const dialog = document.body.querySelector('[role="dialog"]');
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('renders dialog with custom className', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent className="custom-dialog">
          <DialogHeader>
            <DialogTitle>Test Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await userEvent.click(screen.getByText('Open Dialog'));
    
    await waitFor(() => {
      const dialog = document.body.querySelector('[role="dialog"]');
      expect(dialog).toHaveClass('custom-dialog');
    });
  });

  it('renders dialog header with custom className', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader className="custom-header">
            <DialogTitle>Test Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await userEvent.click(screen.getByText('Open Dialog'));
    
    await waitFor(() => {
      const header = document.body.querySelector('[role="dialog"] .custom-header');
      expect(header).toBeInTheDocument();
    });
  });

  it('renders dialog title with custom className', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="custom-title">Test Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await userEvent.click(screen.getByText('Open Dialog'));
    
    await waitFor(() => {
      const title = document.body.querySelector('[role="dialog"] .custom-title');
      expect(title).toBeInTheDocument();
    });
  });

  it('renders dialog description with custom className', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogDescription className="custom-description">
            Test Description
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );

    await userEvent.click(screen.getByText('Open Dialog'));
    
    await waitFor(() => {
      const description = document.body.querySelector('[role="dialog"] .custom-description');
      expect(description).toBeInTheDocument();
    });
  });

  it('renders dialog footer with custom className', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogFooter className="custom-footer">
            <button>Footer Button</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await userEvent.click(screen.getByText('Open Dialog'));
    
    await waitFor(() => {
      const footer = document.body.querySelector('[role="dialog"] .custom-footer');
      expect(footer).toBeInTheDocument();
    });
  });

  it('closes dialog when clicking outside', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await userEvent.click(screen.getByText('Open Dialog'));
    
    await waitFor(() => {
      expect(document.body.querySelector('[role="dialog"]')).toBeInTheDocument();
    });

    // Click outside the dialog
    await userEvent.click(document.body);
    
    await waitFor(() => {
      expect(document.body.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });
  });

  it('closes dialog when pressing Escape key', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await userEvent.click(screen.getByText('Open Dialog'));
    
    await waitFor(() => {
      expect(document.body.querySelector('[role="dialog"]')).toBeInTheDocument();
    });

    await userEvent.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(document.body.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });
  });

  it('handles multiple dialogs', async () => {
    render(
      <>
        <Dialog>
          <DialogTrigger>Open First Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>First Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>Open Second Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Second Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    );

    // Open first dialog
    await userEvent.click(screen.getByText('Open First Dialog'));
    
    await waitFor(() => {
      const dialog = document.body.querySelector('[role="dialog"]');
      expect(dialog).toHaveTextContent('First Dialog');
    });

    // Open second dialog
    await userEvent.click(screen.getByText('Open Second Dialog'));
    
    await waitFor(() => {
      const dialog = document.body.querySelector('[role="dialog"]');
      expect(dialog).toHaveTextContent('Second Dialog');
    });
  });
}); 