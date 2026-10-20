// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { render, renderHead, ROUTES } from './entry-server';

describe('pré-renderização', () => {
  it('gera o HTML de cada página sem depender do navegador', () => {
    const home = render('/');
    expect(home).toContain('saem do papel');
    expect(home).toContain('id="ofertas"');
    expect(home).toContain('R$ 7.500');
    expect(home).toContain('id="contato"');

    const mentoring = render('/mentoria-produto');
    expect(mentoring).toMatch(/<h1[^>]*>Mentoria de produto para/);
    expect(mentoring).toContain('R$ 997');
    expect(mentoring).toContain('id="faq"');

    const diagnostic = render('/diagnostico-pmo');
    expect(diagnostic).toMatch(/<h1[^>]*>Diagnóstico de maturidade de/);
    expect(diagnostic).toContain('R$ 12.000');
    expect(diagnostic).toContain('Execução acompanhada');

    // Conteúdo de cenas mais abaixo também vem no HTML (SEO e leitura sem JS).
    const about = render('/sobre');
    expect(about).toContain('GiraHub');
    expect(about).toContain('MBA em Gestão de Projetos');
    expect(about.length).toBeGreaterThan(50_000);

    expect(render('/nao-existe')).toContain('Esta página não existe');
  });

  it('cada rota tem um único H1', () => {
    for (const route of ROUTES) {
      expect(render(route.path).match(/<h1[\s>]/g)).toHaveLength(1);
    }
  });

  it('cada rota tem título e canônica próprios; a 404 fica fora dos buscadores', () => {
    const titles = new Set<string>();
    for (const route of ROUTES) {
      const head = renderHead(route.id);
      titles.add(head.match(/<title>(.*?)<\/title>/)![1]!);
      if (route.id === 'notFound') {
        expect(head).toContain('<meta name="robots" content="noindex" />');
        expect(head).not.toContain('rel="canonical"');
      } else {
        expect(head).toContain(`<link rel="canonical" href="https://www.leopontes.com.br${route.path === '/' ? '/' : route.path}" />`);
        expect(head).toContain('application/ld+json');
      }
    }
    expect(titles.size).toBe(ROUTES.length);
  });
});
