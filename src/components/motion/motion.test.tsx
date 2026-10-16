import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { formatNumeric, parseNumeric } from './CountUp';
import { sceneSectionOf } from './Scene';

describe('CountUp — parse/format', () => {
  it.each([
    ['R$ 2.500', { prefix: 'R$ ', number: 2500, separator: '.', suffix: '' }],
    ['R$ 2,500', { prefix: 'R$ ', number: 2500, separator: ',', suffix: '' }],
    ['40+', { prefix: '', number: 40, separator: '', suffix: '+' }],
    ['R$ 997', { prefix: 'R$ ', number: 997, separator: '', suffix: '' }],
  ])('interpreta "%s"', (input, expected) => {
    expect(parseNumeric(input)).toEqual(expected);
  });

  it('retorna null sem número', () => {
    expect(parseNumeric('em operação')).toBeNull();
  });

  it('formata com o separador original', () => {
    expect(formatNumeric(1497.4, '.')).toBe('1.497');
    expect(formatNumeric(2500, ',')).toBe('2,500');
    expect(formatNumeric(8, '')).toBe('8');
  });
});

describe('sceneSectionOf', () => {
  it('encontra o <section> da cena a partir de um descendente', () => {
    const { container } = render(
      <div data-scene="x">
        <section id="x">
          <div>
            <span data-testid="leaf" />
          </div>
        </section>
      </div>,
    );
    const leaf = container.querySelector('[data-testid="leaf"]');
    expect(sceneSectionOf(leaf)?.id).toBe('x');
    expect(sceneSectionOf(null)).toBeNull();
  });
});
