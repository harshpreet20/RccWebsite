import Hero from '@/components/sections/Hero';
import OurStory from '@/components/sections/OurStory';
import OwnVenue from '@/components/sections/OwnVenue';
import EventMembership from '@/components/sections/EventMembership';
import Shop from '@/components/sections/Shop';
import GalleryTestimonial from '@/components/sections/GalleryTestimonial';
import CTA from '@/components/sections/CTA';

export default function Home() {
  return (
    <main className="bg-bg">
      <Hero />
      <OurStory />
      <OwnVenue />
      <EventMembership />
      <Shop />
      <GalleryTestimonial />
      <CTA />
    </main>
  );
}
