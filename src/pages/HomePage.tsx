import { Contact } from '@/sections/Contact';
import { Hero } from '@/sections/Hero';
import { OffersScene } from '@/sections/Offer';
import { ProfileTeaser } from '@/sections/ProfileTeaser';
import { Testimonials } from '@/sections/Testimonials';
import { Lazy } from './Lazy';

/** "/" — quem, o quê, para quem e quanto: as duas ofertas, a prova e o convite. */
export function HomePage() {
  return (
    <>
      <Hero />
      <Lazy>
        <OffersScene />
      </Lazy>
      <Lazy>
        <Testimonials />
      </Lazy>
      <Lazy>
        <ProfileTeaser />
      </Lazy>
      <Lazy>
        <Contact />
      </Lazy>
    </>
  );
}
