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
import SmoothScroll from '@/components/ui/SmoothScroll';
import Reveal from '@/components/ui/Reveal';

export default function Home() {
  return (
    <main className="bg-[#050505]">
      <SmoothScroll />
      <Navbar />
      <Hero />
      <Reveal><OurStorySection /></Reveal>
      <Reveal><VenuesSection /></Reveal>
      <Reveal><EventMembershipSection /></Reveal>
      <Reveal><RCCShopSection /></Reveal>
      <Reveal><GalleryCTASection /></Reveal>
      <Footer />
      <ChatBot />
      <SupportModal />
    </main>
  );
}
