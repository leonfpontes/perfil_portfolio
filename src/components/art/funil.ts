/**
 * Geometria do "funil de portfólio" — a arte do LP Noir (sem aleatoriedade).
 *
 * Iniciativas entram pela esquerda espalhadas e atravessam os quatro gates da
 * metodologia (G1 Intake, G2 Business case, G3 Delivery, G4 Benefits). A cada gate
 * algumas param (terminam num ponto), as que seguem se aproximam, e no fim só um
 * feixe estreito chega à direita: priorização desenhada. Uma delas é a linha de sinal.
 * Tudo em coordenadas de um viewBox fixo; o SVG escala sem distorcer o traço.
 */
export const FUNIL_VIEWBOX = { width: 1440, height: 800 } as const;

export interface FunilGate {
  id: string;
  label: string;
  x: number;
}

export const FUNIL_GATES: readonly FunilGate[] = [
  { id: 'G1', label: 'Intake', x: 520 },
  { id: 'G2', label: 'Business case', x: 760 },
  { id: 'G3', label: 'Delivery', x: 1000 },
  { id: 'G4', label: 'Benefits', x: 1240 },
];

export interface FunilLinha {
  d: string;
  /** Ponto final quando a iniciativa para num gate (sem ponto: segue até a borda). */
  stop?: { x: number; y: number };
  signal?: boolean;
  /** Gate onde a iniciativa para (0–3) ou 4, quando chega ao fim. */
  ate: number;
}

const START_X = -40;
const END_X = 1480;
const FOCUS_Y = 400;

/** y de entrada de cada iniciativa e o gate onde ela para (4 = chega ao fim). */
const INICIATIVAS: readonly { y: number; ate: 0 | 1 | 2 | 3 | 4 }[] = [
  { y: 70, ate: 0 },
  { y: 130, ate: 1 },
  { y: 190, ate: 4 },
  { y: 245, ate: 0 },
  { y: 300, ate: 2 },
  { y: 350, ate: 4 },
  { y: 400, ate: 1 },
  { y: 450, ate: 4 },
  { y: 500, ate: 3 },
  { y: 555, ate: 0 },
  { y: 610, ate: 4 },
  { y: 665, ate: 2 },
  { y: 725, ate: 1 },
];

/** Quanto o espalhamento vertical encolhe em cada gate (1 = como entrou). */
const APERTO = [1, 0.62, 0.38, 0.2, 0.08];

function yNoGate(y0: number, g: number): number {
  return FOCUS_Y + (y0 - FOCUS_Y) * APERTO[g]!;
}

/** Curva suave entre pontos com tangentes horizontais (Bézier cúbica por trecho). */
function curva(pontos: readonly (readonly [number, number])[]): string {
  let d = `M${pontos[0]![0]},${pontos[0]![1].toFixed(1)}`;
  for (let i = 1; i < pontos.length; i++) {
    const [x0, y0] = pontos[i - 1]!;
    const [x1, y1] = pontos[i]!;
    const k = (x1 - x0) * 0.5;
    d += ` C${(x0 + k).toFixed(1)},${y0.toFixed(1)} ${(x1 - k).toFixed(1)},${y1.toFixed(1)} ${x1},${y1.toFixed(1)}`;
  }
  return d;
}

export function funilLinhas(): FunilLinha[] {
  // A linha de sinal: a sobrevivente mais próxima do centro.
  const sobreviventes = INICIATIVAS.filter((i) => i.ate === 4);
  const sinal = sobreviventes.reduce((a, b) => (Math.abs(b.y - FOCUS_Y) < Math.abs(a.y - FOCUS_Y) ? b : a));

  return INICIATIVAS.map((ini) => {
    const pontos: [number, number][] = [[START_X, ini.y]];
    const ultimoGate = Math.min(ini.ate, 3);
    for (let g = 0; g <= ultimoGate; g++) pontos.push([FUNIL_GATES[g]!.x, yNoGate(ini.y, g + 1)]);
    if (ini.ate === 4) {
      pontos.push([END_X, yNoGate(ini.y, 4)]);
      return { d: curva(pontos), signal: ini === sinal, ate: 4 };
    }
    const fim = pontos[pontos.length - 1]!;
    return { d: curva(pontos), stop: { x: fim[0], y: fim[1] }, ate: ini.ate };
  });
}
