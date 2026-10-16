import type { ReactNode } from 'react';
import { sectionNumber } from '@/content/sections';
import type { SectionHeading, SectionId } from '@/content/types';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

/** Container horizontal padrão — único lugar que define largura e gutters. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-8', className)}>{children}</div>;
}

interface SectionProps {
  id: SectionId;
  heading: SectionHeading;
  children: ReactNode;
  className?: string;
}

/** Seção numerada no estilo de relatório: fio superior, "§ 01 — Rótulo", título em serifa. */
export function Section({ id, heading, children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('py-20 sm:py-28', className)}>
      <Container>
        <SectionHeader id={id} heading={heading} />
        {children}
      </Container>
    </section>
  );
}

export function SectionHeader({ id, heading }: { id: SectionId; heading: SectionHeading }) {
  return (
    <Reveal className="mb-14 grid gap-6 border-t border-foreground pt-5 lg:mb-20 lg:grid-cols-12">
      <p className="label-mono text-muted-foreground lg:col-span-3">
        § {sectionNumber(id)} — {heading.eyebrow}
      </p>
      <div className="lg:col-span-9">
        <h2 id={`${id}-title`} className="display max-w-4xl text-5xl text-balance sm:text-6xl lg:text-7xl">
          {heading.title}
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">{heading.description}</p>
      </div>
    </Reveal>
  );
}
