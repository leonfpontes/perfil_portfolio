import type { SectionId } from './types';

/**
 * Ordem canônica das seções numeradas (§ 01, § 02…).
 * Fonte única usada pela página (App) e pelos cabeçalhos de seção.
 */
export const SECTION_ORDER = [
  'mentoria',
  'depoimentos',
  'servicos',
  'sobre',
  'produtos',
  'experiencia',
  'competencias',
  'formacao',
  'faq',
  'contato',
] as const satisfies readonly SectionId[];

/** Número de seção com dois dígitos ("01"); string vazia se não numerada. */
export function sectionNumber(id: SectionId): string {
  const index = (SECTION_ORDER as readonly SectionId[]).indexOf(id);
  return index < 0 ? '' : String(index + 1).padStart(2, '0');
}
