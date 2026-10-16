/** Seta tipográfica — mantém o tom editorial no lugar de ícones decorativos. */
export function Arrow({ direction = 'right' }: { direction?: 'right' | 'left' | 'up-right' }) {
  const glyph = { right: '→', left: '←', 'up-right': '↗' }[direction];
  return (
    <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">
      {glyph}
    </span>
  );
}
