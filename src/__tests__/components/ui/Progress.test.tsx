import { render, screen } from '@testing-library/react';
import { Progress } from '@/components/ui/progress';

describe('Progress', () => {
  it('renders progress bar', () => {
    render(<Progress value={50} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('renders with correct value', () => {
    render(<Progress value={75} />);
    const indicator = screen.getByRole('progressbar').querySelector('[class*="Indicator"]');
    expect(indicator).toHaveStyle({ transform: 'translateX(-25%)' });
  });

  it('renders with custom className', () => {
    render(<Progress value={50} className="custom-progress" />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('custom-progress');
  });

  it('handles negative values', () => {
    render(<Progress value={-10} />);
    const indicator = screen.getByRole('progressbar').querySelector('[class*="Indicator"]');
    expect(indicator).toHaveStyle({ transform: 'translateX(-110%)' });
  });

  it('handles undefined value', () => {
    render(<Progress />);
    const indicator = screen.getByRole('progressbar').querySelector('[class*="Indicator"]');
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' });
  });
}); 