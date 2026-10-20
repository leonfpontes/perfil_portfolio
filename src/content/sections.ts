import { PAGE_SECTIONS, type PageId } from '@/lib/router/routes';
import type { SectionId } from './types';

/**
 * Número de seção com dois dígitos ("01") dentro da página; string vazia se a
 * seção não é numerada nessa página (ex.: o hero, "inicio").
 */
export function sectionNumber(page: PageId, id: SectionId): string {
  const index = PAGE_SECTIONS[page].indexOf(id);
  return index < 0 ? '' : String(index + 1).padStart(2, '0');
}

/** Quantas seções numeradas a página tem (o "/ 04" do marcador de capítulo). */
export function sectionCount(page: PageId): number {
  return PAGE_SECTIONS[page].length;
}
