import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { isGentleMode } from '@/lib/motion/motionPreference';
import { useSmoothScroll } from '@/lib/motion/SmoothScroll';
import { isSitePath, LEGACY_ANCHORS, normalizePath, pathOf, resolvePage, type PageId } from './routes';

interface RouterValue {
  page: PageId;
  path: string;
  /** Vai para outra página do site com a transição de página (ou rola, se for a mesma). */
  navigate: (href: string) => void;
}

const RouterContext = createContext<RouterValue>({ page: 'home', path: '/', navigate: () => {} });

interface RouteState {
  path: string;
  hash: string;
  /** Muda a cada navegação: dispara o ajuste de rolagem da página nova. */
  key: number;
  /** Posição a restaurar (voltar/avançar do navegador). */
  restoreY: number | null;
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Troca o conteúdo da página. Com a View Transitions API, o navegador congela a tela
 * antiga e dissolve para a nova (o cabeçalho fica parado: globals.css, "rota"); sem ela,
 * o <main> esmaece e volta. No modo suave, a troca é direta.
 */
function transition(commit: () => void) {
  const root = document.documentElement;
  if (isGentleMode() || root.classList.contains('reduced-motion')) return commit();
  if (typeof document.startViewTransition === 'function') {
    root.dataset.transicao = 'rota';
    const vt = document.startViewTransition(commit);
    vt.finished.finally(() => delete root.dataset.transicao);
    return;
  }
  const main = document.getElementById('conteudo');
  if (!main) return commit();
  gsap.to(main, {
    opacity: 0,
    duration: 0.18,
    ease: 'power1.in',
    onComplete: () => {
      commit();
      gsap.fromTo(main, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out', clearProps: 'opacity' });
    },
  });
}

/**
 * Roteador mínimo do site (sem dependência): cada página tem URL e HTML próprios, e entre
 * elas a navegação acontece sem recarregar — cabeçalho, scroll suave e tema continuam
 * vivos, e a página nova entra com transição. Links comuns (<a href="/sobre">) bastam:
 * o clique é interceptado aqui. Outros documentos (/entrar) seguem a navegação normal.
 */
export function RouterProvider({ initialPath, children }: { initialPath?: string; children: ReactNode }) {
  const { scrollTo } = useSmoothScroll();
  const [route, setRoute] = useState<RouteState>(() => ({
    path: normalizePath(initialPath ?? (typeof window === 'undefined' ? '/' : window.location.pathname)),
    hash: '',
    key: 0,
    restoreY: null,
  }));
  const routeRef = useRef(route);
  routeRef.current = route;

  const go = useCallback((url: URL, mode: 'push' | 'replace' | 'pop', animate = true) => {
    const path = normalizePath(url.pathname);
    const hash = decodeURIComponent(url.hash.slice(1));
    let restoreY: number | null = null;
    if (mode === 'push') {
      history.replaceState({ ...history.state, scrollY: window.scrollY }, '');
      history.pushState({ scrollY: 0 }, '', `${path}${url.search}${url.hash}`);
    } else if (mode === 'replace') {
      history.replaceState({ scrollY: 0 }, '', `${path}${url.search}${url.hash}`);
    } else {
      restoreY = typeof history.state?.scrollY === 'number' ? history.state.scrollY : 0;
    }
    const commit = () => flushSync(() => setRoute((prev) => ({ path, hash, key: prev.key + 1, restoreY })));
    if (animate) transition(commit);
    else commit();
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (normalizePath(url.pathname) === routeRef.current.path) {
        if (url.hash) scrollTo(url.hash);
        else scrollTo(0);
        return;
      }
      go(url, 'push');
    },
    [go, scrollTo],
  );

  // Cliques em links internos viram navegação sem recarregar.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !isSitePath(url.pathname)) return;
      const samePage = normalizePath(url.pathname) === routeRef.current.path;
      // Âncora na própria página: o scroll suave (Lenis) ou o navegador cuidam.
      if (samePage && url.hash) return;
      event.preventDefault();
      navigate(url.href);
    };
    const onPop = () => go(new URL(window.location.href), 'pop');
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPop);
    };
  }, [go, navigate]);

  // Links antigos da página única (/#produtos) levam à página onde a seção mora agora.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const legacy = routeRef.current.path === '/' ? LEGACY_ANCHORS[hash] : undefined;
    if (legacy) go(new URL(`${pathOf(legacy.page)}#${legacy.hash}`, window.location.href), 'replace', false);
  }, [go]);

  // Entrada direta numa âncora (/#contato, como no link da assinatura de e-mail): o
  // navegador pula antes de as cenas fixadas esticarem a página e para no meio do
  // caminho. Refaz o pulo a cada refresh do ScrollTrigger até a página assentar ou a
  // pessoa rolar por conta própria.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash || (routeRef.current.path === '/' && LEGACY_ANCHORS[hash])) return;
    const jump = () => {
      const target = document.getElementById(hash);
      if (target) scrollTo(target, { immediate: true });
    };
    const userEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    const stop = () => {
      ScrollTrigger.removeEventListener('refresh', jump);
      userEvents.forEach((type) => window.removeEventListener(type, stop));
      window.clearTimeout(timer);
    };
    ScrollTrigger.addEventListener('refresh', jump);
    userEvents.forEach((type) => window.addEventListener(type, stop, { passive: true }));
    const timer = window.setTimeout(stop, 5000);
    jump();
    return stop;
  }, [scrollTo]);

  // Página nova: começa do topo (ou da âncora, ou de onde estava ao voltar) e recalcula as cenas.
  useIsomorphicLayoutEffect(() => {
    if (route.key === 0) return;
    scrollTo(route.restoreY ?? 0, { immediate: true });
    ScrollTrigger.refresh();
    if (route.hash) {
      const target = document.getElementById(route.hash);
      if (target) scrollTo(target, { immediate: true });
    } else if (route.restoreY) {
      scrollTo(route.restoreY, { immediate: true });
    }
    // Leitores de tela: o foco vai para o conteúdo novo, como numa troca de página.
    document.getElementById('conteudo')?.focus({ preventScroll: true });
  }, [route.key]);

  const value = useMemo(() => ({ page: resolvePage(route.path), path: route.path, navigate }), [route.path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  return useContext(RouterContext);
}
