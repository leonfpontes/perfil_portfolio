import { useEffect, useState } from 'react';

/**
 * Fica `true` só depois do primeiro paint, quando o navegador tem um respiro
 * (requestIdleCallback, com teto de 1,2 s). Serve para montar arte decorativa sem
 * disputar a primeira tela com o texto e o LCP.
 */
export function useAfterFirstPaint(timeout = 1200): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(id);
  }, [timeout]);

  return ready;
}
