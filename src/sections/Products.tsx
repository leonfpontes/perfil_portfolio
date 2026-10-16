import { useRef } from 'react';
import { GenerativeCover } from '@/components/art/GenerativeCover';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Scene, sceneSectionOf } from '@/components/motion/Scene';
import type { Product, ProductStatus } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { cn } from '@/lib/utils';

/** Marcador de status: só o que está em produção recebe a cor de sinal. */
function StatusMark({ status }: { status: ProductStatus }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block size-2',
        status === 'live' && 'bg-signal',
        (status === 'internal' || status === 'beta') && 'bg-foreground',
        (status === 'sunset' || status === 'personal') && 'border border-foreground',
      )}
    />
  );
}

function ProductPanel({ product, index, total }: { product: Product; index: number; total: number }) {
  const { products, ui } = useContent();
  return (
    <article data-panel className="grid shrink-0 gap-8 border-t pt-8 lg:w-[min(78vw,1100px)] lg:grid-cols-2 lg:gap-12 lg:border-t-0 lg:pt-0">
      <div data-cover className="relative aspect-[4/3] border border-foreground/20 lg:order-2 lg:aspect-auto lg:h-[min(62vh,560px)]">
        <GenerativeCover variant={product.art} seed={product.name} label={product.name} className="absolute inset-0 text-foreground" />
        <span className="label-mono absolute top-3 left-3 text-muted-foreground">
          P/{String(index + 1).padStart(2, '0')} — {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-col justify-center">
        <p className="label-mono flex items-center gap-2 text-muted-foreground">
          <StatusMark status={product.status} />
          {products.statusLabels[product.status]}
        </p>
        <h3 className="display mt-4 text-6xl sm:text-7xl">{product.name}</h3>
        <p className="mt-2 text-muted-foreground">{product.category}</p>
        <p className="mt-6 text-lg text-pretty">{product.description}</p>
        <ul className="mt-5 space-y-2 text-sm">
          {product.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-muted-foreground">
              <span aria-hidden="true" className="text-signal">
                —
              </span>
              {h}
            </li>
          ))}
        </ul>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 text-sm">
          <div>
            <dt className="label-mono text-muted-foreground">{ui.year}</dt>
            <dd className="mt-1">{product.year}</dd>
          </div>
          <div>
            <dt className="label-mono text-muted-foreground">{products.stackLabel}</dt>
            <dd className="mt-1 font-mono text-xs leading-relaxed">{product.stack.join(', ')}</dd>
          </div>
        </dl>
        {product.link && (
          <TrackedLink href={product.link.href} trackEvent="outbound_click" trackLabel={`product_${product.name}`} className="group link-rule mt-6 inline-block self-start">
            {product.link.label} <Arrow direction="up-right" />
          </TrackedLink>
        )}
      </div>
    </article>
  );
}

/**
 * Produtos como uma exposição: a tela fixa e o trilho corre na horizontal.
 * As capas deslizam um pouco mais devagar que o texto (profundidade).
 */
function ProductsTrack() {
  const { products } = useContent();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        const track = ref.current;
        const section = sceneSectionOf(track);
        if (!track || !section) return;
        const distance = () => track.scrollWidth - track.clientWidth;
        const move = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>('[data-cover]', track).forEach((cover) => {
          gsap.fromTo(cover, { xPercent: 10, rotate: 1.5 }, { xPercent: -10, rotate: -1.5, ease: 'none', scrollTrigger: { trigger: cover, containerAnimation: move, start: 'left right', end: 'right left', scrub: true } });
        });
        gsap.to('[data-track-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, scrub: true } });
      });
      mm.add(MEDIA.mobile, () => {
        gsap.utils.toArray<HTMLElement>('[data-panel]', ref.current).forEach((panel) => {
          gsap.from(panel, { opacity: 0, y: 60, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: panel, start: 'top 85%' } });
        });
      });
    },
    { scope: ref },
  );

  return (
    <>
      <div ref={ref} className="flex flex-col gap-16 lg:flex-row lg:gap-[8vw]">
        {products.items.map((product, i) => (
          <ProductPanel key={product.name} product={product} index={i} total={products.items.length} />
        ))}
      </div>
      <div aria-hidden="true" className="mt-10 hidden h-px bg-foreground/20 lg:block">
        <div data-track-progress className="h-full origin-left scale-x-0 bg-signal" />
      </div>
    </>
  );
}

export function Products() {
  const { products } = useContent();
  return (
    <Scene id="produtos" label={products.eyebrow} tone="ink" className="lg:py-16">
      <Container>
        <SectionHeader id="produtos" heading={products} compact />
        <ProductsTrack />
      </Container>
    </Scene>
  );
}
