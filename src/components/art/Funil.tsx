import { cn } from '@/lib/utils';
import { FUNIL_GATES, FUNIL_VIEWBOX, funilLinhas } from './funil';

const LINHAS = funilLinhas();
const SINAL = LINHAS.find((l) => l.signal)!;
const ULTIMO = FUNIL_GATES.length - 1;

export interface FunilProps {
  className?: string;
  /** Mostra os rótulos dos gates (G1 Intake…). */
  labels?: boolean;
  /** Liga o pulso champagne que corre pela linha de sinal. Desligado, fica só o desenho. */
  animate?: boolean;
  /** Onde ficam os rótulos: no alto ou embaixo (para não cruzar com um título). */
  labelsAt?: 'top' | 'bottom';
}

/**
 * Funil de portfólio: iniciativas atravessam os gates G1–G4, algumas param em cada
 * gate e um feixe estreito chega ao fim, com uma linha champagne de sinal.
 * Tudo é SVG parado (traço nítido, sem custo de CPU); só um pulso champagne percorre a
 * linha de sinal, em CSS (lp-noir.css). No modo suave, nem o pulso.
 * As linhas sangram até a borda da tela. Os rótulos são HTML, presos à borda da área
 * da arte (não ao corte do SVG), então ficam sempre visíveis; o do último gate se alinha
 * à esquerda da própria linha, para não passar da largura do conteúdo.
 */
export function Funil({ className, labels = true, animate = true, labelsAt = 'top' }: FunilProps) {
  const { width, height } = FUNIL_VIEWBOX;

  return (
    <div aria-hidden="true" className={cn('funil pointer-events-none relative h-full w-full', className)}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 block h-full w-full">
        <g className="funil-gates">
          {FUNIL_GATES.map((g) => (
            <g key={g.id}>
              <line x1={g.x} x2={g.x} y1={40} y2={height - 40} vectorEffect="non-scaling-stroke" />
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
        {animate && <path className="funil-pulso" d={SINAL.d} pathLength={1} vectorEffect="non-scaling-stroke" />}
      </svg>
      {labels && (
        <ul className={cn('absolute inset-x-0 max-md:hidden', labelsAt === 'top' ? 'top-0' : 'bottom-0')}>
          {FUNIL_GATES.map((g, i) => (
            <li
              key={g.id}
              className={cn('label-caps absolute whitespace-nowrap text-[var(--noir-stone)]', i === ULTIMO ? '-translate-x-full pr-2.5' : 'pl-2.5')}
              style={{ left: `${(g.x / width) * 100}%` }}
            >
              <span className="text-signal">{g.id}</span> {g.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
