import { cn } from '@/lib/utils';

interface FigureProps {
  src: string;
  alt: string;
  caption: string;
  /** Número da figura exibido na legenda ("Fig. 2"). */
  number: number;
  className?: string;
  aspect?: string;
}

/** Fotografia de banco tratada como impressão, sempre com legenda — nunca decorativa sem contexto. */
export function Figure({ src, alt, caption, number, className, aspect = 'aspect-[4/3]' }: FigureProps) {
  return (
    <figure className={className}>
      <div className={cn('overflow-hidden bg-secondary', aspect)}>
        <img src={src} alt={alt} loading="lazy" decoding="async" className="print-photo size-full object-cover" />
      </div>
      <figcaption className="label-mono mt-3 flex gap-3 text-muted-foreground">
        <span className="text-foreground">Fig. {number}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
