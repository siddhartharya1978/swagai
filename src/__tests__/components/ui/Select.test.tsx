import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

// Mock ResizeObserver which is used by Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Select', () => {
  beforeEach(() => {
    // Clear any existing selects
    document.body.innerHTML = '';
  });

  it('renders select trigger', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </Select>
    );
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('opens select content when trigger is clicked', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    fireEvent.click(screen.getByText('Select an option'));
    
    await waitFor(() => {
      const content = document.body.querySelector('[role="listbox"]');
      expect(content).toHaveTextContent('Option 1');
      expect(content).toHaveTextContent('Option 2');
    });
  });

  it('selects an option when clicked', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    // Open select
    fireEvent.click(screen.getByText('Select an option'));
    
    await waitFor(() => {
      const content = document.body.querySelector('[role="listbox"]');
      expect(content).toBeInTheDocument();
    });
    
    // Select option
    fireEvent.click(screen.getByText('Option 1'));
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      const content = document.body.querySelector('[role="listbox"]');
      expect(content).not.toBeInTheDocument();
    });
  });

  it('renders select with custom className', () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </Select>
    );
    expect(screen.getByText('Select an option').parentElement).toHaveClass('custom-trigger');
  });

  it('renders select content with custom className', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="custom-content">
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    fireEvent.click(screen.getByText('Select an option'));
    
    await waitFor(() => {
      const content = document.body.querySelector('[role="listbox"]');
      expect(content).toHaveClass('custom-content');
    });
  });

  it('renders select item with custom className', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" className="custom-item">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    fireEvent.click(screen.getByText('Select an option'));
    
    await waitFor(() => {
      const content = document.body.querySelector('[role="listbox"]');
      expect(content?.querySelector('.custom-item')).toBeInTheDocument();
    });
  });

  it('can be disabled', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </Select>
    );
    expect(screen.getByText('Select an option').parentElement).toBeDisabled();
  });

  it('can have a default value', () => {
    render(
      <Select defaultValue="option1">
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('can be required', () => {
    render(
      <Select required>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </Select>
    );
    expect(screen.getByText('Select an option').parentElement).toBeRequired();
  });

  it('can have a name attribute', () => {
    render(
      <Select name="test-select">
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </Select>
    );
    expect(screen.getByText('Select an option').parentElement).toHaveAttribute('name', 'test-select');
  });

  it('handles keyboard navigation', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByText('Select an option');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      const content = document.body.querySelector('[role="listbox"]');
      expect(content).toBeInTheDocument();
    });

    // Focus first item
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const firstItem = screen.getByText('Option 1');
    expect(document.activeElement).toBe(firstItem);

    // Navigate to second item
    fireEvent.keyDown(firstItem, { key: 'ArrowDown' });
    const secondItem = screen.getByText('Option 2');
    expect(document.activeElement).toBe(secondItem);

    // Navigate to last item
    fireEvent.keyDown(secondItem, { key: 'ArrowDown' });
    const lastItem = screen.getByText('Option 3');
    expect(document.activeElement).toBe(lastItem);

    // Select item with Enter
    fireEvent.keyDown(lastItem, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText('Option 3')).toBeInTheDocument();
      const content = document.body.querySelector('[role="listbox"]');
      expect(content).not.toBeInTheDocument();
    });
  });

  it('closes on Escape key', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    fireEvent.click(screen.getByText('Select an option'));
    
    await waitFor(() => {
      const content = document.body.querySelector('[role="listbox"]');
      expect(content).toBeInTheDocument();
    });

    fireEvent.keyDown(document.body, { key: 'Escape' });
    
    await waitFor(() => {
      const content = document.body.querySelector('[role="listbox"]');
      expect(content).not.toBeInTheDocument();
    });
  });
}); 