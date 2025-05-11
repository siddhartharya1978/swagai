import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import userEvent from '@testing-library/user-event';

// Mock ResizeObserver which is used by Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Tabs', () => {
  beforeEach(() => {
    // Clear any existing tabs
    document.body.innerHTML = '';
  });

  it('renders tabs list and triggers', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('switches content when tab is clicked', async () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    await userEvent.click(screen.getByText('Tab 2'));
    
    await waitFor(() => {
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });
  });

  it('renders tabs list with custom className', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList className="custom-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Tab 1').parentElement).toHaveClass('custom-list');
  });

  it('renders tab trigger with custom className', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" className="custom-trigger">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Tab 1')).toHaveClass('custom-trigger');
  });

  it('renders tab content with custom className', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content">Content 1</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Content 1')).toHaveClass('custom-content');
  });

  it('can be disabled', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Tab 2')).toBeDisabled();
  });

  it('can have a default value', () => {
    render(
      <Tabs defaultValue="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('can be controlled', async () => {
    const onValueChange = jest.fn();
    render(
      <Tabs value="tab1" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    await userEvent.click(screen.getByText('Tab 2'));
    
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith('tab2');
    });
  });

  it('handles keyboard navigation', async () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    );

    const firstTab = screen.getByText('Tab 1');
    firstTab.focus();

    // Navigate to next tab
    await userEvent.keyboard('{ArrowRight}');
    const secondTab = screen.getByText('Tab 2');
    expect(secondTab).toHaveAttribute('data-state', 'active');

    // Navigate to last tab
    await userEvent.keyboard('{ArrowRight}');
    const lastTab = screen.getByText('Tab 3');
    expect(lastTab).toHaveAttribute('data-state', 'active');

    // Navigate back to first tab
    await userEvent.keyboard('{ArrowLeft}');
    expect(secondTab).toHaveAttribute('data-state', 'active');

    // Select tab with Enter
    await userEvent.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
    });
  });

  it('handles focus management', async () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    const firstTab = screen.getByText('Tab 1');
    firstTab.focus();

    // Tab key should move focus to content
    await userEvent.tab();
    const content = screen.getByText('Content 1');
    expect(content).toHaveAttribute('tabIndex', '0');

    // Shift+Tab should move focus back to tab
    await userEvent.tab({ shift: true });
    expect(firstTab).toHaveAttribute('tabIndex', '0');
  });
}); 