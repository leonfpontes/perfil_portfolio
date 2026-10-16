import { describe, expect, it } from 'vitest';
import { SceneThemeController, type Tone, type ToneColors } from './SceneThemeController';

const palette: Record<Tone, ToneColors> = {
  cal: { '--background': 'white', '--foreground': 'black', '--signal': 'blue', '--signal-foreground': 'white' },
  mata: { '--background': 'black', '--foreground': 'white', '--signal': 'orange', '--signal-foreground': 'black' },
  palha: { '--background': 'tan', '--foreground': 'black', '--signal': 'blue', '--signal-foreground': 'white' },
  ocre: { '--background': 'gold', '--foreground': 'black', '--signal': 'blue', '--signal-foreground': 'white' },
  cobalto: { '--background': 'navy', '--foreground': 'white', '--signal': 'orange', '--signal-foreground': 'black' },
  anil: { '--background': 'indigo', '--foreground': 'white', '--signal': 'orange', '--signal-foreground': 'black' },
};

function setup() {
  const root = document.createElement('div');
  const controller = new SceneThemeController(root, (tone) => palette[tone]);
  return { root, controller };
}

describe('SceneThemeController', () => {
  it('aplica as 4 variáveis do tom imediatamente', () => {
    const { root, controller } = setup();
    controller.apply('mata', { immediate: true });
    expect(root.style.getPropertyValue('--background')).toBe('black');
    expect(root.style.getPropertyValue('--signal')).toBe('orange');
    expect(controller.activeTone).toBe('mata');
  });

  it('interpola via color-mix durante a transição', () => {
    const { root, controller } = setup();
    controller.apply('cal', { immediate: true });
    controller.apply('mata', { duration: 10 });
    // Logo após iniciar, o valor é uma mistura entre os dois tons (ou o tom de origem).
    const bg = root.style.getPropertyValue('--background');
    expect(bg === 'white' || bg.startsWith('color-mix(in oklab, white')).toBe(true);
    expect(controller.activeTone).toBe('mata');
  });

  it('ignora reaplicar o mesmo tom', () => {
    const { root, controller } = setup();
    controller.apply('palha', { immediate: true });
    root.style.setProperty('--background', 'marker');
    controller.apply('palha');
    expect(root.style.getPropertyValue('--background')).toBe('marker');
  });

  it('dispose devolve o controle ao stylesheet', () => {
    const { root, controller } = setup();
    controller.apply('anil', { immediate: true });
    controller.dispose();
    expect(root.style.getPropertyValue('--background')).toBe('');
    expect(controller.activeTone).toBeNull();
  });
});

describe('lightnessOf', () => {
  it('lê o L de cores oklch (decimal ou %)', async () => {
    const { lightnessOf } = await import('./SceneThemeController');
    expect(lightnessOf('oklch(0.19 0.008 70)')).toBeCloseTo(0.19);
    expect(lightnessOf('oklch(58% 0.19 36)')).toBeCloseTo(0.58);
    expect(lightnessOf('red')).toBeNull();
  });
});

describe('cortina', () => {
  it('usa a cortina em inversões claro↔escuro, mantendo o fundo antigo até cobrir a tela', async () => {
    const { SceneThemeController } = await import('./SceneThemeController');
    const tones = {
      cal: { '--background': 'oklch(0.95 0 0)', '--foreground': 'oklch(0.2 0 0)', '--signal': 'red', '--signal-foreground': 'white' },
      mata: { '--background': 'oklch(0.2 0 0)', '--foreground': 'oklch(0.95 0 0)', '--signal': 'orange', '--signal-foreground': 'black' },
    } as const;
    const root = document.createElement('div');
    const curtain = document.createElement('div');
    const controller = new SceneThemeController(root, (t) => tones[t as 'cal' | 'mata'], curtain);
    controller.apply('cal', { immediate: true });
    controller.apply('mata');
    // A cortina é ativada; o fundo da página continua o antigo até ela cobrir tudo.
    expect(curtain.style.opacity).toBe('1');
    expect(root.style.getPropertyValue('--background')).toBe('oklch(0.95 0 0)');
  });
});
