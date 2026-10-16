import { createContext, useContext, type ReactNode } from 'react';
import { profile } from '@/content/profile';
import { createAnalyticsTracker, type AnalyticsTracker } from './analytics/AnalyticsTracker';
import { ContactLinkBuilder } from './contact/ContactLinkBuilder';

/**
 * Container leve de injeção de dependências.
 * Componentes pedem serviços via `useServices()`; testes injetam fakes
 * passando `value` ao `ServicesProvider`.
 */
export interface AppServices {
  analytics: AnalyticsTracker;
  contact: ContactLinkBuilder;
}

export function createDefaultServices(): AppServices {
  return {
    analytics: createAnalyticsTracker(),
    contact: new ContactLinkBuilder({ email: profile.email, whatsapp: profile.whatsapp }),
  };
}

const ServicesContext = createContext<AppServices | null>(null);

export function ServicesProvider({ value, children }: { value: AppServices; children: ReactNode }) {
  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

export function useServices(): AppServices {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error('useServices deve ser usado dentro de <ServicesProvider>.');
  return ctx;
}
