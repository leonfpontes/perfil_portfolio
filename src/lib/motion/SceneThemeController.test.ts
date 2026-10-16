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

