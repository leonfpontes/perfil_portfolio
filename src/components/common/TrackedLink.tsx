import type { AnchorHTMLAttributes } from 'react';
import type { AnalyticsEvent } from '@/lib/analytics/AnalyticsTracker';
import { useServices } from '@/lib/services';

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Rótulo enviado ao analytics (ex.: "hero_whatsapp"). */
  trackLabel: string;
  trackEvent?: AnalyticsEvent;
}

/**
 * Âncora que registra o clique no analytics. Links externos abrem em nova aba
 * com `rel="noopener noreferrer"` automaticamente.
 */
export function TrackedLink({ trackLabel, trackEvent = 'cta_click', onClick, href, ...props }: TrackedLinkProps) {
  const { analytics } = useServices();
  const isExternal = !!href && /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
      onClick={(event) => {
        analytics.track(trackEvent, { label: trackLabel, href });
        onClick?.(event);
      }}
    />
  );
}
