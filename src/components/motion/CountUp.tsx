import { useRef } from 'react';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';

/** Separa "R$ 2.500/mês" em prefixo, número, separador de milhar e sufixo. */
export function parseNumeric(value: string) {
  const match = value.match(/\d[\d.,]*/);
  if (!match || match.index === undefined) return null;
  const raw = match[0];
  const separator = /\d[.,]\d{3}/.test(raw) ? raw.replace(/\d/g, '').charAt(0) : '';
  const number = Number(raw.replace(/[.,]/g, ''));
  return { prefix: value.slice(0, match.index), number, separator, suffix: value.slice(match.index + raw.length) };
}

export function formatNumeric(n: number, separator: string): string {
  const s = String(Math.round(n));
  return separator ? s.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : s;
}

/** Número que "conta" até o valor final ao entrar na tela. Texto final sempre presente no DOM. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const parsed = parseNumeric(value);
      if (!el || !parsed) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const counter = { n: 0 };
        gsap.to(counter, {
          n: parsed.number,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          onUpdate: () => {
            el.textContent = `${parsed.prefix}${formatNumeric(counter.n, parsed.separator)}${parsed.suffix}`;
          },
        });
        return () => {
          el.textContent = value;
        };
      });
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
