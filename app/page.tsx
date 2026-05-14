import Hero from '@/components/sections/Hero';
import FeaturedEvents from '@/components/sections/FeaturedEvents';
import CommunityValues from '@/components/sections/CommunityValues';
import SocialHighlights from '@/components/sections/SocialHighlights';
import SponsorStrip from '@/components/sections/SponsorStrip';
import ParticleDivider from '@/components/ui/ParticleDivider';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ParticleDivider />
      <FeaturedEvents />
      <ParticleDivider />
      <CommunityValues />
      <ParticleDivider />
      <SocialHighlights />
      <SponsorStrip />
    </>
  );
}
