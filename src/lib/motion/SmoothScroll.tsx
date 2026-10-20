import Lenis from 'lenis';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, ScrollTrigger } from './gsap';

type ScrollTarget = string | number | HTMLElement;

interface SmoothScrollValue {
  /** Rola até um seletor, elemento ou posição — suave com Lenis, nativo sem ele. */
  scrollTo: (target: ScrollTarget, options?: { immediate?: boolean }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollValue>({
  scrollTo: (target) => nativeScrollTo(target),
});

const HEADER_OFFSET = -56;

function nativeScrollTo(target: ScrollTarget) {
  if (typeof target === 'number') return window.scrollTo({ top: target });
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  // Mesmo desconto do cabeçalho fixo que o Lenis aplica.
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET });
}

/**
 * Scroll suave com Lenis, sincronizado ao relógio do GSAP para que
 * ScrollTrigger e Lenis andem no mesmo frame (sem "tremidas" em pins).
 * Desligado com prefers-reduced-motion.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  // Mantém os gatilhos do ScrollTrigger corretos quando a altura da página muda
  // depois do cálculo inicial: fontes que chegam tarde (recarregamento sem cache),
  // troca de idioma, "Ler mais" etc. Sem isso, cores e cenas disparariam no lugar errado.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Recarregar no meio de uma cena fixada deixaria os pins em estado inconsistente.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    let lastHeight = document.body.scrollHeight;
    let timer = 0;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        lenisRef.current?.resize();
      }, 120);
    };
    // Registra a altura "oficial" após cada refresh (pins mudam a altura de propósito).
    const onRefresh = () => {
      lastHeight = document.body.scrollHeight;
    };
    ScrollTrigger.addEventListener('refresh', onRefresh);

    const check = () => {
      if (Math.abs(document.body.scrollHeight - lastHeight) > 2) refresh();
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(check);
    observer?.observe(document.body);
    // Reserva barata: alguns ambientes atrasam ou não entregam o ResizeObserver.
    const poll = window.setInterval(check, 500);
    document.fonts?.ready.then(refresh).catch(() => {});

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(poll);
      observer?.disconnect();
      ScrollTrigger.removeEventListener('refresh', onRefresh);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    let lenis: Lenis;
    try {
      lenis = new Lenis({ autoRaf: false, lerp: 0.09, anchors: { offset: HEADER_OFFSET } });
    } catch {
      return; // ambiente sem suporte (ex.: testes) — segue com scroll nativo
    }
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const scrollTo = useCallback((target: ScrollTarget, options?: { immediate?: boolean }) => {
    const lenis = lenisRef.current;
    if (!lenis) return nativeScrollTo(target);
    // Depois de uma troca de página a altura mudou: sem recalcular, o Lenis limitaria o destino.
    if (options?.immediate) lenis.resize();
    lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : HEADER_OFFSET, immediate: options?.immediate, duration: 1.4 });
  }, []);

  const value = useMemo(() => ({ scrollTo }), [scrollTo]);
  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll(): SmoothScrollValue {
  return useContext(SmoothScrollContext);
}
