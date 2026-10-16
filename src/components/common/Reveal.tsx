import type { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li';
}

/** Entrada discreta (fade + 8px) ao entrar na viewport. Respeita reduced-motion via CSS. */
export function Reveal({ children, className, as: Tag = 'div' }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement & HTMLLIElement>();
  return (
    <Tag
      ref={ref}
      className={cn('transition-[opacity,translate] duration-500 ease-out', inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0', className)}
    >
      {children}
    </Tag>
  );
}
