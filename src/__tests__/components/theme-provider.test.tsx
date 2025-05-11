import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <div>Test content</div>
      </ThemeProvider>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies default theme class to document', () => {
    render(
      <ThemeProvider>
        <div>Test content</div>
      </ThemeProvider>
    );

    expect(document.documentElement).toHaveClass('light');
  });

  it('applies custom theme class to document', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <div>Test content</div>
      </ThemeProvider>
    );

    expect(document.documentElement).toHaveClass('dark');
  });

  it('preserves theme class on re-render', () => {
    const { rerender } = render(
      <ThemeProvider defaultTheme="dark">
        <div>Test content</div>
      </ThemeProvider>
    );

    expect(document.documentElement).toHaveClass('dark');

    rerender(
      <ThemeProvider defaultTheme="dark">
        <div>New content</div>
      </ThemeProvider>
    );

    expect(document.documentElement).toHaveClass('dark');
  });
}); 