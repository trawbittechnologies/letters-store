import './globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import FloatingWhatsApp from '@/src/components/FloatingWhatsApp';
import ThemeInitializer from '@/components/ThemeInitializer';

export const metadata = {
  metadataBase: new URL('https://letters-store.vercel.app'),
  title: {
    default: 'LETTERS — Handcrafted Gift Hampers & Bouquets',
    template: '%s | LETTERS Gifting',
  },
  description:
    'Handcrafted luxury hampers, bespoke floral arrangements, and personalized gifts made to order in Kerala with live WhatsApp photo previews before dispatch. Delivered across India.',
  keywords: [
    'gift hampers',
    'bespoke hampers',
    'chocolate hampers',
    'wedding hampers',
    'flower bouquets',
    'personalized gifts',
    'Kerala gifting studio',
    'custom hampers India',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LETTERS — Handcrafted Gift Hampers & Bouquets',
    description:
      'Handcrafted luxury hampers, bespoke floral arrangements, and personalized gifts made to order in Kerala with live WhatsApp photo previews before dispatch.',
    url: 'https://letters-store.vercel.app',
    siteName: 'LETTERS Gifting Atelier',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LETTERS — Handcrafted Gift Hampers & Bouquets',
    description:
      'Handcrafted luxury hampers & bespoke bouquets made to order in Kerala. Live WhatsApp photo preview before dispatch.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo.png',
  },
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
