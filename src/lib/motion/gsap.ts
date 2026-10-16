import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { buildMediaQueries, readMotionPref } from './motionPreference';

/** Ponto único de registro dos plugins — importe o GSAP sempre daqui. */
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Condições de `gsap.matchMedia()`, já considerando a preferência do visitante
 * (ver motionPreference.ts). `motion`/`desktop`/`mobile` = coreografias com
 * deslocamento, pins e trilhos; `wide`/`narrow` = efeitos suaves (opacidade e
 * cor), que também valem no modo suave.
 */
export const MEDIA = buildMediaQueries(readMotionPref());

export { gsap, ScrollTrigger, SplitText, useGSAP };
