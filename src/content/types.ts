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
  | 'ofertas'
  | 'perfil'
  | 'mentoria'
  | 'jornada'
  | 'processo'
  | 'diagnostico'
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

/** Item do menu: uma página do site (ou a âncora de contato, presente em todas). */
export interface NavItem {
  id: 'mentoring' | 'diagnostic' | 'about' | 'contact';
  label: string;
}

export interface Navigation {
  items: NavItem[];
  /** Rótulo da página inicial (trilha de navegação e 404). */
  home: string;
  cta: string;
  /** Link para a Área do cliente (/entrar), onde mentorados e empresas entram. */
  clientArea: string;
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
  /** Acima das duas "portas" (mentoria e diagnóstico), que vêm de `offer.plans`. */
  offersLabel: string;
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
  /** Preço com a unidade, numa linha (ex.: "R$ 997/mês"), para o hero e o SEO. */
  priceShort: string;
  priceNote: string;
  regularPrice: string;
  features: string[];
  /** O que o preço inclui, em itens curtos: o quadro de vidro do hero da página da oferta. */
  includes: string[];
  cta: string;
  /** Link para a página da oferta (na página inicial). */
  detailCta: string;
  highlighted: boolean;
  whatsappMessage: string;
}

export interface Offer extends SectionHeading {
  /** Link curto sob cada plano, para quem prefere marcar uma conversa antes. */
  bookingHint: string;
  founderNote: string;
  /** Rótulo do quadro "o que o preço inclui" no hero das páginas de oferta. */
  includesTitle: string;
  plans: Plan[];
}

export interface JourneyStep {
  title: string;
  description: string;
}

/** Etapas em "gates" (G1–G4) e a lista do que a oferta não é. */
export interface Journey extends SectionHeading {
  steps: JourneyStep[];
  isNot: { title: string; items: string[] };
}

/** Abertura das páginas internas: o H1 da página. */
export interface PageHeroCopy {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  /** Régua de fatos rápidos abaixo do título (formato, duração, preço…). */
  facts: { label: string; value: string }[];
}

export interface MentoringPage {
  meta: Meta;
  hero: PageHeroCopy;
  scope: SectionHeading & {
    audienceTitle: string;
    audience: string[];
    topicsTitle: string;
    topics: string[];
  };
  journey: Journey;
  faq: Faq;
}

export interface DiagnosticPage {
  meta: Meta;
  hero: PageHeroCopy;
  process: Journey;
  deliverables: SectionHeading & {
    itemsTitle: string;
    items: { title: string; description: string }[];
  };
  faq: Faq;
}

export interface AboutPage {
  meta: Meta;
}

export interface HomePage {
  meta: Meta;
  /** "Quem conduz": resumo do perfil, com link para /sobre. */
  profile: SectionHeading & { cta: string };
}

export interface NotFoundPage {
  meta: Meta;
  eyebrow: string;
  title: string;
  description: string;
  linksTitle: string;
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
  /** Nome de quem recomendou, como aparece no LinkedIn. */
  name: string;
  /** Perfil público de quem recomendou. */
  linkedin: string;
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
    /** Botão da agenda (Google Agenda) — só aparece se `profile.bookingUrl` estiver definido. */
    booking: string;
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
  imageCredits: string;
}

export interface SiteContent {
  locale: Locale;
  nav: Navigation;
  home: HomePage;
  mentoringPage: MentoringPage;
  diagnosticPage: DiagnosticPage;
  aboutPage: AboutPage;
  notFound: NotFoundPage;
  hero: Hero;
  offer: Offer;
  services: Services;
  about: About;
  products: Products;
  experience: Experience;
  skills: Skills;
  education: Education;
  testimonials: Testimonials;
  contact: Contact;
  footer: Footer;
  ui: UiStrings;
}
