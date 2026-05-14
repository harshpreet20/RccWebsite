import Hero from '@/components/sections/Hero';
import FeaturedEvents from '@/components/sections/FeaturedEvents';
import CommunityValues from '@/components/sections/CommunityValues';
import SponsorStrip from '@/components/sections/SponsorStrip';
import SocialHighlights from '@/components/sections/SocialHighlights';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedEvents />
      <CommunityValues />
      <SocialHighlights />
      <SponsorStrip />
    </>
  );
}
