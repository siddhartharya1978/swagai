import { render, screen, fireEvent } from '@testing-library/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

describe('Tooltip', () => {
  it('renders tooltip trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip content on hover', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
  });

  it('hides tooltip content on mouse leave', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByText('Hover me'));
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  it('renders tooltip trigger with custom className', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="custom-trigger">Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Hover me')).toHaveClass('custom-trigger');
  });

  it('renders tooltip content with custom className', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent className="custom-content">Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByText('Tooltip content')).toHaveClass('custom-content');
  });

  it('can be disabled', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger disabled>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Hover me')).toBeDisabled();
  });

  it('can have a delay duration', () => {
    jest.useFakeTimers();
    render(
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();

    jest.advanceTimersByTime(500);
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('can have a skip delay duration', () => {
    jest.useFakeTimers();
    render(
      <TooltipProvider skipDelayDuration={500}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByText('Hover me'));
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();

    jest.useRealTimers();
  });
}); 