import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Section } from '@/components/common/Section';
import { useContent } from '@/lib/i18n/LocaleProvider';

export function Faq() {
  const { faq } = useContent();
  return (
    <Section id="faq" heading={faq}>
      <Accordion type="single" collapsible className="border-b lg:ml-[25%]">
        {faq.items.map((item, i) => (
          <AccordionItem key={item.question} value={`faq-${i}`} className="border-t">
            <AccordionTrigger className="items-baseline gap-6 rounded-none py-6 text-left hover:no-underline">
              <span className="flex items-baseline gap-5">
                <span className="label-mono text-muted-foreground">Q{i + 1}</span>
                <span className="font-serif text-2xl leading-snug font-normal sm:text-3xl">{item.question}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="max-w-2xl pb-6 pl-11 text-base text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
