import { HomeCtaSection } from '@/pages/home/sections/HomeCtaSection';
import { HomeHeroSection } from '@/pages/home/sections/HomeHeroSection';
import { WorkflowSection } from '@/pages/home/sections/WorkflowSection';

function HomePage() {
  return (
    <div>
      <HomeHeroSection />
      <WorkflowSection />
      <HomeCtaSection />
    </div>
  );
}

export { HomePage };
