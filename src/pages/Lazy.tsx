import { Suspense, type ReactNode } from 'react';

/**
 * Cada seção é uma fronteira de hidratação: o React hidrata a primeira tela antes
 * e libera a CPU entre as demais (menos travamento no celular).
 */
export function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
