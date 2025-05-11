import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

describe('useMediaQuery', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('returns false when media query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('returns true when media query matches', () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('updates when media query changes', () => {
    let matches = false;
    let changeCallback: ((event: MediaQueryListEvent) => void) | null = null;

    const mockMatchMedia = jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn((event, callback) => {
        if (event === 'change') {
          changeCallback = callback;
        }
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    window.matchMedia = mockMatchMedia;

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    matches = true;
    act(() => {
      if (changeCallback) {
        changeCallback({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });

  it('handles multiple media queries', () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(min-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result: result1 } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    const { result: result2 } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

    expect(result1.current).toBe(true);
    expect(result2.current).toBe(false);
  });

  it('handles invalid media query', () => {
    const { result } = renderHook(() => useMediaQuery('invalid query'));
    expect(result.current).toBe(false);
  });

  it('handles undefined media query', () => {
    const { result } = renderHook(() => useMediaQuery(undefined));
    expect(result.current).toBe(false);
  });
}); 