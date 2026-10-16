import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Container, SectionHeader } from '@/components/common/Section';
import { Scene } from '@/components/motion/Scene';
import { useContent } from '@/lib/i18n/LocaleProvider';

export function Faq() {
  const { faq } = useContent();
  return (
    <Scene id="faq" label={faq.eyebrow} tone="cal">
      <Container>
        <SectionHeader id="faq" heading={faq} />
        <Accordion type="single" collapsible className="border-b lg:ml-[25%]">
          {faq.items.map((item, i) => (
            <AccordionItem key={item.question} value={`faq-${i}`} className="border-t">
              <AccordionTrigger className="items-baseline gap-6 rounded-none py-6 text-left hover:no-underline">
                <span className="flex items-baseline gap-5">
                  <span className="label-caps text-muted-foreground">Q{i + 1}</span>
                  <span className="font-display text-xl leading-snug sm:text-2xl">{item.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="max-w-2xl pb-6 pl-11 text-base text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Scene>
  );
}
