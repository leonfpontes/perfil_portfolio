import { gsap } from './gsap';

/** Tons de cena — a paleta do modernismo brasileiro (ver globals.css). */
export type Tone = 'cal' | 'palha' | 'mata' | 'ocre' | 'cobalto' | 'anil';

/** As únicas variáveis interpoladas — o restante da paleta deriva delas (globals.css). */
const TONE_VARS = ['--background', '--foreground', '--signal', '--signal-foreground'] as const;
type ToneVar = (typeof TONE_VARS)[number];
export type ToneColors = Record<ToneVar, string>;

/** Lê as cores de um tom a partir do CSS (fonte da verdade continua sendo o stylesheet). */
export type ToneReader = (tone: Tone) => ToneColors;

/** Diferença de luminosidade (oklch L) a partir da qual a mistura vira "lama". */
const WIPE_THRESHOLD = 0.3;

/** Lê o L de `oklch(L …)`; null se o formato for outro. */
export function lightnessOf(color: string): number | null {
  const m = color.match(/oklch\(\s*([\d.]+)(%?)/i);
  if (!m) return null;
  const v = Number(m[1]);
  return m[2] ? v / 100 : v;
}

export type ScrollDirection = 1 | -1;

/**
 * Transição de cor entre cenas, com duas estratégias:
 *
 * - **mistura**: tons próximos são interpolados pelo próprio navegador
 *   (`color-mix(in oklab, DE p%, PARA)`), sem converter oklch em JS;
 * - **cortina**: inversões (claro↔escuro) passariam por um cinza sujo no meio,
 *   então o novo fundo varre a tela numa camada fixa atrás do conteúdo, no
 *   sentido do scroll, e a tinta troca na metade do caminho.
 */
export class SceneThemeController {
  private current: ToneColors | null = null;
  private tone: Tone | null = null;
  private tween: gsap.core.Tween | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly readTone: ToneReader,
    /** Camada fixa atrás do conteúdo usada pela cortina (opcional). */
    private readonly curtain: HTMLElement | null = null,
  ) {}

  get activeTone(): Tone | null {
    return this.tone;
  }

  apply(tone: Tone, { immediate = false, duration = 0.9, direction = 1 as ScrollDirection, wipe = true } = {}): void {
    if (tone === this.tone && !immediate) return;
    const target = this.readTone(tone);
    const from = this.current ?? target;
    this.tone = tone;
    this.tween?.kill();

    if (immediate || TONE_VARS.every((v) => from[v] === target[v])) {
      this.write(target);
      return;
    }

    if (wipe && this.curtain && this.needsWipe(from, target)) {
      this.wipe(this.curtain, target, direction);
      return;
    }

    const progress = { t: 0 };
    this.tween = gsap.to(progress, {
      t: 1,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => this.write(mix(from, target, progress.t)),
      onComplete: () => this.write(target),
    });
  }

  private needsWipe(from: ToneColors, to: ToneColors): boolean {
    const a = lightnessOf(from['--background']);
    const b = lightnessOf(to['--background']);
    return a !== null && b !== null && Math.abs(a - b) > WIPE_THRESHOLD;
  }

  private wipe(curtain: HTMLElement, target: ToneColors, direction: ScrollDirection): void {
    // Descendo, o novo fundo sobe de baixo; subindo, desce de cima.
    const hidden = direction === 1 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)';
    const from = this.current ?? target;
    curtain.style.background = target['--background'];
    let inked = false;
    const progress = { t: 0 };
    gsap.set(curtain, { clipPath: hidden, autoAlpha: 1 });
    this.tween = gsap.to(progress, {
      t: 1,
      duration: 0.75,
      ease: 'expo.inOut',
      onUpdate: () => {
        curtain.style.clipPath = direction === 1 ? `inset(${(1 - progress.t) * 100}% 0% 0% 0%)` : `inset(0% 0% ${(1 - progress.t) * 100}% 0%)`;
        // A tinta troca no meio da varredura; o fundo só no fim (a cortina já cobre tudo).
        if (!inked && progress.t > 0.5) {
          inked = true;
          this.write({ ...target, '--background': from['--background'] });
        }
      },
      onComplete: () => {
        this.write(target);
        gsap.set(curtain, { autoAlpha: 0, clipPath: hidden });
      },
    });
  }

  /** Reaplica o tom atual (ex.: após alternar claro/escuro, que muda os valores do tom). */
  refresh(): void {
    if (this.tone) this.apply(this.tone, { immediate: true });
  }

  /** Remove os estilos inline, devolvendo o controle ao stylesheet. */
  dispose(): void {
    this.tween?.kill();
    if (this.curtain) gsap.set(this.curtain, { autoAlpha: 0 });
    TONE_VARS.forEach((v) => this.root.style.removeProperty(v));
    this.current = null;
    this.tone = null;
  }

  /**
   * Durante o tween `current` guarda a expressão de mistura, para que uma
   * interrupção parta exatamente da cor visível naquele instante.
   */
  private write(colors: ToneColors): void {
    TONE_VARS.forEach((v) => this.root.style.setProperty(v, colors[v]));
    this.current = colors;
  }
}

function mix(from: ToneColors, to: ToneColors, t: number): ToneColors {
  const pct = ((1 - t) * 100).toFixed(2);
  return Object.fromEntries(
    TONE_VARS.map((v) => [v, from[v] === to[v] ? to[v] : `color-mix(in oklab, ${from[v]} ${pct}%, ${to[v]})`]),
  ) as ToneColors;
}

/** Leitor padrão: cria (uma vez) elementos-sonda `.tone-*` e lê as variáveis computadas. */
export function createDomToneReader(doc: Document = document): ToneReader {
  const probes = new Map<Tone, HTMLElement>();
  return (tone) => {
    let probe = probes.get(tone);
    if (!probe) {
      probe = doc.createElement('div');
      probe.className = `tone-${tone}`;
      probe.setAttribute('aria-hidden', 'true');
      probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
      doc.body.appendChild(probe);
      probes.set(tone, probe);
    }
    const style = getComputedStyle(probe);
    return Object.fromEntries(TONE_VARS.map((v) => [v, style.getPropertyValue(v).trim()])) as ToneColors;
  };
}
