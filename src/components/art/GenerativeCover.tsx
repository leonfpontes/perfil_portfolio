import { useMemo, useRef } from 'react';
import { createColorReader, useCanvas } from '@/hooks/useCanvas';
import { createNoise } from '@/lib/art/noise';
import { createRandom } from '@/lib/art/random';
import { cn } from '@/lib/utils';
import { coverPainters, type CoverVariant } from './covers';

export interface GenerativeCoverProps {
  variant: CoverVariant;
  seed?: string;
  className?: string;
  /** Descrição acessível; sem ela a capa é tratada como decorativa. */
  label?: string;
}

/** Capa generativa de projeto: delega o desenho à estratégia da variante (ver `covers.ts`). */
export function GenerativeCover({ variant, seed = 'cover', className, label }: GenerativeCoverProps) {
  const noise = useMemo(() => createNoise(`${seed}:${variant}`), [seed, variant]);
  const readColors = useRef(createColorReader()).current;

  const ref = useCanvas(
    (ctx, frame) => {
      const colors = readColors(ctx.canvas, frame.first);
      ctx.clearRect(0, 0, frame.width, frame.height);
      ctx.save();
      coverPainters[variant](ctx, frame, { rnd: createRandom(`${seed}:${variant}`), noise, colors });
      ctx.restore();
    },
    { stillTime: 6, deps: [variant, seed] },
  );

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <canvas ref={ref} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
