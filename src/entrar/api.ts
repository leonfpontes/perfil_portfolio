/**
 * A Área do cliente mora no app (app.leopontes.com.br); o login acontece aqui, no site.
 * Estas chamadas vão à API de entrada do app com o cookie de sessão (`credentials: 'include'`):
 * www.leopontes.com.br e app.leopontes.com.br são o mesmo site, então o cookie SameSite=Lax do
 * app é gravado e enviado normalmente. O app só aceita esta origem nas rotas de entrada (CORS).
 */

/** Onde o app está. Em produção, o padrão; em desenvolvimento, `VITE_APP_URL` (ex.: http://localhost:3300). */
export const APP_URL = ((import.meta.env.VITE_APP_URL as string | undefined) ?? 'https://app.leopontes.com.br').replace(
  /\/$/,
  '',
);

export interface Principal {
  user: { id: string; name: string; email: string };
  roles: Array<'mentor' | 'mentee' | 'company'>;
}

/** Senha certa de uma conta com 2FA: falta o código do aplicativo autenticador. */
export interface TwoFactorStep {
  twoFactorRequired: true;
  challenge: string;
}

export type SignInResult = Principal | TwoFactorStep;

export const isTwoFactorStep = (result: SignInResult): result is TwoFactorStep => 'twoFactorRequired' in result;

/** Mensagem pronta para a pessoa ler (vem do app quando ele explica o erro). */
export class SignInError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${APP_URL}/api/auth${path}`, {
      ...init,
      credentials: 'include',
      headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
    });
  } catch {
    throw new SignInError('Não conseguimos falar com a área do cliente. Confira a internet e tente de novo.', 0);
  }
  if (response.status === 204) return undefined as T;
  const body = (await response.json().catch(() => null)) as { error?: string } | null;
  if (!response.ok) {
    const fallback =
      response.status === 429
        ? 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.'
        : 'Não deu certo agora. Tente de novo em instantes.';
    throw new SignInError(body?.error ?? fallback, response.status);
  }
  return body as T;
}

const post = <T>(path: string, body: unknown) => call<T>(path, { method: 'POST', body: JSON.stringify(body) });

export const api = {
  /** Quem já está conectado neste navegador (null quando ninguém). */
  me: () => call<Principal>('/me').catch((error: SignInError) => (error.status === 401 ? null : Promise.reject(error))),
  login: (email: string, password: string) => post<SignInResult>('/login', { email, password }),
  twoFactor: (challenge: string, code: string) => post<SignInResult>('/login/two-factor', { challenge, code }),
  /** Manda o link e o código; o requestId volta para o código ser digitado nesta página. */
  requestLink: (email: string) => post<{ requestId?: string }>('/magic-link', { email }),
  /** O código de 6 números do e-mail, para o pedido feito nesta página. */
  verifyCode: (requestId: string, code: string) => post<SignInResult>('/magic-link/code', { requestId, code }),
  verifyLink: (token: string) => post<SignInResult>('/magic-link/verify', { token }),
  logout: () => post<void>('/logout', {}),
};

/** Só caminhos do próprio app (`/hoje`, `/empresa?…`): nada de `//outro-site` nem URL absoluta. */
export function safeNext(next: string | null): string | null {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return null;
  return next;
}

/** Para onde levar depois de entrar: o pedido em `?next=`, ou a área da pessoa (o app decide pela raiz). */
export function destination(next: string | null): string {
  return `${APP_URL}${safeNext(next) ?? '/'}`;
}
