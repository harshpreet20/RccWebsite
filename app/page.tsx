import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import PartnersSection from '@/components/sections/PartnersSection';
import InstagramFeed from '@/components/sections/InstagramFeed';
import MembershipSection from '@/components/sections/MembershipSection';
import PlayerSpotlight from '@/components/sections/PlayerSpotlight';
import LeaderboardSection from '@/components/sections/LeaderboardSection';
import CommunityFeed from '@/components/sections/CommunityFeed';
import RCCShopSection from '@/components/sections/RCCShopSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import Footer from '@/components/layout/Footer';
import ChatBot from '@/components/ui/ChatBot';
import SupportModal from '@/components/ui/SupportModal';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PartnersSection />
      <InstagramFeed />
      <MembershipSection />
      <PlayerSpotlight />
      <LeaderboardSection />
      <CommunityFeed limit={4} />
      <RCCShopSection />
      <TestimonialsSection />
      <Footer />
      <ChatBot />
      <SupportModal />
    </main>
  );
}
