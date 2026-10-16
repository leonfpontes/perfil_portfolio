import { useSyncExternalStore } from 'react';
import { isGentleMode, readMotionPref } from '@/lib/motion/motionPreference';

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

const getSnapshot = (): boolean => isGentleMode(readMotionPref(), getMediaQuery()?.matches ?? false);
const getServerSnapshot = (): boolean => false;

/** Modo suave efetivo: o sistema pede menos movimento (e o visitante não pediu tudo) ou o visitante pediu menos. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
