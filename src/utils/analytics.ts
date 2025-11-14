/**
 * Lightweight analytics helper around gtag if present.
 */
type Gtag = (command: 'event' | 'config' | 'js', actionOrDate: any, params?: Record<string, any>) => void;

function getGtag(): Gtag | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = (window as any).gtag as Gtag | undefined;
  return typeof g === 'function' ? g : null;
}

export function trackEvent(
  action: string,
  params?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: unknown;
  }
): void {
  const gtag = getGtag();
  if (!gtag) return;
  const { category, label, value, ...rest } = params || {};
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
}

export function bindCtaTracking(): void {
  const map: Array<{ selector: string; action: string; label: string }> = [
    { selector: '.button--email', action: 'click_cta', label: 'email' },
    { selector: '.button--whatsapp', action: 'click_cta', label: 'whatsapp' },
    { selector: '.button--linkedin', action: 'click_cta', label: 'linkedin' },
  ];
  map.forEach(({ selector, action, label }) => {
    document.querySelectorAll<HTMLAnchorElement>(selector).forEach((el) => {
      el.addEventListener('click', () => trackEvent(action, { category: 'contact', label }));
    });
  });
}

export function bindNavTracking(): void {
  document.querySelectorAll<HTMLAnchorElement>('a.side-nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href') || '';
      trackEvent('nav_click', { category: 'navigation', label: href });
    });
  });
}

export function bindLanguageTracking(): void {
  document.addEventListener('languagechange', (e: Event) => {
    // i18n dispatches CustomEvent with detail.lang, but fallback defensively
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detail = (e as any)?.detail;
    const lang = detail?.lang || document.documentElement.getAttribute('data-language') || 'unknown';
    trackEvent('language_change', { category: 'i18n', label: String(lang) });
  });
}

export function initAnalyticsBindings(): void {
  bindCtaTracking();
  bindNavTracking();
  bindLanguageTracking();
}
