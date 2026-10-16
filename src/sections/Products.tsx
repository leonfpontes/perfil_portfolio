import { Arrow } from '@/components/common/Arrow';
import { Reveal } from '@/components/common/Reveal';
import { Section } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import type { ProductStatus } from '@/content/types';
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

export function Products() {
  const { products, ui } = useContent();
  return (
    <Section id="produtos" heading={products} className="bg-card">
      <div className="border-b">
        {products.items.map((product, i) => (
          <Reveal key={product.name} className="grid gap-8 border-t py-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="label-mono flex items-center gap-2 text-muted-foreground">
                P/{String(i + 1).padStart(2, '0')}
                <span className="mx-1">·</span>
                <StatusMark status={product.status} />
                {products.statusLabels[product.status]}
              </p>
              <h3 className="display mt-4 text-6xl sm:text-7xl">{product.name}</h3>
              <p className="mt-3 text-muted-foreground">{product.category}</p>
              {product.link && (
                <TrackedLink
                  href={product.link.href}
                  trackEvent="outbound_click"
                  trackLabel={`product_${product.name}`}
                  className="group link-rule mt-6 inline-block"
                >
                  {product.link.label} <Arrow direction="up-right" />
                </TrackedLink>
              )}
            </div>

            <div className="lg:col-span-7">
              <p className="text-lg text-pretty">{product.description}</p>
              <ul className="mt-6 space-y-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex gap-4 text-muted-foreground">
                    <span aria-hidden="true" className="text-signal">—</span>
                    {h}
                  </li>
                ))}
              </ul>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t pt-4 text-sm">
                <div>
                  <dt className="label-mono text-muted-foreground">{ui.status}</dt>
                  <dd className="mt-1">{products.statusLabels[product.status]}</dd>
                </div>
                <div>
                  <dt className="label-mono text-muted-foreground">{ui.year}</dt>
                  <dd className="mt-1">{product.year}</dd>
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <dt className="label-mono text-muted-foreground">{products.stackLabel}</dt>
                  <dd className="mt-1 font-mono text-xs leading-relaxed">{product.stack.join(', ')}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
