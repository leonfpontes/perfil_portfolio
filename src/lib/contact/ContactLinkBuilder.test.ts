import { describe, expect, it } from 'vitest';
import { ContactLinkBuilder } from './ContactLinkBuilder';

const builder = new ContactLinkBuilder({ email: 'leo@example.com', whatsapp: '+55 (16) 99109-1234' });

describe('ContactLinkBuilder', () => {
  it('normaliza o telefone e gera link wa.me sem mensagem', () => {
    expect(builder.whatsapp()).toBe('https://wa.me/5516991091234');
  });

  it('codifica a mensagem do WhatsApp', () => {
    expect(builder.whatsapp('Olá! Mentoria & consultoria?')).toBe(
      'https://wa.me/5516991091234?text=Ol%C3%A1!%20Mentoria%20%26%20consultoria%3F',
    );
  });

  it('gera mailto com assunto usando %20 para espaços', () => {
    expect(builder.email('Contato pelo site')).toBe('mailto:leo@example.com?subject=Contato%20pelo%20site');
  });

  it('gera mailto simples quando não há assunto', () => {
    expect(builder.email()).toBe('mailto:leo@example.com');
  });

  it('formata o telefone para exibição', () => {
    expect(builder.displayPhone()).toBe('+55 16 99109-1234');
  });

  it('rejeita números inválidos', () => {
    expect(() => new ContactLinkBuilder({ email: 'a@b.c', whatsapp: '123' })).toThrow(/inválido/);
  });
});
