import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, ErrorBoundaryForTesting } from '@/components/ErrorBoundary';

// Mock console.error to prevent test output pollution
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary', () => {
  const ThrowError = ({ message = 'Test error' }: { message?: string }) => {
    throw new Error(message);
  };

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('renders default error message when error has no message', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="" />
      </ErrorBoundary>
    );

    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  it('resets error state and reloads page when try again is clicked', () => {
    const reload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(reload).toHaveBeenCalled();
  });

  it('handles multiple errors in sequence', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <div>Initial content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Initial content')).toBeInTheDocument();

    // First error
    rerender(
      <ErrorBoundary>
        <ThrowError message="First error" />
      </ErrorBoundary>
    );

    expect(screen.getByText('First error')).toBeInTheDocument();

    // Reset error state
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    // Second error
    rerender(
      <ErrorBoundary>
        <ThrowError message="Second error" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Second error')).toBeInTheDocument();
  });

  it('handles errors in deeply nested components', () => {
    const NestedComponent = () => (
      <div>
        <div>
          <div>
            <ThrowError message="Nested error" />
          </div>
        </div>
      </div>
    );

    render(
      <ErrorBoundary>
        <NestedComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Nested error')).toBeInTheDocument();
  });

  it('preserves error state across re-renders', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError message="Persistent error" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Persistent error')).toBeInTheDocument();

    // Re-render with same error
    rerender(
      <ErrorBoundary>
        <ThrowError message="Persistent error" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Persistent error')).toBeInTheDocument();
  });

  it('handles errors in async components', async () => {
    const AsyncErrorComponent = () => {
      React.useEffect(() => {
        throw new Error('Async error');
      }, []);
      return <div>Async content</div>;
    };

    render(
      <ErrorBoundary>
        <AsyncErrorComponent />
      </ErrorBoundary>
    );

    // Wait for error to be caught
    await screen.findByText('Async error');
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('handles errors with custom error reporting', () => {
    const customErrorReporting = jest.fn();
    const originalConsoleError = console.error;
    console.error = customErrorReporting;

    render(
      <ErrorBoundary>
        <ThrowError message="Reported error" />
      </ErrorBoundary>
    );

    expect(customErrorReporting).toHaveBeenCalled();
    console.error = originalConsoleError;
  });

  it('maintains error boundary state across parent re-renders', () => {
    const Parent = ({ showError }: { showError: boolean }) => (
      <ErrorBoundary>
        {showError ? <ThrowError message="Parent error" /> : <div>Safe content</div>}
      </ErrorBoundary>
    );

    const { rerender } = render(<Parent showError={false} />);
    expect(screen.getByText('Safe content')).toBeInTheDocument();

    rerender(<Parent showError={true} />);
    expect(screen.getByText('Parent error')).toBeInTheDocument();

    rerender(<Parent showError={false} />);
    expect(screen.getByText('Parent error')).toBeInTheDocument();
  });
}); 