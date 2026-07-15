import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import OurStorySection from '@/components/sections/OurStorySection';
import VenuesSection from '@/components/sections/VenuesSection';
import EventMembershipSection from '@/components/sections/EventMembershipSection';
import RCCShopSection from '@/components/sections/RCCShopSection';
import GalleryCTASection from '@/components/sections/GalleryCTASection';
import Footer from '@/components/layout/Footer';
import ChatBot from '@/components/ui/ChatBot';
import SupportModal from '@/components/ui/SupportModal';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <OurStorySection />
      <VenuesSection />
      <EventMembershipSection />
      <RCCShopSection />
      <GalleryCTASection />
      <Footer />
      <ChatBot />
      <SupportModal />
    </main>
  );
}
