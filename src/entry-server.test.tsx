// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { render } from './entry-server';

describe('pré-renderização', () => {
  it('gera o HTML da página sem depender do navegador', () => {
    const html = render();
    expect(html).toContain('saem do papel');
    expect(html).toContain('id="mentoria"');
    expect(html).toContain('id="contato"');
    // Conteúdo de cenas mais abaixo também vem no HTML (SEO e leitura sem JS).
    expect(html).toContain('GiraHub');
    expect(html.length).toBeGreaterThan(50_000);
  });
});
