import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/** Ponto único de registro dos plugins — importe o GSAP sempre daqui. */
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Condições de `gsap.matchMedia()`. Toda animação de scroll só existe com
 * `motion`; pins horizontais só existem com `desktop`. Fora delas, o site
 * cai no layout estático (acessível e sem movimento).
 */
export const MEDIA = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
