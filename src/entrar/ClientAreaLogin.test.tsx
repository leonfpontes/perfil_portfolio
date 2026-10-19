import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientAreaLogin } from './ClientAreaLogin';
import { APP_URL } from './api';
import { navegador } from './passagem';

type Route = (body: unknown) => { status: number; body?: unknown };

/** Um app de mentira: responde às rotas de entrada e anota o que recebeu. */
function fakeApp(routes: Record<string, Route>) {
  const calls: Array<{ path: string; body: unknown; credentials?: RequestCredentials }> = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init: RequestInit = {}) => {
      const path = `${init.method ?? 'GET'} ${url.replace(`${APP_URL}/api/auth`, '')}`;
      const body = init.body ? JSON.parse(String(init.body)) : undefined;
      calls.push({ path, body, credentials: init.credentials });
      const route = routes[path];
      const answer = route ? route(body) : { status: 401, body: { error: 'Não autenticado.' } };
      return new Response(answer.status === 204 ? null : JSON.stringify(answer.body ?? {}), { status: answer.status });
    }),
  );
  return calls;
}

const REQUEST_ID = '6f1c1a8e-3b9a-4c1e-9c3e-1f2a3b4c5d6e';

const ANA = { user: { id: 'u1', name: 'Ana Souza', email: 'ana@exemplo.com' }, roles: ['mentee'] };

describe('Área do cliente (/entrar)', () => {
  let goTo: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    // Sem animação nos testes: a troca de página acontece na hora.
    document.documentElement.classList.add('reduced-motion');
    goTo = vi.spyOn(navegador, 'ir').mockImplementation(() => {});
    window.history.replaceState(null, '', '/entrar');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.documentElement.classList.remove('reduced-motion');
  });

  it('sends an access link by e-mail, with the cookie of the app', async () => {
    const calls = fakeApp({ 'POST /magic-link': () => ({ status: 202, body: { ok: true } }) });
    render(<ClientAreaLogin />);

    await userEvent.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com');
    await userEvent.click(screen.getByRole('button', { name: /Enviar link de acesso/ }));

    expect(await screen.findByRole('heading', { name: 'Confira seu e-mail' })).toBeInTheDocument();
    expect(calls.find((call) => call.path === 'POST /magic-link')).toMatchObject({
      body: { email: 'ana@exemplo.com' },
      credentials: 'include',
    });
  });

  it('signs the mentor in with password and the 2FA code, then opens the app', async () => {
    fakeApp({
      'POST /login': () => ({ status: 200, body: { twoFactorRequired: true, challenge: 'c'.repeat(32) } }),
      'POST /login/two-factor': (body) =>
        (body as { code: string }).code === '123456'
          ? { status: 200, body: { ...ANA, roles: ['mentor'] } }
          : { status: 401, body: { error: 'Código inválido.' } },
    });
    render(<ClientAreaLogin />);

    await userEvent.click(screen.getByRole('button', { name: 'Senha' }));
    await userEvent.type(screen.getByLabelText('E-mail'), 'leo@exemplo.com');
    await userEvent.type(screen.getByLabelText('Senha'), 'uma senha longa');
    await userEvent.click(screen.getByRole('button', { name: /Entrar/ }));

    await userEvent.type(await screen.findByLabelText('Código'), '000000');
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Código inválido.');

    await userEvent.clear(screen.getByLabelText('Código'));
    await userEvent.type(screen.getByLabelText('Código'), '123456');
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByRole('heading', { name: 'Bem-vindo, Ana' })).toBeInTheDocument();
    expect(goTo).toHaveBeenCalledWith(`${APP_URL}/`);
  });

  it('opens the link from the e-mail and takes the person where the app asked, without keeping the token', async () => {
    window.history.replaceState(null, '', '/entrar?token=abc&next=%2Fempresa%3Fsecao%3Droadmap');
    const calls = fakeApp({ 'POST /magic-link/verify': () => ({ status: 200, body: ANA }) });
    render(<ClientAreaLogin />);

    await waitFor(() => expect(goTo).toHaveBeenCalledWith(`${APP_URL}/empresa?secao=roadmap`));
    expect(calls.find((call) => call.path === 'POST /magic-link/verify')?.body).toEqual({ token: 'abc' });
    expect(window.location.search).toBe('');
  });

  it('explains an expired link and sends a new one to the remembered address with one tap', async () => {
    localStorage.setItem('lp:entrar:email', 'ana@exemplo.com');
    window.history.replaceState(null, '', '/entrar?token=velho');
    const calls = fakeApp({
      'POST /magic-link/verify': () => ({ status: 401, body: { error: 'Este link expirou ou já foi usado.' } }),
      'POST /magic-link': () => ({ status: 202, body: { requestId: REQUEST_ID } }),
    });
    render(<ClientAreaLogin />);

    expect(await screen.findByRole('alert')).toHaveTextContent('valem por 15 minutos e funcionam uma vez');
    await userEvent.click(screen.getByRole('button', { name: 'Mandar um novo para ana@exemplo.com' }));
    expect(await screen.findByRole('heading', { name: 'Confira seu e-mail' })).toBeInTheDocument();
    expect(calls.find((call) => call.path === 'POST /magic-link')?.body).toEqual({ email: 'ana@exemplo.com' });
  });

  it('signs in with the code from the e-mail, typed (or pasted) on this page', async () => {
    const calls = fakeApp({
      'POST /magic-link': () => ({ status: 202, body: { requestId: REQUEST_ID } }),
      'POST /magic-link/code': (body) =>
        (body as { code: string }).code === '482913'
          ? { status: 200, body: ANA }
          : { status: 401, body: { error: 'Código incorreto ou vencido.' } },
    });
    render(<ClientAreaLogin />);
    await userEvent.type(screen.getByLabelText('E-mail'), 'ana@gmail.com');
    await userEvent.click(screen.getByRole('button', { name: /Enviar link de acesso/ }));

    const box = await screen.findByLabelText('Código de 6 números');
    expect(screen.getByRole('link', { name: /Abrir o Gmail/ })).toHaveAttribute('target', '_blank');
    await userEvent.type(box, '111111');
    expect(await screen.findByRole('alert')).toHaveTextContent('Código incorreto');

    await userEvent.clear(box);
    await userEvent.type(box, '482 913');
    await waitFor(() => expect(goTo).toHaveBeenCalledWith(`${APP_URL}/`));
    expect(calls.filter((call) => call.path === 'POST /magic-link/code').at(-1)?.body).toEqual({
      requestId: REQUEST_ID,
      code: '482913',
    });
    // Signed in: nothing of the request stays on the device.
    expect(sessionStorage.getItem('lp:entrar:pedido')).toBeNull();
    expect(localStorage.getItem('lp:entrar:email')).toBe('ana@gmail.com');
  });

  it('still waits for the code after a trip to the mail app, and resends after a minute', async () => {
    sessionStorage.setItem(
      'lp:entrar:pedido',
      JSON.stringify({ email: 'ana@exemplo.com', requestId: REQUEST_ID, sentAt: Date.now() - 61_000 })
    );
    const calls = fakeApp({ 'POST /magic-link': () => ({ status: 202, body: { requestId: REQUEST_ID } }) });
    render(<ClientAreaLogin />);

    expect(await screen.findByLabelText('Código de 6 números')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'reenviar' }));
    await waitFor(() => expect(calls.filter((call) => call.path === 'POST /magic-link')).toHaveLength(1));
    expect(await screen.findByText(/reenvie em/)).toBeInTheDocument();
  });

  it('never sends the person to another site through ?next=', async () => {
    window.history.replaceState(null, '', '/entrar?token=abc&next=%2F%2Fevil.example');
    fakeApp({ 'POST /magic-link/verify': () => ({ status: 200, body: ANA }) });
    render(<ClientAreaLogin />);
    await waitFor(() => expect(goTo).toHaveBeenCalledWith(`${APP_URL}/`));
  });

  it('recognizes who is already signed in', async () => {
    fakeApp({ 'GET /me': () => ({ status: 200, body: ANA }) });
    render(<ClientAreaLogin />);

    expect(await screen.findByRole('heading', { name: 'Você já está conectado, Ana' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Continuar para a minha área/ }));
    expect(goTo).toHaveBeenCalledWith(`${APP_URL}/`);
  });
});
