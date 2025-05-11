import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/components/ui/use-toast';

describe('useToast', () => {
  it('returns toast function', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toast).toBeDefined();
  });

  it('returns dismiss function', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.dismiss).toBeDefined();
  });

  it('returns toasts array', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toBeDefined();
    expect(Array.isArray(result.current.toasts)).toBe(true);
  });

  it('adds toast to toasts array', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.toast({ title: 'Test Toast' });
    });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
  });

  it('adds toast with description', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.toast({ title: 'Test Toast', description: 'Test Description' });
    });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].description).toBe('Test Description');
  });

  it('adds toast with action', () => {
    const { result } = renderHook(() => useToast());
    const action = <button>Action</button>;
    act(() => {
      result.current.toast({ title: 'Test Toast', action });
    });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].action).toBe(action);
  });

  it('adds toast with variant', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.toast({ title: 'Test Toast', variant: 'destructive' });
    });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].variant).toBe('destructive');
  });

  it('dismisses toast', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.toast({ title: 'Test Toast' });
    });
    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(result.current.toasts[0].id);
    });
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('dismisses all toasts', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.toast({ title: 'Test Toast 1' });
      result.current.toast({ title: 'Test Toast 2' });
    });
    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss();
    });
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('limits toasts to one', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.toast({ title: 'Test Toast 1' });
      result.current.toast({ title: 'Test Toast 2' });
    });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Toast 2');
  });

  it('updates toast', () => {
    const { result } = renderHook(() => useToast());
    let toastId: string;
    act(() => {
      const { id } = result.current.toast({ title: 'Test Toast' });
      toastId = id;
    });
    expect(result.current.toasts[0].title).toBe('Test Toast');

    act(() => {
      result.current.toast({ id: toastId, title: 'Updated Toast' });
    });
    expect(result.current.toasts[0].title).toBe('Updated Toast');
  });
}); 