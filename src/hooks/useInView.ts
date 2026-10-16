import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Retorna `true` quando o elemento entra na viewport (uma única vez).
 *
 * Começa como visível — igual ao HTML pré-renderizado, então o conteúdo nunca
 * depende do JavaScript para aparecer. Antes do primeiro paint, só o que está
 * abaixo da dobra é escondido para depois ser revelado.
 */
export function useInView<T extends Element>(options: IntersectionObserverInit = { rootMargin: '0px 0px -10% 0px' }) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // já visível
    setInView(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
