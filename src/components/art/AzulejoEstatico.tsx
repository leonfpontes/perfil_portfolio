import { cn } from '@/lib/utils';

/*
 * A mesma parede de azulejos do Azulejo.tsx (painéis de Athos Bulcão), em SVG estático: desenha
 * na pré-renderização, não custa script e não se mexe. É a arte do app (lp-diagnostico,
 * src/components/editorial/Azulejo.tsx) — o login do site e o app usam a mesma parede.
 */

type Brand = 'azul' | 'ocre' | 'mata' | 'cal' | 'breu';

/** Cada módulo num quadrado 1×1, antes da rotação. */
const MOTIFS = [
  'M0 0 L1 0 A1 1 0 0 1 0 1 Z', // quarto de círculo num canto
  'M0 1 A0.5 0.5 0 0 1 1 1 Z', // meia-lua sobre a base
  'M0 0 L1 0 L0 1 Z', // meio quadrado na diagonal
  'M0 0 L0.5 0 A0.5 0.5 0 0 1 0 0.5 Z M1 1 L0.5 1 A0.5 0.5 0 0 1 1 0.5 Z', // dois quartos opostos
  'M0.5 0.2 A0.3 0.3 0 1 1 0.5 0.8 A0.3 0.3 0 1 1 0.5 0.2 Z', // círculo
  'M0 0 H1 V0.5 H0 Z', // faixa
];

/** Pares fundo/figura com bom contraste: a paleta da parede. */
const PAIRS: [Brand, Brand][] = [
  ['azul', 'cal'],
  ['cal', 'azul'],
  ['ocre', 'breu'],
  ['mata', 'ocre'],
  ['cal', 'mata'],
  ['azul', 'ocre'],
  ['ocre', 'azul'],
  ['cal', 'ocre'],
];

/** Gerador determinístico pequeno: a mesma semente compõe a mesma parede (servidor e navegador). */
function random(seed: string) {
  let state = 7;
  for (const char of seed) state = (state * 31 + char.charCodeAt(0)) % 2147483647;
  if (state === 0) state = 1;
  const next = () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
  // Os primeiros sorteios de um estado pequeno ficam próximos: pulados, para a parede variar.
  for (let i = 0; i < 12; i++) next();
  return next;
}

export function AzulejoEstatico({
  seed = 'lp',
  cols,
  rows,
  className,
}: {
  seed?: string;
  cols: number;
  rows: number;
  className?: string;
}) {
  const next = random(seed);
  const pick = (n: number) => Math.floor(next() * n);
  const tiles = Array.from({ length: cols * rows }, (_, i) => ({
    x: i % cols,
    y: Math.floor(i / cols),
    motif: MOTIFS[pick(MOTIFS.length)],
    pair: PAIRS[pick(PAIRS.length)]!,
    angle: pick(4) * 90,
  }));
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${cols} ${rows}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn('block', className)}
      shapeRendering="geometricPrecision"
    >
      {tiles.map((tile) => (
        <g key={`${tile.x}-${tile.y}`} transform={`translate(${tile.x} ${tile.y}) rotate(${tile.angle} 0.5 0.5)`}>
          <rect x="-0.01" y="-0.01" width="1.02" height="1.02" style={{ fill: `var(--${tile.pair[0]})` }} />
          <path d={tile.motif} style={{ fill: `var(--${tile.pair[1]})` }} />
        </g>
      ))}
    </svg>
  );
}
