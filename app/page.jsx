import TopSaleAlertBar from '@/src/components/TopSaleAlertBar';
import Hero from '@/src/components/Hero';
import ValuePropsBar from '@/src/components/ValuePropsBar';
import Marquee from '@/src/components/Marquee';
import AmazonQuadGrid from '@/src/components/AmazonQuadGrid';
import FlashDealsRow from '@/src/components/FlashDealsRow';
import FeaturedCategories from '@/src/components/FeaturedCategories';
import FeaturedProducts from '@/src/components/FeaturedProducts';
import FestivalHamperSection from '@/src/components/FestivalHamperSection';
import CustomGiftCTA from '@/src/components/CustomGiftCTA';
import WhatsAppCTA from '@/src/components/WhatsAppCTA';

export default function HomePage() {
  return (
    <div className="bg-[var(--bg)] transition-colors duration-400 overflow-hidden">
      {/* 1. Sales Alert Banner */}
      <TopSaleAlertBar />

      {/* 2. Hero Section */}
      <Hero />
      <ValuePropsBar />
      <Marquee />


      {/* 4. Amazon-Style 4-Tile Spotlight Grid */}
      <AmazonQuadGrid />

      {/* 5. Amazon-Style Lightning Flash Deals Row with Live Timer */}
      <FlashDealsRow />

      {/* 6. Full Category Showcase Grid */}
      <FeaturedCategories />

      {/* 7. Recommended Products / Bestseller Shelf */}
      <FeaturedProducts />

      {/* 8. Festival Product (shows if added & active) */}
      <FestivalHamperSection />

      {/* 9. Personalized Hamper Studio */}
      <CustomGiftCTA />

      {/* 10. Direct Studio Concierge */}
      <WhatsAppCTA />
    </div>
  );
}
