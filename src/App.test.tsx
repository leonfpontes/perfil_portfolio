import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { ContactLinkBuilder } from './lib/contact/ContactLinkBuilder';
import { LocaleProvider } from './lib/i18n/LocaleProvider';
import { ServicesProvider, type AppServices } from './lib/services';
import { ThemeProvider } from './lib/theme/ThemeProvider';

function renderApp() {
  const track = vi.fn();
  const services: AppServices = {
    analytics: { track },
    contact: new ContactLinkBuilder({ email: 'leo@example.com', whatsapp: '5516991091234' }),
  };
  render(
    <ServicesProvider value={services}>
      <ThemeProvider>
        <LocaleProvider initialLocale="pt-BR">
          <App />
        </LocaleProvider>
      </ThemeProvider>
    </ServicesProvider>,
  );
  return { track, user: userEvent.setup() };
}

describe('<App />', () => {
  beforeEach(() => localStorage.clear());

  it('renderiza o título principal e todas as seções numeradas', () => {
    renderApp();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/saem do papel/i);
    for (const id of ['mentoria', 'servicos', 'sobre', 'produtos', 'experiencia', 'faq', 'contato']) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
  });

  it('mostra os dois planos com CTA para o WhatsApp', () => {
    renderApp();
    const offer = document.getElementById('mentoria')!;
    const cta = within(offer).getByRole('link', { name: /garantir vaga fundador/i });
    expect(cta).toHaveAttribute('href', expect.stringMatching(/^https:\/\/wa\.me\/5516991091234\?text=/));
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('sem agenda configurada, não mostra botões de agendamento e mantém o WhatsApp', () => {
    renderApp();
    const contact = document.getElementById('contato')!;
    expect(within(contact).queryByRole('link', { name: /agendar conversa de 30 min/i })).toBeNull();
    expect(within(contact).getByRole('link', { name: /whatsapp/i })).toHaveAttribute('href', expect.stringContaining('wa.me'));
  });

  it('registra o clique de CTA no analytics', async () => {
    const { track, user } = renderApp();
    await user.click(screen.getAllByRole('link', { name: /conhecer a mentoria/i })[0]!);
    expect(track).toHaveBeenCalledWith('cta_click', expect.objectContaining({ label: 'hero_offer' }));
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
