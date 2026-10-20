import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { ContactLinkBuilder } from './lib/contact/ContactLinkBuilder';
import { LocaleProvider } from './lib/i18n/LocaleProvider';
import { RouterProvider } from './lib/router/Router';
import { ServicesProvider, type AppServices } from './lib/services';
import { ThemeProvider } from './lib/theme/ThemeProvider';

function renderApp(path = '/') {
  window.history.replaceState(null, '', path);
  const track = vi.fn();
  const services: AppServices = {
    analytics: { track },
    contact: new ContactLinkBuilder({ email: 'leo@example.com', whatsapp: '5516991091234' }),
  };
  render(
    <ServicesProvider value={services}>
      <ThemeProvider>
        <LocaleProvider initialLocale="pt-BR">
          <RouterProvider initialPath={path}>
            <App />
          </RouterProvider>
        </LocaleProvider>
      </ThemeProvider>
    </ServicesProvider>,
  );
  return { track, user: userEvent.setup() };
}

describe('<App />', () => {
  beforeEach(() => localStorage.clear());

  it('a página inicial é curta: hero, ofertas, prova, perfil e contato', () => {
    renderApp();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/mentoria de produto e diagnóstico de PMO que saem do papel/i);
    for (const id of ['ofertas', 'depoimentos', 'perfil', 'contato']) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
    // A trajetória completa mora em /sobre.
    for (const id of ['experiencia', 'produtos', 'formacao']) {
      expect(document.getElementById(id)).toBeNull();
    }
  });

  it('o hero leva às duas ofertas, com preço', () => {
    renderApp();
    const hero = document.getElementById('inicio')!;
    expect(within(hero).getByRole('link', { name: /R\$ 997\/mês.*mentoria 1:1/i })).toHaveAttribute('href', '/mentoria-produto');
    expect(within(hero).getByRole('link', { name: /R\$ 7\.500.*diagnóstico/i })).toHaveAttribute('href', '/diagnostico-pmo');
  });

  it('mostra os dois planos com CTA para o WhatsApp e link para a página de cada um', () => {
    renderApp();
    const offer = document.getElementById('ofertas')!;
    const cta = within(offer).getByRole('link', { name: /garantir vaga fundador/i });
    expect(cta).toHaveAttribute('href', expect.stringMatching(/^https:\/\/wa\.me\/5516991091234\?text=/));
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(offer).getByRole('link', { name: /ver o diagnóstico em detalhe/i })).toHaveAttribute('href', '/diagnostico-pmo');
    expect(within(offer).getByText('R$ 7.500')).toBeInTheDocument();
    expect(within(offer).getByText('Depois: R$ 12.000')).toBeInTheDocument();
  });

  it('navega para outra página sem recarregar, com a URL e o título novos', async () => {
    document.documentElement.classList.add('reduced-motion');
    const { user, track } = renderApp();
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    await user.click(within(nav).getByRole('link', { name: 'Diagnóstico' }));
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/diagnóstico de maturidade de PMO e portfólio/i));
    expect(window.location.pathname).toBe('/diagnostico-pmo');
    expect(document.title).toMatch(/Diagnóstico de Maturidade de PMO/);
    expect(within(nav).getByRole('link', { name: 'Diagnóstico' })).toHaveAttribute('aria-current', 'page');
    expect(track).toHaveBeenCalledWith('page_view', expect.objectContaining({ page_path: '/diagnostico-pmo' }));
    document.documentElement.classList.remove('reduced-motion');
  });

  it('cada página interna abre direto no endereço dela', () => {
    renderApp('/sobre');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/do service desk/i);
    expect(document.getElementById('produtos')).toBeInTheDocument();
  });

  it('endereço desconhecido mostra a 404 com caminhos de volta', () => {
    renderApp('/cases');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/não existe/i);
    expect(screen.getAllByRole('link', { name: /mentoria/i }).some((a) => a.getAttribute('href') === '/mentoria-produto')).toBe(true);
  });

  it('a Área do cliente fica no cabeçalho só como ícone, menos chamativa que o convite', () => {
    renderApp();
    const header = screen.getByRole('banner');
    const clientArea = within(header).getByRole('link', { name: /área do cliente/i });
    expect(clientArea).toHaveAttribute('href', '/entrar');
    expect(clientArea.textContent).toBe('Área do cliente'); // só o texto para leitores de tela
    expect(within(clientArea).getByText('Área do cliente')).toHaveClass('sr-only');
  });

  it('o rodapé não fala da stack técnica', () => {
    renderApp();
    expect(screen.getByRole('contentinfo')).not.toHaveTextContent(/React|TypeScript|Tailwind/);
  });

  it('sem agenda configurada, não mostra botões de agendamento e mantém o WhatsApp', () => {
    renderApp();
    const contact = document.getElementById('contato')!;
    expect(within(contact).queryByRole('link', { name: /agendar conversa de 30 min/i })).toBeNull();
    expect(within(contact).getByRole('link', { name: /whatsapp/i })).toHaveAttribute('href', expect.stringContaining('wa.me'));
  });

  it('registra o clique de CTA no analytics', async () => {
    const { track, user } = renderApp();
    document.documentElement.classList.add('reduced-motion');
    await user.click(within(document.getElementById('inicio')!).getByRole('link', { name: /mentoria 1:1/i }));
    expect(track).toHaveBeenCalledWith('cta_click', expect.objectContaining({ label: 'hero_mentoring' }));
    document.documentElement.classList.remove('reduced-motion');
  });

  it('troca o idioma para inglês e persiste a escolha', async () => {
    const { user, track } = renderApp();
    await user.click(screen.getByRole('button', { name: 'EN' }));
    expect(screen.getByRole('heading', { level: 1 })).not.toHaveTextContent(/saem do papel/i);
    expect(document.documentElement.lang).toBe('en');
    expect(localStorage.getItem('lp:locale')).toBe('en');
    expect(track).toHaveBeenCalledWith('language_change', { label: 'en' });
  });

  it('navega entre depoimentos', async () => {
    const { user } = renderApp();
    const section = document.getElementById('depoimentos')!;
    expect(within(section).getByText(/01 de 06/)).toBeInTheDocument();
    await user.click(within(section).getByRole('button', { name: /próximo/i }));
    expect(within(section).getByText(/02 de 06/)).toBeInTheDocument();
    await user.click(within(section).getByRole('button', { name: /anterior/i }));
    await user.click(within(section).getByRole('button', { name: /anterior/i }));
    expect(within(section).getByText(/06 de 06/)).toBeInTheDocument();
  });

  it('alterna o tema escuro', async () => {
    const { user } = renderApp();
    const toggle = screen.getByRole('button', { name: /alternar tema/i });
    const wasDark = document.documentElement.classList.contains('dark');
    await user.click(toggle);
    expect(document.documentElement.classList.contains('dark')).toBe(!wasDark);
  });
});
