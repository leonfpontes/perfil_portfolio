import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isOpen, onChange } from '../utils/devtools';

describe('devtools detection utility', () => {
  const originalOuterWidth = window.outerWidth;
  const originalInnerWidth = window.innerWidth;
  const originalOuterHeight = window.outerHeight;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore window dimensions
    Object.defineProperty(window, 'outerWidth', { value: originalOuterWidth, writable: true });
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, writable: true });
    Object.defineProperty(window, 'outerHeight', { value: originalOuterHeight, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, writable: true });
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should return false if DevTools is closed (dimension differences below threshold)', () => {
    Object.defineProperty(window, 'outerWidth', { value: 1000, writable: true });
    Object.defineProperty(window, 'innerWidth', { value: 950, writable: true }); // diff 50 < 160
    Object.defineProperty(window, 'outerHeight', { value: 800, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 750, writable: true }); // diff 50 < 160

    expect(isOpen()).toBe(false);
  });

  it('should return true if DevTools is open horizontally (width difference exceeds threshold)', () => {
    Object.defineProperty(window, 'outerWidth', { value: 1000, writable: true });
    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true }); // diff 200 > 160
    Object.defineProperty(window, 'outerHeight', { value: 800, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 750, writable: true });

    expect(isOpen()).toBe(true);
  });

  it('should return true if DevTools is open vertically (height difference exceeds threshold)', () => {
    Object.defineProperty(window, 'outerWidth', { value: 1000, writable: true });
    Object.defineProperty(window, 'innerWidth', { value: 950, writable: true });
    Object.defineProperty(window, 'outerHeight', { value: 800, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 600, writable: true }); // diff 200 > 160

    expect(isOpen()).toBe(true);
  });

  it('should trigger callback when devtools open state changes', () => {
    // Start with closed
    Object.defineProperty(window, 'outerWidth', { value: 1000, writable: true });
    Object.defineProperty(window, 'innerWidth', { value: 950, writable: true });
    Object.defineProperty(window, 'outerHeight', { value: 800, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 750, writable: true });

    const callback = vi.fn();
    const unsubscribe = onChange(callback);

    // Initial state is closed (false). No callback triggered yet.
    expect(callback).not.toHaveBeenCalled();

    // Mock opening devtools (width diff = 200)
    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });

    // Advance timer to trigger poll
    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledWith(true);
    expect(callback).toHaveBeenCalledTimes(1);

    // Mock closing devtools (width diff = 50)
    Object.defineProperty(window, 'innerWidth', { value: 950, writable: true });
    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledWith(false);
    expect(callback).toHaveBeenCalledTimes(2);

    unsubscribe();
  });
});
