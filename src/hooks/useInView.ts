import { useEffect, useRef, useState } from 'react';

/**
 * Retorna `true` quando o elemento entra na viewport (uma única vez).
 * Sem IntersectionObserver (ambientes antigos/testes), considera visível.
 */
export function useInView<T extends Element>(options: IntersectionObserverInit = { rootMargin: '0px 0px -10% 0px' }) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return { ref, inView };
}
