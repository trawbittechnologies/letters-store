import './globals.css';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import FloatingWhatsApp from '@/src/components/FloatingWhatsApp';
import ThemeInitializer from '@/components/ThemeInitializer';

export const metadata = {
  title: 'LETTERS — Luxury Hampers, Bouquets & Bespoke Personalized Gifts',
  description:
    'Thoughtfully curated hampers, bouquets, chocolate arrangements and personalized gifts for the moments that matter most. Handcrafted since 2020.',
  keywords: 'hampers, gifts, chocolate hamper, engagement hamper, flower bouquet, personalized gifts, bespoke gifting, Kerala, India',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-300">
        <ThemeInitializer />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
