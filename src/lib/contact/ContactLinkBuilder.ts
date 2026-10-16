/**
 * Constrói URLs de contato (WhatsApp, e-mail) a partir dos dados do perfil.
 *
 * Responsabilidade única: formatar links. Não sabe nada de UI nem de idioma —
 * as mensagens chegam prontas do conteúdo localizado.
 */
export interface ContactChannels {
  email: string;
  /** Telefone apenas com dígitos, incluindo DDI (ex.: 5516999999999). */
  whatsapp: string;
}

export class ContactLinkBuilder {
  private readonly phone: string;

  constructor(private readonly channels: ContactChannels) {
    this.phone = channels.whatsapp.replace(/\D/g, '');
    if (this.phone.length < 10) {
      throw new Error(`Número de WhatsApp inválido: "${channels.whatsapp}"`);
    }
  }

  /** Link `wa.me` com mensagem pré-preenchida (funciona em mobile e desktop). */
  whatsapp(message?: string): string {
    const base = `https://wa.me/${this.phone}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }

  /** Link `mailto:` com assunto e corpo opcionais, codificados corretamente. */
  email(subject?: string, body?: string): string {
    const params = new URLSearchParams();
    if (subject) params.set('subject', subject);
    if (body) params.set('body', body);
    // URLSearchParams usa "+" para espaço; clientes de e-mail esperam "%20".
    const query = params.toString().replace(/\+/g, '%20');
    return `mailto:${this.channels.email}${query ? `?${query}` : ''}`;
  }

  /** Número formatado para exibição: +55 16 99109-1234. */
  displayPhone(): string {
    const m = this.phone.match(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/);
    return m ? `+${m[1]} ${m[2]} ${m[3]}-${m[4]}` : `+${this.phone}`;
  }
}
