import type { ReactNode } from 'react';
import { sectionNumber } from '@/content/sections';
import type { SectionHeading, SectionId } from '@/content/types';
import { cn } from '@/lib/utils';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from './Reveal';

/** Container horizontal padrão — único lugar que define largura e gutters. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-8', className)}>{children}</div>;
}

interface SectionHeaderProps {
  id: SectionId;
  heading: SectionHeading;
  /** Versão enxuta para cenas fixadas, que precisam caber numa única tela. */
  compact?: boolean;
}

export function SectionHeader({ id, heading, compact = false }: SectionHeaderProps) {
  return (
    <Reveal className={cn('grid gap-6 border-t border-foreground pt-5 lg:grid-cols-12', compact ? 'mb-8 lg:mb-10' : 'mb-10 lg:mb-20')}>
      <p className="label-mono text-muted-foreground lg:col-span-3">
        § {sectionNumber(id)} — {heading.eyebrow}
      </p>
      <div className="lg:col-span-9">
        <SplitReveal
          as="h2"
          id={`${id}-title`}
          className={cn('display max-w-4xl text-balance', compact ? 'text-4xl sm:text-5xl' : 'text-[2.6rem] leading-[1] sm:text-6xl lg:text-7xl')}
        >
          {heading.title}
        </SplitReveal>
        {!compact && <p className="mt-4 max-w-2xl text-pretty text-muted-foreground lg:mt-6 lg:text-lg">{heading.description}</p>}
      </div>
    </Reveal>
  );
}
