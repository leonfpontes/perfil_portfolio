/**
 * O que a página de entrada guarda neste aparelho para poupar passos:
 * - o último e-mail usado (localStorage), para não digitar de novo;
 * - o pedido em andamento (sessionStorage, 15 minutos), para quem vai ao app de e-mail e volta: a
 *   página recarregada continua esperando o código, sem pedir outro.
 * Nada disso é segredo (o código e o link só existem no e-mail); tudo sai no "usar outro e-mail".
 */

const EMAIL_KEY = 'lp:entrar:email';
const PEDIDO_KEY = 'lp:entrar:pedido';
/** O mesmo prazo do código e do link. */
export const VALIDADE_MS = 15 * 60 * 1000;

export interface Pedido {
  email: string;
  requestId: string;
  /** Quando o e-mail saiu (ms): conta a espera para reenviar e a validade. */
  sentAt: number;
}

function ler(storage: () => Storage, key: string): string | null {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
}

function gravar(storage: () => Storage, key: string, value: string | null) {
  try {
    if (value === null) storage().removeItem(key);
    else storage().setItem(key, value);
  } catch {
    // Navegação privada ou armazenamento bloqueado: a página só não lembra.
  }
}

export const emailLembrado = () => ler(() => localStorage, EMAIL_KEY) ?? '';
export const lembrarEmail = (email: string) => gravar(() => localStorage, EMAIL_KEY, email);

export function pedidoEmAndamento(agora = Date.now()): Pedido | null {
  const raw = ler(() => sessionStorage, PEDIDO_KEY);
  if (!raw) return null;
  try {
    const pedido = JSON.parse(raw) as Pedido;
    return pedido.requestId && agora - pedido.sentAt < VALIDADE_MS ? pedido : null;
  } catch {
    return null;
  }
}

export const guardarPedido = (pedido: Pedido | null) =>
  gravar(() => sessionStorage, PEDIDO_KEY, pedido ? JSON.stringify(pedido) : null);

/** O atalho para a caixa de entrada, pelos provedores mais comuns (busca pelo remetente do app). */
export function caixaDeEntrada(email: string): { nome: string; href: string } | null {
  const dominio = email.split('@')[1]?.toLowerCase() ?? '';
  const busca = encodeURIComponent('from:app.leopontes.com.br');
  if (/^(gmail|googlemail)\.com$/.test(dominio))
    return { nome: 'Gmail', href: `https://mail.google.com/mail/u/0/#search/${busca}` };
  if (/^(outlook|hotmail|live|msn)\.(com|com\.br)$/.test(dominio))
    return { nome: 'Outlook', href: 'https://outlook.live.com/mail/0/' };
  if (/^(icloud|me|mac)\.com$/.test(dominio)) return { nome: 'iCloud Mail', href: 'https://www.icloud.com/mail' };
  if (/^yahoo\.(com|com\.br)$/.test(dominio)) return { nome: 'Yahoo Mail', href: 'https://mail.yahoo.com/' };
  return null;
}
