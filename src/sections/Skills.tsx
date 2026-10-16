import { useRef } from 'react';
import { Container, SectionHeader } from '@/components/common/Section';
import { Scene } from '@/components/motion/Scene';
import type { SkillGroup } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, ScrollTrigger, useGSAP } from '@/lib/motion/gsap';

function SkillRow({ group, index }: { group: SkillGroup; index: number }) {
  const items = (copy: boolean) =>
    group.skills.map((skill) => (
      <li key={`${copy}-${skill}`} aria-hidden={copy || undefined} className={copy ? 'motion-reduce:hidden' : undefined}>
        <span className="font-serif text-3xl whitespace-nowrap sm:text-6xl">{skill}</span>
        <span aria-hidden="true" className="mx-6 text-signal sm:mx-10">
          ✳
        </span>
      </li>
    ));

  return (
    <div className="group border-t py-3 first:border-t-0 lg:py-5">
      <p className="label-mono mb-3 flex gap-3 text-muted-foreground">
        <span className="text-signal">{String.fromCharCode(97 + index)})</span>
        {group.label} — {group.description}
      </p>
      <div className="overflow-hidden motion-reduce:overflow-visible">
        {/* Lista duplicada para o loop sem emenda; a cópia é ignorada por leitores de tela. */}
        <ul data-marquee={index % 2 ? 'right' : 'left'} className="flex w-max items-baseline motion-reduce:w-auto motion-reduce:flex-wrap">
          {items(false)}
          {items(true)}
        </ul>
      </div>
    </div>
  );
}

/**
 * Competências em faixas que correm em sentidos alternados. A velocidade
 * acompanha o impulso do scroll — rolar rápido "acelera" o repertório.
 */
export function Skills() {
  const { skills } = useContent();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const rows = gsap.utils.toArray<HTMLElement>('[data-marquee]', ref.current).map((row) => {
          const dir = row.dataset.marquee === 'right' ? 1 : -1;
          const tween = gsap.fromTo(
            row,
            { xPercent: dir === 1 ? -50 : 0 },
            { xPercent: dir === 1 ? 0 : -50, duration: 40 + row.children.length, ease: 'none', repeat: -1 },
          );
          const parent = row.closest('.group');
          const pause = () => gsap.to(tween, { timeScale: 0.15, duration: 0.6 });
          const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.6 });
          parent?.addEventListener('pointerenter', pause);
          parent?.addEventListener('pointerleave', resume);
          return { tween, cleanup: () => (parent?.removeEventListener('pointerenter', pause), parent?.removeEventListener('pointerleave', resume)) };
        });

        ScrollTrigger.create({
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 6);
            rows.forEach(({ tween }) => gsap.to(tween, { timeScale: boost, duration: 0.2, overwrite: true, onComplete: () => void gsap.to(tween, { timeScale: 1, duration: 1.2 }) }));
          },
        });
        return () => rows.forEach((r) => r.cleanup());
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="competencias" label={skills.eyebrow} tone="night">
      <Container>
        <SectionHeader id="competencias" heading={skills} />
      </Container>
      <div ref={ref} className="px-4 sm:px-8">
        {skills.groups.map((group, i) => (
          <SkillRow key={group.id} group={group} index={i} />
        ))}
      </div>
    </Scene>
  );
}
