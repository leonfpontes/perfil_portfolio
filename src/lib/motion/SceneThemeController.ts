import { gsap } from './gsap';

export type Tone = 'paper' | 'sand' | 'ink' | 'signal' | 'night';

/** As únicas variáveis interpoladas — o restante da paleta deriva delas (globals.css). */
const TONE_VARS = ['--background', '--foreground', '--signal', '--signal-foreground'] as const;
type ToneVar = (typeof TONE_VARS)[number];
export type ToneColors = Record<ToneVar, string>;

/** Lê as cores de um tom a partir do CSS (fonte da verdade continua sendo o stylesheet). */
export type ToneReader = (tone: Tone) => ToneColors;

/**
 * Transição de cor entre cenas.
 *
 * Em vez de converter oklch → rgb em JS, delega a interpolação ao navegador:
 * durante o tween cada variável vira `color-mix(in oklab, DE p%, PARA)`.
 * Ao final, grava o valor "limpo" do tom de destino.
 */
export class SceneThemeController {
  private current: ToneColors | null = null;
  private tone: Tone | null = null;
  private tween: gsap.core.Tween | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly readTone: ToneReader,
  ) {}

  get activeTone(): Tone | null {
    return this.tone;
  }

  apply(tone: Tone, { immediate = false, duration = 0.9 } = {}): void {
    if (tone === this.tone && !immediate) return;
    const target = this.readTone(tone);
    const from = this.current ?? target;
    this.tone = tone;
    this.tween?.kill();

    if (immediate || TONE_VARS.every((v) => from[v] === target[v])) {
      this.write(target);
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

  /** Reaplica o tom atual (ex.: após alternar claro/escuro, que muda os valores do tom). */
  refresh(): void {
    if (this.tone) this.apply(this.tone, { immediate: true });
  }

  /** Remove os estilos inline, devolvendo o controle ao stylesheet. */
  dispose(): void {
    this.tween?.kill();
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
