'use client';

import { Sparkles, ArrowRight, MessageCircle, Package, ShieldCheck, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { useSettingsStore } from '../store/settingsStore';

export default function Hero() {
  const { settings, getWhatsAppUrl } = useSettingsStore();

  const handleQuickWhatsAppChat = () => {
    const message = `Hello ${settings.brandName}, I would like to inquire about your bespoke luxury hampers and personalized gifts.`;
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center bg-[var(--bg)] pt-12 pb-24 border-b border-[var(--border)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Editorial Headline & Modern CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Tagline Badge - Small Pill with soft cream bg */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text)] mb-6 w-fit select-none">
              <Sparkles size={13} className="text-[var(--accent)]" />
              <span className="text-xs font-medium tracking-wide">
                {settings.tagline} • Est. {settings.establishedYear}
              </span>
            </div>

            {/* Main Editorial Headline with High-Contrast Serif */}
            <h1 className="font-heading font-medium text-4xl sm:text-5xl lg:text-6xl text-[var(--text)] leading-[1.12] tracking-tight mb-6">
              Making Moments <br />
              <span className="italic font-normal text-[var(--accent-hover)]">
                Exquisitely Memorable.
              </span>
            </h1>

            {/* Editorial Description */}
            <p className="text-[var(--text-muted)] text-base sm:text-lg leading-relaxed max-w-xl font-normal mb-10">
              Thoughtfully curated hampers, bespoke floral arrangements, and personalized keepsakes for life's most cherished milestones. Handcrafted with meticulous precision in our studio.
            </p>

            {/* Pill-shaped CTA Buttons with Micro-interactions */}
            <div className="flex flex-wrap items-center gap-3.5 mb-14">
              <Link
                href="/shop"
                className="gold-btn px-7 py-3.5 text-xs font-semibold tracking-wider flex items-center gap-2"
              >
                <span>Explore Catalog</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/custom-gift"
                className="secondary-pill-btn px-7 py-3.5 text-xs font-medium tracking-wider flex items-center gap-2"
              >
                <Sparkles size={14} className="text-[var(--accent)]" />
                <span>Custom Hamper</span>
              </Link>

              <button
                onClick={handleQuickWhatsAppChat}
                className="outline-btn px-6 py-3.5 text-xs font-medium tracking-wider flex items-center gap-2 cursor-pointer"
                title="Direct WhatsApp Inquiry"
              >
                <MessageCircle size={14} className="text-[#71806C]" />
                <span>WhatsApp Desk</span>
              </button>
            </div>

            {/* Borderless Feature Highlights with elegant icons & muted text */}
            <div className="grid grid-cols-3 gap-6 max-w-xl pt-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[var(--text)]">
                  <ShieldCheck size={16} strokeWidth={1.75} className="text-[var(--accent)]" />
                  <h4 className="text-xs font-semibold tracking-wide">Artisan Curated</h4>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Handcrafted with signature quality since {settings.establishedYear}.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[var(--text)]">
                  <Package size={16} strokeWidth={1.75} className="text-[var(--accent)]" />
                  <h4 className="text-xs font-semibold tracking-wide">Padded Dispatch</h4>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Carefully boxed & insulated for seamless transit.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[var(--text)]">
                  <HeartHandshake size={16} strokeWidth={1.75} className="text-[var(--accent)]" />
                  <h4 className="text-xs font-semibold tracking-wide">Direct Care</h4>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Live photo preview via WhatsApp before dispatch.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Borderless Softly Rounded Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/5 bg-[var(--bg-subtle)] border border-[var(--border)] group">
              {/* Main Visual Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80"
                  alt="LETTERS Luxury Gifting Showcase"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                {/* Floating Glassmorphic Pill Banner */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#FFFDF9]/90 dark:bg-[#161513]/90 backdrop-blur-md border border-[#DDD3C4]/60 dark:border-[#332F2A] flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[11px] font-medium text-[var(--text-muted)] block mb-0.5">
                      Featured Series
                    </span>
                    <h3 className="font-heading font-semibold text-sm text-[var(--text)]">
                      Bespoke Hampers & Bouquets
                    </h3>
                  </div>
                  <Link
                    href="/shop"
                    className="w-9 h-9 rounded-full bg-[#1C1C1A] text-[#FFFDF9] dark:bg-[#C9A46C] dark:text-[#161513] hover:bg-[#C9A46C] hover:text-[#1C1C1A] flex items-center justify-center transition-all shadow-sm"
                    aria-label="View shop"
                  >
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Floating Pill Rating Tag */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/90 dark:bg-[#161513]/90 backdrop-blur-md border border-[#DDD3C4]/60 dark:border-[#332F2A] flex items-center gap-2 shadow-sm">
                <span className="text-xs font-semibold text-[var(--text)]">5.0 ★</span>
                <span className="text-[11px] text-[var(--text-muted)]">2,500+ Hampers</span>
              </div>

              {/* Name Engraved Pill Badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#FFFDF9]/90 dark:bg-[#161513]/90 backdrop-blur-md border border-[#DDD3C4]/60 dark:border-[#332F2A] flex items-center gap-1.5 shadow-sm">
                <Sparkles size={12} className="text-[var(--accent)]" />
                <span className="text-[11px] font-medium text-[var(--text)]">
                  Name Engraved
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
