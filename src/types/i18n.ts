/**
 * i18n Type Definitions
 */

export type LanguageCode = 'pt-br' | 'en';

export interface Translation {
  // Brand
  brand: {
    name: string;
    photoAlt: string;
    role: string;
  };

  // Document metadata
  document: {
    title: string;
    description: string;
  };

  // Navigation
  nav: {
    about: string;
    experience: string;
    education: string;
    skills: string;
    certifications: string;
    testimonials: string;
    contact: string;
    primaryAria: string;
  };

  // Language switcher
  language: {
    switcherAria: string;
    portuguese: {
      label: string;
      title: string;
      text: string;
    };
    english: {
      label: string;
      title: string;
      text: string;
    };
  };

  // Hero section
  hero: {
    badge: string;
    title: string;
    description: string;
    portraitAlt: string;
    photoAlt: string;
    contactCta: string;
    linkedinCta: string;
    panelAria: string;
    statsAria: string;
  };

  // Stats
  stats: {
    projects: {
      value: string;
      label: string;
    };
    years: {
      value: string;
      label: string;
    };
    pillars: {
      value: string;
      label: string;
    };
  };

  // About section
  about: {
    eyebrow: string;
    title: string;
    description: string;
    motivations: {
      title: string;
      item1: string;
      item2: string;
    };
    focus: {
      title: string;
      item1: string;
      item2: string;
    };
    competencies: {
      title: string;
      item1: string;
      item2: string;
    };
  };

  // Experience section
  experience: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{
      period: string;
      title: string;
      location: string;
      items: string[];
    }>;
  };

  // Skills section
  skills: {
    eyebrow: string;
    title: string;
    description: string;
    leadership: {
      title: string;
      item1: string;
      item2: string;
      item3: string;
    };
    agility: {
      title: string;
      item1: string;
      item2: string;
      item3: string;
    };
    value: {
      title: string;
      item1: string;
      item2: string;
      item3: string;
    };
  };

  // Competency radar
  competencyRadar: {
    title: string;
    ariaLabel: string;
    ariaDescription: string;
    datasetLabel: string;
    labels: string[];
    legend: {
      leadership: { title: string; desc: string };
      governance: { title: string; desc: string };
      product: { title: string; desc: string };
      agility: { title: string; desc: string };
      communication: { title: string; desc: string };
    };
  };

  // Education section
  education: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{
      period: string;
      title: string;
      location: string;
      summary: string;
    }>;
  };

  // Certifications section
  certifications: {
    eyebrow: string;
    title: string;
    description: string;
    carousel: {
      itemLabel: string;
      indicatorPrefix: string;
      prevAria: string;
      nextAria: string;
      indicatorsAria: string;
      slides: Array<{
        label: string;
      }>;
    };
    items: Array<{
      title: string;
      issuer: string;
      tag: string;
    }>;
  };

  // Testimonials section
  testimonials: {
    eyebrow: string;
    title: string;
    description: string;
    carousel: {
      itemLabel: string;
      indicatorPrefix: string;
      prevAria: string;
      nextAria: string;
      indicatorsAria: string;
    };
    items: Array<{
      name: string;
      role: string;
      context: string;
      quote: string;
      competencies: string;
      relationship: string;
    }>;
  };

  // Contact section
  contact: {
    title: string;
    description: string;
    emailCta: string;
    whatsappCta: string;
    linkedinCta: string;
  };

  // Quick actions (if used)
  quickActions?: {
    eyebrow: string;
    title: string;
    description: string;
    emailDescription: string;
    linkedinDescription: string;
    phoneDescription: string;
  };

  // Details (if used)
  details?: {
    email: { label: string; value: string };
    phone: { label: string; value: string };
    location: { label: string; value: string };
    languages: { label: string; value: string };
    linkedin: { label: string; value: string };
  };

  // Footer
  footer: {
    owner: string;
    rights: string;
  };
}

export type TranslationKey = string;

export interface Translations {
  [key: string]: Translation;
}
