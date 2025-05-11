import { render, screen, waitFor } from '@testing-library/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import userEvent from '@testing-library/user-event';

// Mock ResizeObserver which is used by Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('DropdownMenu', () => {
  beforeEach(() => {
    // Clear any existing dropdowns
    document.body.innerHTML = '';
  });

  it('renders dropdown trigger', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
      </DropdownMenu>
    );
    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  it('shows dropdown content when trigger is clicked', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await userEvent.click(screen.getByText('Open Menu'));
    
    await waitFor(() => {
      const menu = document.body.querySelector('[role="menu"]');
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveTextContent('Item 1');
    });
  });

  it('hides dropdown content when clicking outside', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await userEvent.click(screen.getByText('Open Menu'));
    
    await waitFor(() => {
      const menu = document.body.querySelector('[role="menu"]');
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveTextContent('Item 1');
    });

    await userEvent.click(document.body);
    
    await waitFor(() => {
      const menu = document.body.querySelector('[role="menu"]');
      expect(menu).not.toBeInTheDocument();
    });
  });

  it('renders dropdown menu items', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await userEvent.click(screen.getByText('Open Menu'));
    
    await waitFor(() => {
      const menu = document.body.querySelector('[role="menu"]');
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveTextContent('Item 1');
      expect(menu).toHaveTextContent('Item 2');
    });
  });

  it('renders dropdown menu with custom className', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-content">
          <DropdownMenuItem className="custom-item">Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await userEvent.click(screen.getByText('Open Menu'));
    
    await waitFor(() => {
      const menu = document.body.querySelector('[role="menu"]');
      expect(menu).toHaveClass('custom-content');
      expect(menu?.querySelector('.custom-item')).toBeInTheDocument();
    });
  });

  it('can be disabled', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger disabled>Open Menu</DropdownMenuTrigger>
      </DropdownMenu>
    );
    expect(screen.getByText('Open Menu')).toBeDisabled();
  });

  it('handles keyboard navigation', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
          <DropdownMenuItem>Item 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText('Open Menu');
    await userEvent.click(trigger);
    
    await waitFor(() => {
      const menu = document.body.querySelector('[role="menu"]');
      expect(menu).toBeInTheDocument();
    });

    // Focus first item
    await userEvent.keyboard('{ArrowDown}');
    const firstItem = screen.getByText('Item 1');
    expect(firstItem).toHaveAttribute('data-state', 'active');

    // Navigate to second item
    await userEvent.keyboard('{ArrowDown}');
    const secondItem = screen.getByText('Item 2');
    expect(secondItem).toHaveAttribute('data-state', 'active');

    // Navigate to last item
    await userEvent.keyboard('{ArrowDown}');
    const lastItem = screen.getByText('Item 3');
    expect(lastItem).toHaveAttribute('data-state', 'active');

    // Select item with Enter
    await userEvent.keyboard('{Enter}');
    
    await waitFor(() => {
      const menu = document.body.querySelector('[role="menu"]');
      expect(menu).not.toBeInTheDocument();
    });
  });

  it('handles menu item click', async () => {
    const handleClick = jest.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleClick}>Click Me</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await userEvent.click(screen.getByText('Open Menu'));
    
    await waitFor(() => {
      const menu = document.body.querySelector('[role="menu"]');
      expect(menu).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalled();
    
    await waitFor(() => {
      const menu = document.body.querySelector('[role="menu"]');
      expect(menu).not.toBeInTheDocument();
    });
  });
}); 