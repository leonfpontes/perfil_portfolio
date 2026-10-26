/**
 * Luz do vidro (LP Noir) — arquivo IDÊNTICO no site e no app.
 *
 * Um único listener de ponteiro e um laço de quadros que só roda enquanto a luz se move.
 * Para cada `.glass` perto do mouse, o centro da luz (--lx/--ly) parte de um ponto
 * atrás do componente (centro horizontal, um pouco acima do topo) e se inclina LEAN
 * na direção do ponteiro, com suavização EASE: o cursor nunca é o centro da luz.
 * O halo (--halo-x/--halo-y) acompanha esse deslocamento. Cada `[data-glass-light]`
 * desliza a sua `.glass-spot` alguns px (--px/--py, de -1 a 1). O CSS (lp-noir.css)
 * faz o resto. Sem mouse, não liga nada. Devolve a função que desliga.
 */
const LEAN = 0.3;
const EASE = 0.12;
const REACH = 160;

export function startGlassLight(root: Document = document): () => void {
  if (typeof window === 'undefined' || !window.matchMedia?.('(hover: hover)').matches) return () => {};
  let px = -1e4;
  let py = -1e4;
  let raf = 0;
  const pos = new WeakMap<HTMLElement, { x: number; y: number }>();

  const tick = () => {
    let moving = false;
    // Primeiro todas as leituras de layout, depois todas as escritas: intercalar as
    // duas força o navegador a recalcular o layout a cada elemento.
    const glasses = [...root.querySelectorAll<HTMLElement>('.glass')].map((el) => ({ el, r: el.getBoundingClientRect() }));
    const stages = [...root.querySelectorAll<HTMLElement>('[data-glass-light]')].map((stage) => ({ stage, r: stage.getBoundingClientRect() }));

    glasses.forEach(({ el, r }) => {
      const near = px > r.left - REACH && px < r.right + REACH && py > r.top - REACH && py < r.bottom + REACH;
      const homeX = r.width / 2;
      const homeY = -r.height * 0.15;
      const tx = near ? homeX + (px - r.left - homeX) * LEAN : homeX;
      const ty = near ? homeY + (py - r.top - homeY) * LEAN : homeY;
      const p = pos.get(el) ?? { x: homeX, y: homeY };
      p.x += (tx - p.x) * EASE;
      p.y += (ty - p.y) * EASE;
      pos.set(el, p);
      if (Math.abs(tx - p.x) > 0.3 || Math.abs(ty - p.y) > 0.3) moving = true;
      el.style.setProperty('--lx', `${p.x.toFixed(1)}px`);
      el.style.setProperty('--ly', `${p.y.toFixed(1)}px`);
      el.style.setProperty('--halo-x', `${(((p.x - homeX) / (r.width / 2 || 1)) * 8).toFixed(1)}px`);
      el.style.setProperty('--halo-y', `${(((p.y - r.height / 2) / (r.height / 2 || 1)) * 8).toFixed(1)}px`);
    });
    stages.forEach(({ stage, r }) => {
      if (px < r.left || px > r.right || py < r.top || py > r.bottom) return;
      const spot = stage.querySelector<HTMLElement>('.glass-spot');
      spot?.style.setProperty('--px', (((px - r.left) / r.width) * 2 - 1).toFixed(3));
      spot?.style.setProperty('--py', (((py - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    raf = moving ? requestAnimationFrame(tick) : 0;
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    px = e.clientX;
    py = e.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  return () => {
    window.removeEventListener('pointermove', onMove);
    if (raf) cancelAnimationFrame(raf);
  };
}
