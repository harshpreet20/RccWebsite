import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import OurStory from '@/components/sections/OurStory';
import OwnVenue from '@/components/sections/OwnVenue';
import Event from '@/components/sections/Event';
import Partners from '@/components/sections/Partners';
import CorporateEvents from '@/components/sections/CorporateEvents';
import Gallery from '@/components/sections/Gallery';
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
        <Event />
        <Partners />
        <CorporateEvents />
        <Gallery />
        <Enquire />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
