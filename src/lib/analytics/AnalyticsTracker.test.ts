import { describe, expect, it, vi } from 'vitest';
import { createAnalyticsTracker, GtagTracker, NoopTracker } from './AnalyticsTracker';

describe('AnalyticsTracker', () => {
  it('usa GtagTracker quando window.gtag existe', () => {
    const gtag = vi.fn();
    const tracker = createAnalyticsTracker({ gtag } as unknown as Window);
    expect(tracker).toBeInstanceOf(GtagTracker);
    tracker.track('cta_click', { label: 'hero' });
    expect(gtag).toHaveBeenCalledWith('event', 'cta_click', { label: 'hero' });
  });

  it('cai para NoopTracker quando gtag não está disponível', () => {
    expect(createAnalyticsTracker({} as Window)).toBeInstanceOf(NoopTracker);
    expect(createAnalyticsTracker(undefined)).toBeInstanceOf(NoopTracker);
  });

  it('nunca propaga erros do gtag', () => {
    const tracker = new GtagTracker(() => {
      throw new Error('bloqueado');
    });
    expect(() => tracker.track('nav_click')).not.toThrow();
  });
});
