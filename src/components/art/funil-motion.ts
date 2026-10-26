/**
 * Movimento do funil de portfólio (sem React, para servir o site e o app).
 *
 * Sobre o SVG estático (Funil.tsx), um canvas anima o que o desenho conta:
 * - iniciativas entram o tempo todo pela esquerda, como cometas curtos, e correm pelas
 *   linhas; as da linha de sinal são champagne e brilham;
 * - ao cruzar um gate, a linha tracejada do gate acende no ponto de passagem;
 * - as que param num gate se apagam num anel que se expande no ponto final (barradas);
 * - cada rótulo de gate mostra a taxa de aprovação ao vivo ("G2 Business case · 62%"),
 *   semeada pela própria geometria, então já nasce com um valor coerente;
 * - com o mouse perto de um gate, o gate e o rótulo dele se destacam.
 * Pausa fora da tela e com a aba oculta. Com movimento reduzido, não liga.
 */

interface Trilha {
  pts: Float32Array; // x,y alternados, em coordenadas do viewBox
  len: number;
  ate: number; // índice do gate onde para; 4 = chega ao fim
  sinal: boolean;
  /** Distância ao longo da trilha em que cada gate é cruzado (NaN = não cruza). */
  cruza: number[];
}

interface Particula {
  t: Trilha;
  d: number;
  v: number;
  gate: number; // próximo gate a cruzar
}

interface Anel {
  x: number;
  y: number;
  age: number;
}

interface Flash {
  g: number;
  y: number;
  age: number;
}

const AMOSTRAS = 160;
const RASTRO = 70; // comprimento do cometa, em px do viewBox
const INTERVALO = 0.16; // s entre entradas

export interface FunilMotionOptions {
  /** Cor das iniciativas comuns e da tinta (padrão: marfim). */
  ink?: string;
  signal?: string;
}

export function startFunilMotion(svg: SVGSVGElement, canvas: HTMLCanvasElement, opts: FunilMotionOptions = {}): () => void {
  if (typeof window === 'undefined') return () => {};
  const reduced =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduced-motion');
  const ctx = canvas.getContext('2d');
  if (!ctx || reduced) return () => {};
  const amostra = svg.querySelector<SVGPathElement>('.funil-linhas path');
  if (!amostra || typeof amostra.getTotalLength !== 'function') return () => {};

  const ink = opts.ink ?? '241, 237, 228';
  const signal = opts.signal ?? '207, 180, 138';
  const vb = svg.viewBox.baseVal;
  const gates = Array.from(svg.querySelectorAll<SVGLineElement>('.funil-gates line')).map((l) => l.x1.baseVal.value);
  const rotulos = Array.from(svg.querySelectorAll<SVGTextElement>('.funil-gates text'));
  const taxas = rotulos.map((r) => {
    let span = r.querySelector<SVGTSpanElement>('.funil-taxa');
    if (!span) {
      span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      span.setAttribute('class', 'funil-taxa');
      r.appendChild(span);
    }
    return span;
  });

  const trilhas: Trilha[] = Array.from(svg.querySelectorAll<SVGPathElement>('.funil-linhas path[data-ate]')).map((p) => {
    const len = p.getTotalLength();
    const pts = new Float32Array(AMOSTRAS * 2);
    for (let i = 0; i < AMOSTRAS; i++) {
      const q = p.getPointAtLength((len * i) / (AMOSTRAS - 1));
      pts[i * 2] = q.x;
      pts[i * 2 + 1] = q.y;
    }
    const cruza = gates.map((gx) => {
      for (let i = 1; i < AMOSTRAS; i++) {
        if (pts[(i - 1) * 2]! < gx && pts[i * 2]! >= gx) return (len * i) / (AMOSTRAS - 1);
      }
      return Number.NaN;
    });
    return { pts, len, ate: Number(p.dataset.ate), sinal: p.classList.contains('funil-sinal'), cruza };
  });
  if (!trilhas.length) return () => {};

  // Contagem semeada pela geometria: quantas chegam a cada gate e quantas passam.
  const chegam = gates.map((_, g) => trilhas.filter((t) => t.ate >= g).length * 12);
  const passam = gates.map((_, g) => trilhas.filter((t) => t.ate > g).length * 12);
  const escreveTaxas = () =>
    taxas.forEach((s, g) => {
      s.textContent = ` · ${Math.round((passam[g]! / Math.max(1, chegam[g]!)) * 100)}%`;
    });
  escreveTaxas();

  let w = 0;
  let h = 0;
  let scale = 1;
  let ox = 0;
  let oy = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // preserveAspectRatio="xMidYMid slice"
    scale = Math.max(w / vb.width, h / vb.height);
    ox = (w - vb.width * scale) / 2;
    oy = (h - vb.height * scale) / 2;
  };

  const ponto = (t: Trilha, d: number): [number, number] => {
    const f = Math.max(0, Math.min(1, d / t.len)) * (AMOSTRAS - 1);
    const i = Math.floor(f);
    const j = Math.min(AMOSTRAS - 1, i + 1);
    const k = f - i;
    return [t.pts[i * 2]! + (t.pts[j * 2]! - t.pts[i * 2]!) * k, t.pts[i * 2 + 1]! + (t.pts[j * 2 + 1]! - t.pts[i * 2 + 1]!) * k];
  };

  const particulas: Particula[] = [];
  const aneis: Anel[] = [];
  const flashes: Flash[] = [];
  let espera = 1.4; // deixa o traço de entrada terminar
  let gateHover = -1;
  let raf = 0;
  let last = 0;
  let visivel = true;
  let pagina = document.visibilityState !== 'hidden';
  let semente = 7;
  const aleatorio = () => {
    semente = (semente * 16807) % 2147483647;
    return semente / 2147483647;
  };

  const nascer = () => {
    // Mais entradas nas trilhas que chegam longe: o feixe final nunca fica vazio.
    const pesos = trilhas.map((t) => (t.sinal ? 2.2 : 1 + t.ate * 0.25));
    let r = aleatorio() * pesos.reduce((a, b) => a + b, 0);
    let t = trilhas[0]!;
    for (let i = 0; i < trilhas.length; i++) {
      r -= pesos[i]!;
      if (r <= 0) {
        t = trilhas[i]!;
        break;
      }
    }
    particulas.push({ t, d: 0, v: 150 + aleatorio() * 70, gate: 0 });
  };

  const desenhaCometa = (p: Particula) => {
    const passos = 10;
    const cor = p.t.sinal ? signal : ink;
    for (let s = passos; s >= 1; s--) {
      const a = ponto(p.t, p.d - (RASTRO * s) / passos);
      const b = ponto(p.t, p.d - (RASTRO * (s - 1)) / passos);
      const alpha = (1 - s / passos) * (p.t.sinal ? 0.9 : 0.5);
      ctx.strokeStyle = `rgba(${cor}, ${alpha.toFixed(3)})`;
      ctx.lineWidth = p.t.sinal ? 1.8 : 1.2;
      ctx.beginPath();
      ctx.moveTo(ox + a[0] * scale, oy + a[1] * scale);
      ctx.lineTo(ox + b[0] * scale, oy + b[1] * scale);
      ctx.stroke();
    }
    const [x, y] = ponto(p.t, p.d);
    ctx.fillStyle = `rgba(${cor}, ${p.t.sinal ? 1 : 0.85})`;
    if (p.t.sinal) {
      ctx.shadowColor = `rgba(${signal}, 0.9)`;
      ctx.shadowBlur = 10;
    }
    ctx.beginPath();
    ctx.arc(ox + x * scale, oy + y * scale, p.t.sinal ? 2.2 : 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;

    espera -= dt;
    if (espera <= 0) {
      nascer();
      espera = INTERVALO * (0.6 + aleatorio() * 0.8);
    }

    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';

    // Gate sob o mouse: a coluna inteira acende de leve.
    if (gateHover >= 0) {
      const gx = ox + gates[gateHover]! * scale;
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, `rgba(${signal}, 0)`);
      grad.addColorStop(0.5, `rgba(${signal}, 0.35)`);
      grad.addColorStop(1, `rgba(${signal}, 0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, h);
      ctx.stroke();
    }

    for (let i = particulas.length - 1; i >= 0; i--) {
      const p = particulas[i]!;
      p.d += p.v * dt;
      // Cruzou o próximo gate?
      while (p.gate < gates.length && !Number.isNaN(p.t.cruza[p.gate]!) && p.d >= p.t.cruza[p.gate]!) {
        const [, y] = ponto(p.t, p.t.cruza[p.gate]!);
        if (p.t.ate > p.gate) {
          flashes.push({ g: p.gate, y, age: 0 });
          chegam[p.gate]! += 1;
          passam[p.gate]! += 1;
        }
        p.gate += 1;
      }
      if (p.d >= p.t.len) {
        if (p.t.ate < 4) {
          const [x, y] = ponto(p.t, p.t.len);
          aneis.push({ x, y, age: 0 });
          chegam[p.t.ate]! += 1;
        }
        particulas.splice(i, 1);
        continue;
      }
      desenhaCometa(p);
    }

    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i]!;
      f.age += dt;
      if (f.age > 0.6) {
        flashes.splice(i, 1);
        continue;
      }
      const a = 1 - f.age / 0.6;
      const gx = ox + gates[f.g]! * scale;
      const gy = oy + f.y * scale;
      const span = 46 * scale + 20;
      const grad = ctx.createLinearGradient(0, gy - span, 0, gy + span);
      grad.addColorStop(0, `rgba(${signal}, 0)`);
      grad.addColorStop(0.5, `rgba(${signal}, ${(0.7 * a).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${signal}, 0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(gx, gy - span);
      ctx.lineTo(gx, gy + span);
      ctx.stroke();
    }

    for (let i = aneis.length - 1; i >= 0; i--) {
      const r = aneis[i]!;
      r.age += dt;
      if (r.age > 0.9) {
        aneis.splice(i, 1);
        continue;
      }
      const k = r.age / 0.9;
      ctx.strokeStyle = `rgba(${ink}, ${(0.45 * (1 - k)).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(ox + r.x * scale, oy + r.y * scale, 3 + k * 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  let ultimaTaxa = 0;
  const taxaTimer = window.setInterval(() => {
    if (!raf) return;
    const agora = performance.now();
    if (agora - ultimaTaxa > 900) {
      escreveTaxas();
      ultimaTaxa = agora;
    }
  }, 1000);

  const sync = () => {
    const rodar = visivel && pagina;
    if (rodar && !raf) {
      last = 0;
      raf = requestAnimationFrame(frame);
    } else if (!rodar && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    let alvo = -1;
    if (y >= 0 && y <= r.height) {
      gates.forEach((gx, g) => {
        if (Math.abs(ox + gx * scale - x) < 56) alvo = g;
      });
    }
    if (alvo !== gateHover) {
      rotulos.forEach((t, g) => t.classList.toggle('is-ativo', g === alvo));
      gateHover = alvo;
    }
  };
  const onVis = () => {
    pagina = document.visibilityState !== 'hidden';
    sync();
  };

  resize();
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  ro?.observe(canvas);
  const io =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver((entries) => {
          visivel = entries[entries.length - 1]?.isIntersecting ?? true;
          sync();
        })
      : null;
  io?.observe(canvas);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('visibilitychange', onVis);
  sync();

  return () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    window.clearInterval(taxaTimer);
    ro?.disconnect();
    io?.disconnect();
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('visibilitychange', onVis);
  };
}
