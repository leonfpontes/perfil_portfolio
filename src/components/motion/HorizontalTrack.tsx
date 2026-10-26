import { Children, useRef, useState, type ReactNode } from 'react';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { cn } from '@/lib/utils';

type TrackMedia = 'all' | 'mobile' | 'desktop';

const QUERY: Record<TrackMedia, string> = { all: MEDIA.motion, mobile: MEDIA.mobile, desktop: MEDIA.desktop };

/** Altura do header fixo — o trilho fixa logo abaixo dele. */
const HEADER_OFFSET = 64;

interface HorizontalTrackProps {
  children: ReactNode;
  /** Onde o trilho é horizontal. Fora disso, vale o layout de `className` (ex.: grid no desktop). */
  media?: TrackMedia;
  /** Classes do trilho (o container flex dos painéis). */
  className?: string;
  /** Rótulo acessível do grupo de painéis. */
  label: string;
  /** Scroll vertical por pixel horizontal (> 1 = mais tempo em cada painel). */
  pace?: number;
  /** Encaixa no painel mais próximo ao soltar o scroll (só no celular). */
  snap?: boolean;
  /** Mostra "01 / 04" e a régua de progresso abaixo do trilho. */
  showProgress?: boolean;
  /** Dica para o carrossel nativo (sem movimento): pontos + texto, só onde o trilho é horizontal. */
  swipeHint?: string;
}

/**
 * Trilho horizontal guiado pelo scroll vertical: a área fixa logo abaixo do
 * header e os painéis correm para o lado. Cada painel cabe numa tela, então
 * nenhuma animação é "cortada" e o scroll total encolhe (um painel ≈ meia tela).
 *
 * Elementos com `data-parallax` dentro dos painéis deslizam um pouco mais
 * devagar (profundidade). Sem movimento permitido, vira um carrossel nativo
 * com swipe e scroll-snap.
 */
export function HorizontalTrack({ children, media = 'all', className, label, pace = 0.85, snap = true, showProgress = true, swipeHint }: HorizontalTrackProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(0);

  useGSAP(
    () => {
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!pin || !track) return;
      const mm = gsap.matchMedia();
      mm.add({ on: QUERY[media], narrow: MEDIA.narrow }, (context) => {
        if (!context.conditions?.on) return;
        // Encaixe só no celular: no desktop o Lenis já suaviza o scroll, e o
        // encaixe "puxaria" a página de volta, brigando com ele.
        const useSnap = snap && !!context.conditions.narrow;
        const panels = track.children.length;
        const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);
        if (panels < 2 || distance() <= 0) return;
        setCount(panels);

        const move = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            pin: true,
            start: `top ${HEADER_OFFSET}px`,
            end: () => `+=${distance() * pace}`,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: useSnap ? { snapTo: 1 / (panels - 1), duration: { min: 0.2, max: 0.6 }, ease: 'power2.inOut', directional: true } : undefined,
            onUpdate: (self) => setActive(Math.round(self.progress * (panels - 1))),
          },
        });

        gsap.utils.toArray<HTMLElement>('[data-parallax]', track).forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: 8 },
            { xPercent: -8, ease: 'none', scrollTrigger: { trigger: el, containerAnimation: move, start: 'left right', end: 'right left', scrub: true } },
          );
        });
        gsap.to(pin.querySelector('[data-track-bar]'), {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: pin, start: `top ${HEADER_OFFSET}px`, end: () => `+=${distance() * pace}`, scrub: true },
        });

        return () => setCount(0);
      });
    },
    { scope: pinRef, dependencies: [media, pace, snap] },
  );

  const pad = (n: number) => String(n).padStart(2, '0');
  const horizontal = count > 0;
  const total = Children.count(children);

  // Carrossel nativo (modo suave): o ponto ativo segue o swipe.
  const onNativeScroll = () => {
    const track = trackRef.current;
    if (horizontal || !track || total < 2) return;
    const max = track.scrollWidth - track.clientWidth;
    if (max > 0) setActive(Math.round((track.scrollLeft / max) * (total - 1)));
  };

  return (
    <div ref={pinRef} role="group" aria-label={label} className="relative min-w-0">
      <div
        ref={trackRef}
        onScroll={onNativeScroll}
        className={cn(
          className,
          // Sem movimento: carrossel nativo com swipe/scroll horizontal.
          !horizontal && 'reduced:snap-x reduced:snap-mandatory reduced:overflow-x-auto reduced:pb-4',
        )}
      >
        {children}
      </div>
      {showProgress && (
        <div aria-hidden="true" className={cn('mt-5 items-center gap-4', horizontal ? 'flex' : 'hidden')}>
          <span className="label-caps text-muted-foreground">
            {pad(active + 1)} / {pad(count)}
          </span>
          <span className="h-px flex-1 bg-foreground/20">
            <span data-track-bar className="block h-full origin-left scale-x-0 bg-signal" />
          </span>
        </div>
      )}
      {swipeHint && total > 1 && (
        <p
          aria-hidden="true"
          className={cn('mt-4 hidden items-center gap-3 text-sm text-muted-foreground', !horizontal && 'reduced:flex', media === 'mobile' && 'lg:hidden!')}
        >
          <span className="flex gap-1.5">
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className={cn('size-1.5 rounded-full', i === active ? 'bg-signal' : 'bg-foreground/30')} />
            ))}
          </span>
          {swipeHint} →
        </p>
      )}
    </div>
  );
}
