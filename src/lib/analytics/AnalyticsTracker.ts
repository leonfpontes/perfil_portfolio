/**
 * Abstração de analytics (Dependency Inversion): os componentes conhecem só a
 * interface `AnalyticsTracker`; a implementação concreta é escolhida em runtime.
 */
export type AnalyticsEvent =
  | 'cta_click'
  | 'nav_click'
  | 'language_change'
  | 'theme_change'
  | 'outbound_click'
  /** Troca de página sem recarregar (o roteador do site). */
  | 'page_view';

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export interface AnalyticsTracker {
  track(event: AnalyticsEvent, params?: AnalyticsParams): void;
}

type Gtag = (command: 'event', action: string, params?: AnalyticsParams) => void;

/** Envia eventos ao Google Analytics 4 via `gtag`, carregado no index.html. */
export class GtagTracker implements AnalyticsTracker {
  constructor(private readonly gtag: Gtag) {}

  track(event: AnalyticsEvent, params?: AnalyticsParams): void {
    try {
      this.gtag('event', event, params);
    } catch {
      // Analytics nunca deve quebrar a experiência do usuário.
    }
  }
}

/** Implementação nula — usada em testes, SSR ou quando o GA está bloqueado. */
export class NoopTracker implements AnalyticsTracker {
  track(): void {}
}

/** Factory: escolhe a implementação com base no ambiente disponível. */
export function createAnalyticsTracker(win: Window | undefined = globalThis.window): AnalyticsTracker {
  const gtag = (win as (Window & { gtag?: Gtag }) | undefined)?.gtag;
  return typeof gtag === 'function' ? new GtagTracker(gtag) : new NoopTracker();
}
