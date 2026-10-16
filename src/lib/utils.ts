import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Combina classes condicionais e resolve conflitos de utilitários Tailwind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
