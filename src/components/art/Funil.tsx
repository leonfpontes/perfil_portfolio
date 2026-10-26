import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { FUNIL_GATES, FUNIL_VIEWBOX, funilLinhas } from './funil';
import { startFunilMotion } from './funil-motion';

const LINHAS = funilLinhas();

export interface FunilProps {
  className?: string;
  /** Mostra os rótulos dos gates (G1 Intake…) com a taxa de aprovação ao vivo. */
  labels?: boolean;
  /** Liga o fluxo de iniciativas (canvas). Desligado, fica só o desenho. */
  animate?: boolean;
  /** Onde ficam os rótulos: no alto ou embaixo (para não cruzar com um título). */
  labelsAt?: 'top' | 'bottom';
}

/**
 * Funil de portfólio: iniciativas atravessam os gates G1–G4, algumas param em cada
 * gate e um feixe estreito chega ao fim, com uma linha champagne de sinal.
 * O desenho é SVG (traço nítido em qualquer tamanho) e se desenha na entrada; por cima,
 * um canvas faz as iniciativas fluírem, acende os gates na passagem e atualiza as taxas
 * (funil-motion.ts). No modo suave, fica só o desenho parado.
 */
export function Funil({ className, labels = true, animate = true, labelsAt = 'top' }: FunilProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = FUNIL_VIEWBOX;

  useEffect(() => {
    if (!animate || !svgRef.current || !canvasRef.current) return;
    return startFunilMotion(svgRef.current, canvasRef.current);
  }, [animate]);

  return (
    <div aria-hidden="true" className={cn('funil pointer-events-none relative h-full w-full', className)}>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 block h-full w-full">
        <g className="funil-gates">
          {FUNIL_GATES.map((g) => (
            <g key={g.id}>
              <line x1={g.x} x2={g.x} y1={40} y2={height - 40} vectorEffect="non-scaling-stroke" />
              {labels && (
                <text x={g.x + 10} y={labelsAt === 'top' ? 28 : height - 52}>
                  <tspan className="funil-gate-id">{g.id}</tspan> {g.label}
                </text>
              )}
            </g>
          ))}
        </g>
        <g className="funil-linhas">
          {LINHAS.map((l, i) => (
            <path
              key={i}
              d={l.d}
              data-ate={l.ate}
              className={l.signal ? 'funil-sinal' : undefined}
              style={{ animationDelay: `${0.15 + i * 0.06}s` }}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        <g className="funil-paradas">
          {LINHAS.filter((l) => l.stop).map((l, i) => (
            <circle key={i} cx={l.stop!.x} cy={l.stop!.y} r={3} style={{ animationDelay: `${1.2 + i * 0.05}s` }} />
          ))}
        </g>
      </svg>
      {animate && <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />}
    </div>
  );
}
