import { safeStorage } from '@/lib/storage';

/**
 * Preferência de movimento do visitante.
 * - `system`: segue o sistema; se ele pedir menos movimento, o site entra no modo suave;
 * - `full`: animações completas mesmo com "Reduzir movimento" ligado no sistema;
 * - `reduced`: modo suave mesmo que o sistema não peça.
 */
export type MotionPref = 'system' | 'full' | 'reduced';

export const MOTION_STORAGE_KEY = 'lp:motion';

export function readMotionPref(): MotionPref {
  const v = safeStorage.get(MOTION_STORAGE_KEY);
  return v === 'full' || v === 'reduced' ? v : 'system';
}

export function osPrefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** Modo suave efetivo: o que de fato vale nesta visita. */
export function isGentleMode(pref: MotionPref = readMotionPref(), osReduce = osPrefersReducedMotion()): boolean {
  return pref === 'reduced' || (pref === 'system' && osReduce);
}

/**
 * Salva a preferência e recarrega: todas as coreografias são montadas no
 * carregamento (gsap.matchMedia), então recarregar é o jeito mais confiável
 * de trocar de modo.
 */
export function setMotionPref(pref: MotionPref): void {
  safeStorage.set(MOTION_STORAGE_KEY, pref);
  window.location.reload();
}

/**
 * Consultas de mídia do GSAP já considerando a preferência do visitante.
 * - `full` remove a cláusula de prefers-reduced-motion;
 * - `reduced` faz as consultas de movimento nunca casarem ("not all").
 */
export function buildMediaQueries(pref: MotionPref) {
  const clause = pref === 'full' ? '' : ' and (prefers-reduced-motion: no-preference)';
  const never = 'not all';
  return {
    /** Qualquer animação com deslocamento. */
    motion: pref === 'reduced' ? never : pref === 'full' ? 'all' : '(prefers-reduced-motion: no-preference)',
    desktop: pref === 'reduced' ? never : `(min-width: 1024px)${clause}`,
    mobile: pref === 'reduced' ? never : `(max-width: 1023px)${clause}`,
    /** Efeitos suaves (só opacidade/cor), válidos também no modo suave. */
    wide: '(min-width: 1024px)',
    narrow: '(max-width: 1023px)',
  } as const;
}
