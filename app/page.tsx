import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import OurStory from '@/components/sections/OurStory';
import OwnVenue from '@/components/sections/OwnVenue';
import Partners from '@/components/sections/Partners';
import CorporateEvents from '@/components/sections/CorporateEvents';
import EventMembership from '@/components/sections/EventMembership';
import GalleryTestimonial from '@/components/sections/GalleryTestimonial';
import Enquire from '@/components/sections/Enquire';
import CTA from '@/components/sections/CTA';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-bg">
        <Hero />
        <OurStory />
        <OwnVenue />
        <Partners />
        <CorporateEvents />
        <EventMembership />
        <GalleryTestimonial />
        <Enquire />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
