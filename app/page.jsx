import Hero from '@/src/components/Hero';
import Marquee from '@/src/components/Marquee';
import FeaturedCategories from '@/src/components/FeaturedCategories';
import FeaturedProducts from '@/src/components/FeaturedProducts';
import CustomGiftCTA from '@/src/components/CustomGiftCTA';
import About from '@/src/components/About';
import Testimonials from '@/src/components/Testimonials';
import InstagramGallery from '@/src/components/InstagramGallery';
import WhatsAppCTA from '@/src/components/WhatsAppCTA';

export default function HomePage() {
  return (
    <div className="bg-[var(--bg)] transition-colors duration-400 overflow-hidden">
      <Hero />
      <Marquee />
      <FeaturedCategories />
      <FeaturedProducts />
      <CustomGiftCTA />
      <About />
      <Testimonials />
      <InstagramGallery />
      <WhatsAppCTA />
    </div>
  );
}
