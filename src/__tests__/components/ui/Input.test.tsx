import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('renders input with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex h-9 w-full rounded-md border');
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test value');
  });

  it('can be disabled', () => {
    render(<Input disabled placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed disabled:opacity-50');
  });

  it('can be read-only', () => {
    render(<Input readOnly placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    
    expect(input).toHaveAttribute('readonly');
  });

  it('accepts different types', () => {
    const { rerender } = render(<Input type="text" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveAttribute('type', 'text');

    rerender(<Input type="password" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveAttribute('type', 'password');

    rerender(<Input type="email" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveAttribute('type', 'email');

    rerender(<Input type="number" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveAttribute('type', 'number');
  });

  it('can have a default value', () => {
    render(<Input defaultValue="default" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveValue('default');
  });

  it('can be required', () => {
    render(<Input required placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeRequired();
  });

  it('can have a name attribute', () => {
    render(<Input name="test-input" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveAttribute('name', 'test-input');
  });

  it('can have an id attribute', () => {
    render(<Input id="test-input" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveAttribute('id', 'test-input');
  });
}); 