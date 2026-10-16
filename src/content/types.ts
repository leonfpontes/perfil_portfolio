/**
 * Modelo de domínio do conteúdo do site.
 *
 * Todo texto exibido vem de um objeto `SiteContent` (um por idioma).
 * Os componentes de seção dependem apenas destes tipos — nunca de strings
 * soltas — o que mantém a UI desacoplada do conteúdo (Dependency Inversion)
 * e garante, em tempo de compilação, que os idiomas tenham o mesmo formato.
 */

export type Locale = 'pt-BR' | 'en';

export type SectionId =
  | 'inicio'
  | 'mentoria'
  | 'jornada'
  | 'servicos'
  | 'sobre'
  | 'produtos'
  | 'experiencia'
  | 'competencias'
  | 'formacao'
  | 'depoimentos'
  | 'faq'
  | 'contato';

export interface Link {
  label: string;
  href: string;
}

export interface SectionHeading {
  eyebrow: string;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Meta {
  title: string;
  description: string;
}

export interface Navigation {
  items: { id: SectionId; label: string }[];
  cta: string;
  toggleTheme: string;
  toggleLanguage: string;
  openMenu: string;
  skipToContent: string;
}

export interface Hero {
  badge: string;
  greeting: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  portraitAlt: string;
  availability: string;
  stats: Stat[];
  trustLine: string;
  trustItems: string[];
}

export interface Pillar {
  title: string;
  description: string;
}

export interface About extends SectionHeading {
  story: string[];
  pillars: Pillar[];
  facts: { label: string; value: string }[];
  imageAlt: string;
}

export type PlanTier = 'mentoring' | 'diagnostic';

export interface Plan {
  id: PlanTier;
  tag: string;
  title: string;
  description: string;
  price: string;
  priceNote: string;
  regularPrice: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  whatsappMessage: string;
}

export interface Offer extends SectionHeading {
  founderNote: string;
  plans: Plan[];
  journey: { title: string; steps: { title: string; description: string }[] };
  isNot: { title: string; items: string[] };
}

export interface Service {
  title: string;
  description: string;
  deliverables: string[];
  audience: string;
}

export interface Services extends SectionHeading {
  items: Service[];
  cta: string;
}

/** Arte generativa da capa do produto (ver components/art/covers.ts). */
export type ProductArt = 'rings' | 'gates' | 'radar' | 'contour';

export type ProductStatus = 'live' | 'internal' | 'beta' | 'sunset' | 'personal';

export interface Product {
  name: string;
  category: string;
  status: ProductStatus;
  description: string;
  highlights: string[];
  stack: string[];
  year: string;
  art: ProductArt;
  link?: Link;
}

export interface Products extends SectionHeading {
  statusLabels: Record<ProductStatus, string>;
  stackLabel: string;
  items: Product[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
  current?: boolean;
}

export interface Experience extends SectionHeading {
  currentLabel: string;
  items: ExperienceItem[];
}

export interface SkillGroup {
  id: string;
  label: string;
  description: string;
  skills: string[];
}

export interface Skills extends SectionHeading {
  groups: SkillGroup[];
}

export interface EducationItem {
  title: string;
  institution: string;
  period: string;
  description: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  tag: string;
  /** Exibe o selo "em andamento". */
  inProgress?: boolean;
}

export interface Education extends SectionHeading {
  degreesTitle: string;
  degrees: EducationItem[];
  certificationsTitle: string;
  certifications: Certification[];
  inProgressLabel: string;
}

export interface Testimonial {
  quote: string;
  role: string;
  context: string;
}

export interface Testimonials extends SectionHeading {
  items: Testimonial[];
  sourceNote: string;
}

export interface Faq extends SectionHeading {
  items: { question: string; answer: string }[];
}

export interface Contact extends SectionHeading {
  channels: {
    whatsapp: string;
    email: string;
    linkedin: string;
    github: string;
  };
  whatsappMessage: string;
  emailSubject: string;
  responseTime: string;
  location: string;
  languages: string;
}

/** Rótulos de interface reutilizados por vários componentes. */
export interface MotionStrings {
  label: string;
  gentleNotice: string;
  enableFull: string;
  reduce: string;
  followSystem: string;
  dismiss: string;
}

export interface UiStrings {
  motion: MotionStrings;
  /** Cabeçalhos (só para leitores de tela) da tabela de certificações. */
  certColumns: [string, string, string];
  readMore: string;
  readLess: string;
  seeAll: string;
  illustrativeImage: string;
  scrollHint: string;
  previous: string;
  next: string;
  of: string;
  status: string;
  year: string;
  audience: string;
  deliverables: string;
}

export interface Footer {
  tagline: string;
  rights: string;
  builtWith: string;
  imageCredits: string;
}

export interface SiteContent {
  locale: Locale;
  meta: Meta;
  nav: Navigation;
  hero: Hero;
  offer: Offer;
  services: Services;
  about: About;
  products: Products;
  experience: Experience;
  skills: Skills;
  education: Education;
  testimonials: Testimonials;
  faq: Faq;
  contact: Contact;
  footer: Footer;
  ui: UiStrings;
}
