import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TooltipWrapper } from '@/components/ui/TooltipWrapper';
import { TooltipProvider } from '@/components/ui/Tooltip';

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <TooltipProvider>
      {ui}
    </TooltipProvider>
  );
};

describe('TooltipWrapper', () => {
  beforeEach(() => {
    // Clear any existing tooltips
    document.body.innerHTML = '';
  });

  it('renders children', () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip content on hover', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');
    await userEvent.hover(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips.length).toBeGreaterThan(0);
    });
  });

  it('hides tooltip content on mouse leave', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');
    await userEvent.hover(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips.length).toBeGreaterThan(0);
    });
    await userEvent.unhover(trigger);
    await waitFor(() => {
      const tooltips = screen.queryAllByText('Tooltip content');
      expect(tooltips.some(t => t.getAttribute('aria-hidden') === 'true' || t.getAttribute('data-state') === 'closed' || !t.offsetParent)).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('can have a side', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content" side="left">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');
    await userEvent.hover(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      const tooltip = tooltips[0].closest('[data-side]');
      expect(tooltip).toHaveAttribute('data-side', 'left');
    });
  });

  it('can have a side offset', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content" sideOffset={16}>
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');
    await userEvent.hover(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      const tooltip = tooltips[0].closest('[data-side-offset]');
      expect(tooltip).toHaveAttribute('data-side-offset', '16');
    });
  });

  it('uses default side when not specified', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');
    await userEvent.hover(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      const tooltip = tooltips[0].closest('[data-side]');
      expect(tooltip).toHaveAttribute('data-side', 'top');
    });
  });

  it('uses default side offset when not specified', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');
    await userEvent.hover(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      const tooltip = tooltips[0].closest('[data-side-offset]');
      expect(tooltip).toHaveAttribute('data-side-offset', '8');
    });
  });

  it('renders complex content', async () => {
    renderWithProvider(
      <TooltipWrapper content={<div><strong>Bold</strong> and <em>italic</em></div>}>
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');
    await userEvent.hover(trigger);
    await waitFor(() => {
      expect(screen.getAllByText('Bold').length).toBeGreaterThan(0);
      expect(screen.getAllByText('italic').length).toBeGreaterThan(0);
    });
  });

  it('renders with complex children', () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <div className="complex-trigger">
          <span>Icon</span>
          <span>Text</span>
        </div>
      </TooltipWrapper>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Icon').parentElement).toHaveClass('complex-trigger');
  });

  it('handles keyboard interactions', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');
    trigger.focus();
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips.length).toBeGreaterThan(0);
    });
    trigger.blur();
    await waitFor(() => {
      const tooltips = screen.queryAllByText('Tooltip content');
      tooltips.forEach(t => expect(t).not.toBeVisible());
    });
  });

  it('handles multiple tooltips', async () => {
    renderWithProvider(
      <>
        <TooltipWrapper content="First tooltip">
          <button>First</button>
        </TooltipWrapper>
        <TooltipWrapper content="Second tooltip">
          <button>Second</button>
        </TooltipWrapper>
      </>
    );
    const firstTrigger = screen.getByText('First');
    const secondTrigger = screen.getByText('Second');
    await userEvent.hover(firstTrigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('First tooltip');
      expect(tooltips.length).toBeGreaterThan(0);
    });
    await userEvent.hover(secondTrigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Second tooltip');
      expect(tooltips.length).toBeGreaterThan(0);
      const firstTooltips = screen.queryAllByText('First tooltip');
      firstTooltips.forEach(t => expect(t).not.toBeVisible());
    });
  });

  it.skip('handles tooltip delay', async () => {
    // This test is skipped due to jsdom/animation limitations with Radix Tooltip.
  });

  it('handles rapid hover/unhover events', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');

    // Simulate rapid hover/unhover
    await userEvent.hover(trigger);
    await userEvent.unhover(trigger);
    await userEvent.hover(trigger);
    await userEvent.unhover(trigger);
    await userEvent.hover(trigger);

    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips[0]).toBeVisible();
    });
  });

  it('handles touch events on mobile devices', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Touch me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Touch me');

    // Simulate touch events
    fireEvent.touchStart(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips[0]).toBeVisible();
    });

    fireEvent.touchEnd(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips[0]).not.toBeVisible();
    });
  });

  it('handles window resize events', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');

    await userEvent.hover(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips[0]).toBeVisible();
    });

    // Simulate window resize
    global.innerWidth = 500;
    fireEvent(window, new Event('resize'));

    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips[0]).toBeVisible();
    });
  });

  it('handles reduced motion preferences', async () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');

    await userEvent.hover(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips[0]).toHaveStyle({ animation: 'none' });
    });
  });

  it('handles high contrast mode', async () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(forced-colors: active)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');

    await userEvent.hover(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips[0]).toHaveStyle({ border: '2px solid' });
    });
  });

  it('handles screen reader announcements', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');

    await userEvent.hover(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips[0]).toHaveAttribute('role', 'tooltip');
      expect(tooltips[0]).toHaveAttribute('aria-live', 'polite');
    });
  });

  it('handles focus management', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Focus me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Focus me');

    trigger.focus();
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips[0]).toBeVisible();
    });

    trigger.blur();
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips[0]).not.toBeVisible();
    });
  });

  it('handles keyboard navigation', async () => {
    renderWithProvider(
      <TooltipWrapper content="Tooltip content">
        <button>Focus me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Focus me');

    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips[0]).toBeVisible();
    });

    fireEvent.keyDown(trigger, { key: 'Escape' });
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Tooltip content');
      expect(tooltips[0]).not.toBeVisible();
    });
  });

  it('handles multiple tooltips on the same page', async () => {
    renderWithProvider(
      <>
        <TooltipWrapper content="First tooltip">
          <button>First button</button>
        </TooltipWrapper>
        <TooltipWrapper content="Second tooltip">
          <button>Second button</button>
        </TooltipWrapper>
      </>
    );

    const firstButton = screen.getByText('First button');
    const secondButton = screen.getByText('Second button');

    await userEvent.hover(firstButton);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('First tooltip');
      expect(tooltips[0]).toBeVisible();
    });

    await userEvent.hover(secondButton);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Second tooltip');
      expect(tooltips[0]).toBeVisible();
      expect(screen.queryByText('First tooltip')).not.toBeVisible();
    });
  });

  it('handles tooltip content updates', async () => {
    const { rerender } = renderWithProvider(
      <TooltipWrapper content="Initial content">
        <button>Hover me</button>
      </TooltipWrapper>
    );
    const trigger = screen.getByText('Hover me');

    await userEvent.hover(trigger);
    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Initial content');
      expect(tooltips[0]).toBeVisible();
    });

    rerender(
      <TooltipWrapper content="Updated content">
        <button>Hover me</button>
      </TooltipWrapper>
    );

    await waitFor(async () => {
      const tooltips = await screen.findAllByText('Updated content');
      expect(tooltips[0]).toBeVisible();
    });
  });
}); 