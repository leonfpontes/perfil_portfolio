import { GenerativeCover } from '@/components/art/GenerativeCover';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { HorizontalTrack } from '@/components/motion/HorizontalTrack';
import { Scene } from '@/components/motion/Scene';
import type { Product, ProductStatus } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
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
    <article className="grid w-[86vw] shrink-0 snap-center content-start gap-5 lg:w-[min(78vw,1100px)] lg:grid-cols-2 lg:gap-12">
      <div className="relative aspect-[16/10] overflow-hidden border border-foreground/20 lg:order-2 lg:aspect-auto lg:h-[min(60vh,540px)]">
        <div data-parallax className="absolute -inset-x-[10%] inset-y-0">
          <GenerativeCover variant={product.art} seed={product.name} label={product.name} className="absolute inset-0 text-foreground" />
        </div>
        <span className="label-caps absolute top-3 left-3 text-muted-foreground">
          P/{String(index + 1).padStart(2, '0')} — {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-col justify-center">
        <p className="label-caps flex items-center gap-2 text-muted-foreground">
          <StatusMark status={product.status} />
          {products.statusLabels[product.status]}
        </p>
        <h3 className="display mt-3 text-5xl sm:text-7xl lg:mt-4">{product.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground lg:mt-2 lg:text-base">{product.category}</p>
        <p className="mt-4 text-pretty lg:mt-6 lg:text-lg">{product.description}</p>
        <ul className="mt-4 space-y-1.5 text-sm max-sm:[&>li:nth-child(n+3)]:hidden lg:mt-5 lg:space-y-2">
          {product.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-muted-foreground">
              <span aria-hidden="true" className="text-signal">
                —
              </span>
              {h}
            </li>
          ))}
        </ul>
        <dl className="mt-6 hidden grid-cols-2 gap-4 border-t pt-4 text-sm lg:grid">
          <div>
            <dt className="label-caps text-muted-foreground">{ui.year}</dt>
            <dd className="mt-1">{product.year}</dd>
          </div>
          <div>
            <dt className="label-caps text-muted-foreground">{products.stackLabel}</dt>
            <dd className="mt-1 font-sans text-xs leading-relaxed">{product.stack.join(', ')}</dd>
          </div>
        </dl>
        {product.link && (
          <TrackedLink href={product.link.href} trackEvent="outbound_click" trackLabel={`product_${product.name}`} className="group link-rule mt-4 inline-block self-start lg:mt-6">
            {product.link.label} <Arrow direction="up-right" />
          </TrackedLink>
        )}
      </div>
    </article>
  );
}

export function Products() {
  const { products } = useContent();
  return (
    <Scene id="produtos" label={products.eyebrow} tone="cobalto" className="py-16">
      <Container>
        <SectionHeader id="produtos" heading={products} compact />
        {/* Exposição: a área fixa e o trilho corre na horizontal (desktop e celular). */}
        <HorizontalTrack label={products.title} className="flex gap-6 lg:gap-[8vw]">
          {products.items.map((product, i) => (
            <ProductPanel key={product.name} product={product} index={i} total={products.items.length} />
          ))}
        </HorizontalTrack>
      </Container>
    </Scene>
  );
}
