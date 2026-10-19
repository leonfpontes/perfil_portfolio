import { ChevronDown } from 'lucide-react';
import { Container, SectionHeader } from '@/components/common/Section';
import { Scene } from '@/components/motion/Scene';
import { useContent } from '@/lib/i18n/LocaleProvider';

/**
 * FAQ com <details> nativo: acessível, funciona sem JavaScript e não carrega
 * biblioteca de acordeão. `name` faz com que só uma pergunta fique aberta por vez.
 */
export function Faq() {
  const { faq } = useContent();
  return (
    <Scene id="faq" label={faq.eyebrow} tone="cal">
      <Container>
        <SectionHeader id="faq" heading={faq} />
        <div className="border-b lg:ml-[25%]">
          {faq.items.map((item, i) => (
            <details key={item.question} name="faq" className="group border-t">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-5">
                  <span className="label-caps text-muted-foreground">Q{i + 1}</span>
                  <span className="font-display text-xl leading-snug sm:text-2xl">{item.question}</span>
                </span>
                <ChevronDown aria-hidden="true" className="size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="max-w-2xl pb-6 pl-11 text-base text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Scene>
  );
}
