/**
 * Dados de identidade independentes de idioma (nome, canais, URLs, imagens).
 * Fonte única de verdade: alterar aqui reflete em todo o site e nos metadados.
 */
export const profile = {
  name: 'Leonardo Fonseca Pontes',
  shortName: 'Leonardo Pontes',
  brand: 'LP · Product & Portfolio',
  /** Posicionamento nos dados estruturados (Person.jobTitle). O cargo na ATRA fica na trajetória. */
  jobTitle: 'Mentor e consultor em Produto, PMO e Portfólio',
  siteUrl: 'https://www.leopontes.com.br',
  email: 'contato@leopontes.com.br',
  /** Apenas dígitos, com DDI — usado para montar links do WhatsApp. */
  whatsapp: '5516991091234',
  linkedin: 'https://www.linkedin.com/in/leonardo-fonseca-pontes-465740103/',
  github: 'https://github.com/leonfpontes',
  /** Perfil profissional (@pontes_brain): conteúdo diário sobre produto e portfólio. */
  instagram: 'https://www.instagram.com/pontes_brain/',
  instagramHandle: '@pontes_brain',
  /**
   * Página de agendamento do Google Agenda ("Agenda de horários" → compartilhar
   * → link). Com `null`, os botões de agenda não aparecem e o site usa só
   * WhatsApp e e-mail.
   */
  bookingUrl: null as string | null,
  images: {
    portrait: '/images/leonardo-portrait.webp',
    avatar: '/images/leonardo-avatar.webp',
  },
} as const;

export type Profile = typeof profile;

/** Banco de imagens (Unsplash License — uso livre, sem atribuição obrigatória). */
export const stockImages = {
  team: '/images/team.webp',
  workshop: '/images/workshop.webp',
} as const;
