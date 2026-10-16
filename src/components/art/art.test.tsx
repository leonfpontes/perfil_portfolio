import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createNoise } from '@/lib/art/noise';
import { createRandom } from '@/lib/art/random';
import { FlowField, GenerativeCover, Halftone, coverPainters, type CoverVariant } from './index';

describe('arte generativa', () => {
  it('FlowField renderiza um canvas decorativo', () => {
    const { container } = render(<FlowField seed="teste" density={0.5} className="absolute inset-0" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  it('Halftone expõe o texto alternativo via role="img"', () => {
    render(<Halftone src="/foto.jpg" alt="Retrato de Leonardo" />);
    expect(screen.getByRole('img', { name: 'Retrato de Leonardo' })).toBeInTheDocument();
  });

  it('Halftone aceita progresso controlado', () => {
    render(<Halftone src="/foto.jpg" alt="Retrato" progress={0.5} cell={6} />);
    expect(screen.getByRole('img', { name: 'Retrato' })).toBeInTheDocument();
  });

  it.each(Object.keys(coverPainters) as CoverVariant[])('GenerativeCover "%s" renderiza', (variant) => {
    render(<GenerativeCover variant={variant} label={`Capa ${variant}`} />);
    expect(screen.getByRole('img', { name: `Capa ${variant}` })).toBeInTheDocument();
  });

  it('GenerativeCover sem label é decorativa', () => {
    const { container } = render(<GenerativeCover variant="rings" />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});

/** Contexto 2D falso: aceita qualquer chamada, para exercitar os painters sem canvas real. */
function fakeContext(): CanvasRenderingContext2D {
  const target: Record<string, unknown> = {};
  return new Proxy(target, {
    get: (obj, key) => (key in obj ? obj[key as string] : () => undefined),
    set: (obj, key, value) => {
      obj[key as string] = value;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
}

describe('coverPainters', () => {
  it.each(Object.keys(coverPainters) as CoverVariant[])('"%s" desenha sem erros', (variant) => {
    const frame = {
      time: 3,
      dt: 0.016,
      width: 480,
      height: 320,
      pointer: { x: 0, y: 0, active: false },
      first: true,
      still: false,
    };
    const env = {
      rnd: createRandom(variant),
      noise: createNoise(variant),
      colors: { ink: '#111', signal: '#e33', mono: 'monospace' },
    };
    expect(() => coverPainters[variant](fakeContext(), frame, env)).not.toThrow();
  });
});

describe('com contexto 2D simulado', () => {
  it('FlowField e GenerativeCover executam o quadro inicial', () => {
    const getContext = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(function (this: HTMLCanvasElement) {
        const ctx = fakeContext();
        (ctx as unknown as { canvas: HTMLCanvasElement }).canvas = this;
        return ctx as never;
      });
    const rect = vi
      .spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({ width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600, x: 0, y: 0, toJSON: () => ({}) });
    try {
      expect(() => render(<FlowField seed="mock" />)).not.toThrow();
      for (const variant of Object.keys(coverPainters) as CoverVariant[]) {
        expect(() => render(<GenerativeCover variant={variant} />)).not.toThrow();
      }
      expect(getContext).toHaveBeenCalled();
    } finally {
      getContext.mockRestore();
      rect.mockRestore();
    }
  });
});
