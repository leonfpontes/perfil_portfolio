import { About } from '@/sections/About';
import { Contact } from '@/sections/Contact';
import { Education } from '@/sections/Education';
import { Experience } from '@/sections/Experience';
import { Products } from '@/sections/Products';
import { Services } from '@/sections/Services';
import { Skills } from '@/sections/Skills';
import { Lazy } from './Lazy';

/** "/sobre" — quem é o Leonardo: história, produtos autorais, trajetória, formação e serviços. */
export function AboutPage() {
  return (
    <>
      <About asPageHero />
      <Lazy>
        <Products />
      </Lazy>
      <Lazy>
        <Experience />
      </Lazy>
      <Lazy>
        <Skills />
      </Lazy>
      <Lazy>
        <Education />
      </Lazy>
      <Lazy>
        <Services />
      </Lazy>
      <Lazy>
        <Contact />
      </Lazy>
    </>
  );
}
