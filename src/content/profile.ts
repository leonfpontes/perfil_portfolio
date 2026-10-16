/**
 * Dados de identidade independentes de idioma (nome, canais, URLs, imagens).
 * Fonte única de verdade: alterar aqui reflete em todo o site e nos metadados.
 */
export const profile = {
  name: 'Leonardo Fonseca Pontes',
  shortName: 'Leonardo Pontes',
  brand: 'LP | Produto & Portfólio',
  siteUrl: 'https://www.leopontes.com.br',
  email: 'leonfpontes@gmail.com',
  /** Apenas dígitos, com DDI — usado para montar links do WhatsApp. */
  whatsapp: '5516991091234',
  linkedin: 'https://www.linkedin.com/in/leonardo-fonseca-pontes-465740103/',
  github: 'https://github.com/leonfpontes',
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
