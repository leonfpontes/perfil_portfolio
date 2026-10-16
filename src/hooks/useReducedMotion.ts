import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** matchMedia pode não existir (SSR, happy-dom antigo); nesse caso assumimos movimento liberado. */
function getMediaQuery(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;
  return window.matchMedia(QUERY);
}

function subscribe(onChange: () => void): () => void {
  const mql = getMediaQuery();
  if (!mql) return () => {};
  // Safari < 14 só expõe addListener.
  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }
  mql.addListener(onChange);
  return () => mql.removeListener(onChange);
}

const getSnapshot = (): boolean => getMediaQuery()?.matches ?? false;
const getServerSnapshot = (): boolean => false;

/** Indica se o usuário pediu menos movimento no sistema; reage a mudanças em tempo real. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
